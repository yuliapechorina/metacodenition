import {
  ActionIcon,
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
  Notification,
} from '@mantine/core';
import { ReactNode, useState } from 'react';
import { HiCheck, HiPlus, HiTrash, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import ProblemPopover from '../../components/ProblemPopover';
import useTestCases, { ITestCase, ResultType } from '../../hooks/useTestCases';

const TestCasePage = () => {
  const { testCases, runCases, addUserTestCase, deleteUserTestCase } =
    useTestCases();
  const [selectedTestCases, setSelectedTestCases] = useState<ITestCase[]>([]);
  const [loading, setLoading] = useState(false);

  type NotificationType = 'success' | 'failure';
  interface INotification {
    type: NotificationType;
    content: ReactNode;
  }
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const [isProblemOpened, setProblemOpened] = useState(false);

  const [displayInputRow, setDisplayInputRow] = useState(false);

  const [parentCheckboxState, setParentCheckboxState] =
    useState<boolean>(false);

  const handleParentCheckboxChange = (value: boolean) => {
    setSelectedTestCases(
      testCases.filter((testCase) => testCase.solved && value)
    );
    setParentCheckboxState(value);
  };

  const handleRunButtonPress = async () => {
    setLoading(true);
    const testCaseResults = await runCases(selectedTestCases);
    setSelectedTestCases(testCaseResults);
    const passCount = testCaseResults.reduce(
      (a, c) => (c.result === 'pass' ? a + 1 : a),
      0
    );

    const notification: INotification =
      passCount === selectedTestCases.length
        ? { type: 'success', content: 'All selected test cases passed!' }
        : {
            type: 'failure',
            content: `${selectedTestCases.length - passCount}/${
              selectedTestCases.length
            } test cases failed!`,
          };

    setNotifications([...notifications, notification]);
    setLoading(false);
  };

  const getNotificationIcon = (notification: INotification) => {
    switch (notification?.type) {
      case 'success':
        return <HiCheck size={18} />;
      case 'failure':
        return <HiX size={18} />;
      default:
        return null;
    }
  };

  const getNotificationTitle = (notification: INotification) =>
    (notification!.type.at(0)?.toUpperCase() || '') +
    notification!.type.slice(1);

  const getNotificationColour = (notification: INotification) => {
    switch (notification?.type) {
      case 'success':
        return 'green';
      case 'failure':
        return 'red';
      default:
        return 'orange';
    }
  };

  const removeNotification = (notification: INotification) => {
    setNotifications(notifications.filter((n) => n !== notification));
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

  const saveTestCase = () => {
    addUserTestCase(inputTestCase);
    setDisplayInputRow(false);
    setInput(defaultUserTestCase);
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
          />
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          <Center>
            <Button
              size='sm'
              className='bg-green-500 fill-green-50 hover:bg-green-600'
              onClick={() => saveTestCase()}
            >
              <HiCheck />
            </Button>
            <Button
              size='sm'
              className='bg-red-500 fill-red-50 hover:bg-red-600'
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
            <Center>
              {testCase.solved ? testCase.expected : 'Solve manually first!'}
              {testCase.student_generated && (
                <ActionIcon onClick={() => deleteUserTestCase(testCase)}>
                  <HiTrash />
                </ActionIcon>
              )}
            </Center>
          </td>
        </tr>
      ))}
      {displayInputRow ? (
        inputRow
      ) : (
        <tr>
          <td colSpan={4}>
            <Center>
              <ActionIcon size='lg' onClick={() => addTestCase()}>
                <HiPlus />
              </ActionIcon>
            </Center>
          </td>
        </tr>
      )}
    </>
  );

  return (
    <ScrollArea className='h-full'>
      <Stack className='p-4 h-full'>
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
            to='../step-1'
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
        <Group className='justify-center'>
          <Button
            size='md'
            className='bg-emerald-500 fill-emerald-50 hover:bg-emerald-600'
            onClick={handleRunButtonPress}
            disabled={loading}
            loading={loading}
          >
            Run
          </Button>
          <Button
            size='md'
            className='bg-blue-500 fill-blue-50 hover:bg-blue-600'
          >
            Submit
          </Button>
        </Group>
        <ScrollArea
          type='hover'
          className='!fixed right-0 top-0 mt-4 mb-4 pb-8 ml-8 mr-4 pr-4 max-w-md h-full'
        >
          <Stack className='h-full'>
            {notifications.map((notification, i) => (
              <Notification
                icon={getNotificationIcon(notification)}
                title={getNotificationTitle(notification)}
                color={getNotificationColour(notification)}
                className='backdrop-blur-sm bg-transparent'
                classNames={{ title: 'text-lg' }}
                onClose={() => removeNotification(notification)}
                // eslint-disable-next-line react/no-array-index-key
                key={i}
              >
                {notification.content}
              </Notification>
            ))}
          </Stack>
        </ScrollArea>
      </Stack>
    </ScrollArea>
  );
};

export default TestCasePage;
