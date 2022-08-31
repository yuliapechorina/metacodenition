import {
  Button,
  Center,
  Checkbox,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { HiCheck, HiPlus, HiTrash, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { getAnalytics, logEvent } from 'firebase/analytics';
import ProblemPopover from '../../components/ProblemPopover';
import useNotifications, {
  INotification,
} from '../../context/NotificationContext';
import useTestCases, { ITestCase, ResultType } from '../../hooks/useTestCases';
import GenericButton from '../../components/generics/GenericButton';
import useAssignment from '../../context/AssignmentContext';

const TestCasePage = () => {
  const { setUnsavedChanges } = useAssignment();
  const { testCases, runCases, addUserTestCase, deleteUserTestCase } =
    useTestCases();
  const [selectedTestCases, setSelectedTestCases] = useState<ITestCase[]>([]);
  const [running, setRunning] = useState(false);

  const [isProblemOpened, setProblemOpened] = useState(false);

  const [displayInputRow, setDisplayInputRow] = useState(false);

  const [parentCheckboxState, setParentCheckboxState] =
    useState<boolean>(false);

  const { addNotification } = useNotifications();

  const analytics = getAnalytics();

  const handleParentCheckboxChange = (value: boolean) => {
    setSelectedTestCases(
      testCases.filter((testCase) => testCase.solved && value)
    );
    setParentCheckboxState(value);
  };

  const handleRunButtonPress = async () => {
    const noTestCasesNotification: INotification = {
      type: 'failure',
      content: <Text>No test cases selected</Text>,
    };
    if (selectedTestCases.length === 0) {
      addNotification!(noTestCasesNotification);
      return;
    }

    logEvent(analytics, 'run_test_cases', {
      num_test_cases: selectedTestCases.length,
    });

    setRunning(true);
    const testCaseResults = await runCases(selectedTestCases);
    setSelectedTestCases(testCaseResults);
    const passCount = testCaseResults.reduce(
      (a, c) => (c.result === 'pass' ? a + 1 : a),
      0
    );

    const notification: INotification =
      passCount === selectedTestCases.length
        ? {
            type: 'success',
            content: <Text>All selected test cases passed!</Text>,
          }
        : {
            type: 'failure',
            content: (
              <Text>{`${selectedTestCases.length - passCount}/${
                selectedTestCases.length
              } test cases failed!`}</Text>
            ),
          };

    addNotification!(notification);
    setRunning(false);
  };

  const handleCheckboxChange = (testCase: ITestCase, selected: boolean) =>
    selected
      ? setSelectedTestCases([...selectedTestCases, testCase])
      : setSelectedTestCases(selectedTestCases.filter((tc) => tc !== testCase));

  const defaultResult: ResultType = 'unrun';
  const defaultUserTestCase = {
    input: '',
    expected: '',
    output: '',
    solved: true,
    result: defaultResult,
    student_generated: true,
  };

  const [inputTestCase, setInput] = useState<ITestCase>(defaultUserTestCase);

  const addTestCase = () => {
    setDisplayInputRow(true);
    setInput(defaultUserTestCase);
  };

  const removeTestCase = () => {
    setDisplayInputRow(false);
    setInput(defaultUserTestCase);
  };

  useEffect(() => setUnsavedChanges!(displayInputRow), [displayInputRow]);

  const saveTestCase = () => {
    logEvent(analytics, 'add_test_case');

    if (
      testCases.filter(
        (tc) => tc.student_generated && tc.input === inputTestCase.input
      ).length > 0
    ) {
      addNotification!({
        type: 'failure',
        content: (
          <Text>Can&apos;t add two test cases with the same input!</Text>
        ),
      });
      return;
    }
    addUserTestCase(inputTestCase);
    setDisplayInputRow(false);
    setInput(defaultUserTestCase);
  };

  const handleDeleteTestCase = (testCase: ITestCase) => {
    deleteUserTestCase(testCase);
    setSelectedTestCases(selectedTestCases.filter((tc) => tc !== testCase));
  };

  const inputRow = (
    <>
      <tr>
        <td className='min-w-0 w-fit'>
          <Center>
            <Checkbox disabled />
          </Center>
        </td>
        <td>
          <TextInput
            value={inputTestCase.input}
            onChange={(e) =>
              setInput({ ...inputTestCase, input: e.currentTarget.value })
            }
            className='max-w-md'
          />
        </td>
        <td className='whitespace-pre'>
          {inputTestCase.output || 'not run yet'}
        </td>
        <td>
          <TextInput
            value={inputTestCase.expected}
            onChange={(e) =>
              setInput({ ...inputTestCase, expected: e.currentTarget.value })
            }
            className='max-w-md'
          />
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          <Center className='space-x-4'>
            <Button
              size='sm'
              className='bg-emerald-500 fill-green-50 hover:bg-emerald-600'
              onClick={() => saveTestCase()}
            >
              <HiCheck />
            </Button>
            <Button
              size='sm'
              className='bg-rose-500 fill-red-50 hover:bg-rose-600'
              onClick={() => removeTestCase()}
            >
              <HiX />
            </Button>
          </Center>
        </td>
      </tr>
    </>
  );
  const rows = (
    <>
      {testCases.map((testCase, i) => (
        <tr
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={`${
            testCase.result !== 'unrun' &&
            (testCase.result === 'pass' ? 'bg-green-100' : 'bg-red-100')
          } ${testCase.student_generated ? 'font-bold' : ''}`}
        >
          <td>
            <Center>
              <Checkbox
                checked={selectedTestCases.includes(testCase)}
                onChange={(e) =>
                  handleCheckboxChange(testCase, e.currentTarget.checked)
                }
                disabled={!testCase.solved}
              />
            </Center>
          </td>
          <td>{testCase.input}</td>
          <td className='whitespace-pre'>{testCase.output || 'not run yet'}</td>
          <td>
            <Group className='inline-flex items-center '>
              <Text size='sm'>
                {testCase.solved ? testCase.expected : 'Solve manually first!'}
              </Text>
              {testCase.student_generated && (
                <UnstyledButton
                  onClick={() => handleDeleteTestCase(testCase)}
                  className='hover:bg-gray-100 p-2 rounded-md'
                >
                  <HiTrash />
                </UnstyledButton>
              )}
            </Group>
          </td>
        </tr>
      ))}
      {displayInputRow ? (
        inputRow
      ) : (
        <tr>
          <td colSpan={4}>
            <Center>
              <UnstyledButton
                onClick={() => addTestCase()}
                className='hover:bg-gray-100 inline-flex items-center p-3 text-sm space-x-1 rounded-md'
              >
                <Text size='sm'>Add your own</Text>
                <HiPlus />
              </UnstyledButton>
            </Center>
          </td>
        </tr>
      )}
    </>
  );

  return (
    <ScrollArea className='h-full'>
      <Stack className='p-4 pb-24 h-full'>
        <Group className='justify-between'>
          <Title order={4}>Run test cases</Title>
          <ProblemPopover
            opened={isProblemOpened}
            setOpened={setProblemOpened}
          />
        </Group>
        <Text>
          You&apos;ll only be able to run test cases you&apos;ve previously
          solved in the
          <Text<typeof Link>
            component={Link}
            to='../problem'
            className='text-blue-600'
          >
            {' '}
            understanding the problem{' '}
          </Text>
          stage
        </Text>
        <Table>
          <thead>
            <tr>
              <th className='min-w-fit w-12'>
                <Center>
                  <Checkbox
                    checked={parentCheckboxState}
                    onChange={(e) =>
                      handleParentCheckboxChange(e.currentTarget.checked)
                    }
                  />
                </Center>
              </th>
              <th>Input</th>
              <th>Output</th>
              <th>Expected</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Stack>
      <Group className='absolute bottom-0 w-full p-4 backdrop-blur-sm bg-white/60 border-t-gray-200 border-t-[1px] justify-center'>
        <GenericButton
          text='Run'
          onClick={handleRunButtonPress}
          disabled={running}
          loading={running}
        />
      </Group>
    </ScrollArea>
  );
};

export default TestCasePage;
