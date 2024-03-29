import {
  Button,
  Center,
  Checkbox,
  Code,
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
import { logEvent } from 'firebase/analytics';
import { v4 as uuidv4 } from 'uuid';
import ProblemModal from '../../components/ProblemModal';
import useNotifications, {
  INotification,
} from '../../context/NotificationContext';
import useTestCases from '../../hooks/useTestCases';
import GenericButton from '../../components/generics/GenericButton';
import useAssignment from '../../context/AssignmentContext';
import { analytics } from '../../util/firebase';
import { ITestCase, ResultType } from '../../util/testcase';
import useQuestion from '../../hooks/useQuestion';
import { buildTestCaseString } from '../../util/testcase-helpers';
import TestCaseInput from '../../components/CodeRunArea/TestCaseInput';
import HelpButton from '../../components/HelpButton';
import useUser from '../../hooks/useUser';
import useInterventions from '../../hooks/useInterventions';

const TestCasePage = () => {
  const { setUnsavedChanges, questionNumber } = useAssignment();
  const { questionFunction } = useQuestion();
  const { testCases, runCases, addUserTestCase, deleteUserTestCase } =
    useTestCases();
  const { upi, userGroup } = useUser();
  const { interventions } = useInterventions();

  const [parentCheckboxState, setParentCheckboxState] =
    useState<boolean>(false);
  const [selectedTestCaseIds, setSelectedTestCaseIds] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [isProblemOpened, setProblemOpened] = useState(false);

  const handleClickOpenProblem = () => {
    logEvent(analytics, 'open_problem_modal', {
      question_number: questionNumber,
      user_upi: upi,
      user_testing_group: userGroup,
      my_timestamp: new Date(Date.now()).toISOString(),
    });
    setProblemOpened(!isProblemOpened);
  };

  const [displayInputRow, setDisplayInputRow] = useState(false);

  const { addNotification } = useNotifications();

  const handleParentCheckboxChange = (value: boolean) => {
    setSelectedTestCaseIds(
      testCases
        .filter((testCase) => testCase.solved && value)
        .map((tc) => tc.id)
    );
    setParentCheckboxState(value);
  };

  const handleRunButtonPress = async () => {
    const noTestCasesNotification: INotification = {
      type: 'failure',
      content: <Text>No test cases selected</Text>,
    };
    if (selectedTestCaseIds.length === 0) {
      addNotification!(noTestCasesNotification);
      return;
    }

    setRunning(true);
    const testCaseResults = await runCases(
      selectedTestCaseIds.map((id) => testCases.find((tc) => tc.id === id)!)
    );
    const passCount = testCaseResults.reduce(
      (a, c) => (c.result === 'pass' ? a + 1 : a),
      0
    );

    logEvent(analytics, 'run_test_cases', {
      num_test_cases: selectedTestCaseIds.length,
      num_passed: passCount,
      question_number: questionNumber,
      user_upi: upi,
      user_testing_group: userGroup,
      my_timestamp: new Date(Date.now()).toISOString(),
    });

    const notification: INotification =
      passCount === selectedTestCaseIds.length
        ? {
            type: 'success',
            content: <Text>All selected test cases passed!</Text>,
          }
        : {
            type: 'failure',
            content: (
              <Text>{`${selectedTestCaseIds.length - passCount}/${
                selectedTestCaseIds.length
              } test cases failed!`}</Text>
            ),
          };

    addNotification!(notification);
    setRunning(false);
  };

  const handleCheckboxChange = (testCase: ITestCase, selected: boolean) =>
    selected
      ? setSelectedTestCaseIds([...selectedTestCaseIds, testCase.id])
      : setSelectedTestCaseIds(
          selectedTestCaseIds.filter((id) => id !== testCase.id)
        );

  const defaultResult: ResultType = 'unrun';
  const getDefaultUserTestCase = (): ITestCase => ({
    id: uuidv4(),
    input:
      questionFunction?.arguments?.map((arg) => ({ ...arg, value: '' })) ?? [],
    expected: '',
    output: undefined,
    solved: true,
    result: defaultResult,
    student_generated: true,
  });

  const [inputTestCase, setInput] = useState<ITestCase>(
    getDefaultUserTestCase()
  );

  const addTestCase = () => {
    setDisplayInputRow(true);
    setInput(getDefaultUserTestCase());
  };

  const removeTestCase = () => {
    setDisplayInputRow(false);
    setInput(getDefaultUserTestCase());
  };

  useEffect(() => setUnsavedChanges!(displayInputRow), [displayInputRow]);

  const saveTestCase = () => {
    logEvent(analytics, 'add_test_case', {
      question_number: questionNumber,
      user_upi: upi,
      user_testing_group: userGroup,
      my_timestamp: new Date(Date.now()).toISOString(),
    });

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
    setInput(getDefaultUserTestCase);
  };

  const handleDeleteTestCase = (testCase: ITestCase) => {
    deleteUserTestCase(testCase);
    setSelectedTestCaseIds(
      selectedTestCaseIds.filter((id) => id !== testCase.id)
    );

    logEvent(analytics, 'delete_test_case', {
      question_number: questionNumber,
      user_upi: upi,
      user_testing_group: userGroup,
      my_timestamp: new Date(Date.now()).toISOString(),
    });
  };

  const getOutputString = (output?: string) => {
    if (output === undefined) {
      return 'Not run yet!';
    }
    if (output === '') {
      return 'No output!';
    }
    return output;
  };

  const getOutputColumn = (output?: string) => {
    const outputString = getOutputString(output);
    if (outputString === 'Not run yet!') {
      return outputString;
    }
    if (outputString === 'No output!') {
      return outputString;
    }
    return (
      <Code block className='text-md w-fit'>
        {outputString}
      </Code>
    );
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
          <TestCaseInput
            value={inputTestCase.input}
            onChange={(value) => setInput({ ...inputTestCase, input: value })}
          />
        </td>
        <td className='whitespace-pre'>
          {getOutputString(inputTestCase.output)}
        </td>
        <td>
          <TextInput
            value={inputTestCase.expected}
            onChange={(e) =>
              setInput({ ...inputTestCase, expected: e.currentTarget.value })
            }
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
            testCase.result &&
            testCase.result !== 'unrun' &&
            (testCase.result === 'pass' ? 'bg-green-100' : 'bg-red-100')
          } ${testCase.student_generated ? 'font-bold' : ''}`}
        >
          <td>
            <Center>
              <Checkbox
                checked={selectedTestCaseIds.includes(testCase.id)}
                onChange={(e) =>
                  handleCheckboxChange(testCase, e.currentTarget.checked)
                }
                disabled={!testCase.solved}
              />
            </Center>
          </td>
          <td>
            <Code block className='text-md w-fit'>
              {testCase && buildTestCaseString(questionFunction, testCase)}
            </Code>
          </td>
          <td>{getOutputColumn(testCase.output)}</td>
          <td>
            <Group className='inline-flex'>
              {testCase.solved ? (
                <Code block className='text-md'>
                  {testCase.expected}
                </Code>
              ) : (
                'Solve manually first!'
              )}
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
    <>
      <ScrollArea className='h-full'>
        <Stack className='p-4 pb-24 h-full'>
          <Group className='justify-between'>
            <Title order={4}>Run test cases</Title>
            <HelpButton onClick={handleClickOpenProblem} />
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
            stage.
            {interventions.find((i) => i.name === 'Understanding the problem')
              ?.enabled ? (
              ''
            ) : (
              <Text>
                Enable the stage via the settings button in the top right
                corner. You can still add your own test cases at the bottom of
                the page.
              </Text>
            )}
          </Text>
          <Table>
            <thead>
              <tr>
                <th className='min-w-fit w-12'>
                  <Center>
                    <Checkbox
                      indeterminate={
                        selectedTestCaseIds.length > 0 &&
                        selectedTestCaseIds.length !== testCases.length
                      }
                      checked={
                        selectedTestCaseIds.length > 0 && parentCheckboxState
                      }
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
      <ProblemModal opened={isProblemOpened} setOpened={setProblemOpened} />
    </>
  );
};

export default TestCasePage;
