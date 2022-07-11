import {
  Button,
  Checkbox,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';
import { auth, db } from '../../util/firebase';

const TestCasePage = () => {
  const [user] = useAuthState(auth);

  const [testCases, setTestCases] = useState<Map<string, number>>(
    new Map<string, number>([])
  );
  const [solvedTestCases, setSolvedTestCases] = useState<string[]>([]);

  const questionDoc = doc(db, 'questions', 'wIK4Zf2d0ZKLpnnzsfxp');
  const [questionData] = useDocumentData(questionDoc);

  const userDoc = user ? doc(db, 'users', user!.uid) : undefined;
  const [userData] = useDocumentData(userDoc);

  useEffect(() => {
    if (questionData) {
      const availableTestCases = new Map<string, number>(
        Object.entries(questionData.testCases)
      );
      setTestCases(availableTestCases);
    }
  }, [questionData, solvedTestCases]);

  useEffect(() => {
    if (userData && userData.solvedTestCases) {
      setSolvedTestCases(userData.solvedTestCases);
    }
  }, [userData]);

  const [checkboxStates, setCheckboxStates] = useState<Map<string, boolean>>(
    new Map<string, boolean>([])
  );

  useEffect(() => {
    if (checkboxStates.size === 0) {
      setCheckboxStates(
        new Map(Array.from(testCases).map(([key]) => [key, false]))
      );
    }
  }, [testCases]);

  const handleCheckboxChange = (key: string) => {
    const newCheckBoxStates = new Map(checkboxStates);
    newCheckBoxStates.set(key, !checkboxStates.get(key));
    setCheckboxStates(newCheckBoxStates);
  };

  const [parentCheckboxState, setParentCheckboxState] =
    useState<boolean>(false);

  const handleParentCheckboxChange = () => {
    const newCheckboxStates = new Map(
      Array.from(checkboxStates).map(([key, value]) => {
        const solved = solvedTestCases.includes(key);
        return solved ? [key, !parentCheckboxState] : [key, value];
      })
    );
    setCheckboxStates(newCheckboxStates);
    setParentCheckboxState(!parentCheckboxState);
  };

  const rows = Array.from(testCases).map(([key, value]) => {
    const solved = solvedTestCases.includes(key);

    return (
      <tr key={key}>
        <td>
          <Checkbox
            checked={checkboxStates.get(key) ?? false}
            onChange={() => handleCheckboxChange(key)}
            disabled={!solved}
          />
        </td>
        <td>{key}</td>
        <td>Not run yet!</td>
        <td>{solved ? value : 'Solve manually first!'}</td>
      </tr>
    );
  });

  return (
    <Stack className='p-2 overflow-y-auto h-full'>
      <Title order={4}>Run test cases</Title>
      <Text>
        You&apos;ll only be able to run test cases you&apos;ve previously solved
        in the
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
            <th>
              {' '}
              <Checkbox
                checked={parentCheckboxState}
                onChange={handleParentCheckboxChange}
              />
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
    </Stack>
  );
};

export default TestCasePage;
