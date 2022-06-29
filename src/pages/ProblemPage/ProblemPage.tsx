import {
  Button,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
  UnstyledButton,
} from '@mantine/core';
import { arrayUnion, doc } from 'firebase/firestore';
import HTMLReactParser from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { HiOutlineRefresh, HiX } from 'react-icons/hi';
import GenericInput from '../../components/generics/GenericInput';
import useProblem from '../../context/ProblemContext';
import { auth, db } from '../../util/firebase';
import useUpdate from '../../hooks/useUpdate';

const ProblemPage = () => {
  const { getProblemStatement } = useProblem();
  const [user] = useAuthState(auth);
  const { isLoading, updateDocument } = useUpdate();

  const [testCases, setTestCases] = useState<Map<string, number>>(
    new Map<string, number>([])
  );

  const [currentTestCase, setCurrentTestCase] = useState<string | undefined>(
    undefined
  );
  const [solvedTestCases, setSolvedTestCases] = useState<string[]>([]);

  const questionDoc = doc(db, 'questions', 'wIK4Zf2d0ZKLpnnzsfxp');
  const [questionData] = useDocumentData(questionDoc);

  const userDoc = user ? doc(db, 'users', user!.uid) : undefined;
  const [userData] = useDocumentData(userDoc);

  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [incorrectAnswer, setIncorrectAnswer] = useState(false);

  useEffect(() => {
    if (questionData) {
      const availableTestCases = new Map<string, number>(
        Object.entries(questionData.testCases)
      );
      const unsolvedTestCases = new Map<string, number>([]);

      availableTestCases.forEach((value, key) => {
        if (!solvedTestCases.includes(key)) {
          unsolvedTestCases.set(key, value);
        }
      });

      setTestCases(unsolvedTestCases);
    }
  }, [questionData, solvedTestCases]);

  useEffect(() => {
    if (userData && userData.solvedTestCases) {
      setSolvedTestCases(userData.solvedTestCases);
    }
  }, [userData]);

  useEffect(() => {
    if (testCases.size !== 0) {
      setCurrentTestCase(testCases?.keys().next().value);
    }
  }, [testCases]);

  const handleSubmitInput = () => {
    if (!inputValue || !currentTestCase) {
      return;
    }

    const answer = testCases.get(currentTestCase);
    if (answer) {
      if (Number(inputValue) === Number(answer)) {
        updateDocument('users', user!.uid, {
          solvedTestCases: arrayUnion(currentTestCase),
        });
        setInputValue('');
        if (testCases.size !== 0) {
          testCases.delete(currentTestCase);
          setCurrentTestCase(testCases?.keys().next().value);
        }
        setIncorrectAnswer(false);
      } else {
        setIncorrectAnswer(true);
      }
    }
  };

  const handleRefresh = () => {
    let randomTestCase = currentTestCase;
    while (randomTestCase === currentTestCase) {
      const keys = Array.from(testCases.keys());
      randomTestCase = keys[Math.floor(Math.random() * keys.length)];
    }
    setCurrentTestCase(randomTestCase);
  };

  return (
    <Stack className='p-2'>
      <Title order={4}>Problem:</Title>
      <Text className='text-justify'>
        <TypographyStylesProvider>
          {HTMLReactParser(getProblemStatement!())}
        </TypographyStylesProvider>
      </Text>
      <Divider />
      <Group className='w-full h-fit justify-between'>
        <Title order={4}>Check my understanding:</Title>
        <Group className='h-full w-fit'>
          <Text>
            Test cases solved:{' '}
            <Text inherit component='span' className=' font-bold'>
              {solvedTestCases.length}
            </Text>
          </Text>
          <UnstyledButton
            onClick={handleRefresh}
            disabled={testCases.size <= 1}
          >
            <HiOutlineRefresh
              size='24px'
              className=' bg-emerald-500 stroke-emerald-50 rounded-full p-1'
            />
          </UnstyledButton>
        </Group>
      </Group>
      {testCases.size === 0 ? (
        <Text>All test cases solved!</Text>
      ) : (
        <>
          <Text>
            Given input:{' '}
            <Text inherit component='span' className=' font-bold'>
              {currentTestCase}
            </Text>
          </Text>
          <Text>What is the output? </Text>
          <Group className='w-full h-fit'>
            <GenericInput
              placeholder='Enter your expected output'
              value={inputValue}
              onChange={(e?: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e!.target.value)
              }
              rightSection={
                incorrectAnswer && (
                  <HiX size='32px' className=' fill-red-500 p-1' />
                )
              }
            />
            <Button
              size='md'
              className='bg-emerald-500 fill-emerald-50 hover:bg-emerald-600'
              onClick={handleSubmitInput}
              disabled={isLoading}
            >
              Submit
            </Button>
          </Group>
        </>
      )}
    </Stack>
  );
};

export default ProblemPage;
