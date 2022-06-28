import { Stack, Table, Text, Title } from '@mantine/core';
import { doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';

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

  const rows = Array.from(testCases).map(([key, value]) => {
    const solved = solvedTestCases.includes(key);

    return (
      <tr key={key}>
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
          to='step-1'
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
            <th>Input</th>
            <th>Output</th>
            <th>Expected</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Stack>
  );
};

export default TestCasePage;
