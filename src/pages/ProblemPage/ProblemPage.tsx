import {
  Button,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
  UnstyledButton,
} from '@mantine/core';
import HTMLReactParser from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { HiCheck, HiOutlineRefresh, HiX } from 'react-icons/hi';
import { IoShuffle } from 'react-icons/io5';
import GenericInput from '../../components/generics/GenericInput';
import { auth } from '../../util/firebase';
import useUpdate from '../../hooks/useUpdate';
import useTestCases, { ITestCase } from '../../hooks/useTestCases';
import useQuestion from '../../hooks/useQuestion';

const ProblemPage = () => {
  const { getProblemStatement } = useQuestion();
  const [user] = useAuthState(auth);
  const { isLoading, updateDocument } = useUpdate();

  const { testCases, getRandomUnsolvedTestCase, markAsSolved } = useTestCases();

  const [currentTestCase, setCurrentTestCase] = useState<ITestCase | undefined>(
    undefined
  );

  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [incorrectAnswer, setIncorrectAnswer] = useState(false);

  useEffect(() => {
    if (testCases.length !== 0 && currentTestCase === undefined) {
      setCurrentTestCase(getRandomUnsolvedTestCase());
    }
  }, [testCases]);

  const handleSubmitInput = () => {
    if (!inputValue || !currentTestCase) {
      return;
    }

    const { expected } = currentTestCase;
    if (expected) {
      if (inputValue === expected && currentTestCase !== undefined) {
        const solvedTestCases = [
          ...testCases.filter((tc) => tc.solved).map((tc) => tc.input),
          currentTestCase.input,
        ];
        updateDocument('users', user!.uid, {
          solvedTestCases,
        });
        markAsSolved(currentTestCase);
        setCurrentTestCase({ ...currentTestCase, solved: true });
        setIncorrectAnswer(false);
      } else {
        setIncorrectAnswer(true);
      }
    }
  };

  const handleNext = () => {
    setInputValue('');
    setCurrentTestCase(getRandomUnsolvedTestCase());
  };

  const handleReset = () => {
    updateDocument('users', user!.uid, {
      solvedTestCases: '',
    });
    setCurrentTestCase(getRandomUnsolvedTestCase());
  };

  const noneSolved = testCases.filter((tc) => tc.solved).length === 0;
  const allSolved = testCases.filter((tc) => !tc.solved).length === 0;

  return (
    <ScrollArea className='h-full'>
      <Stack className='p-4'>
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
                {
                  testCases.filter((tc) => tc.solved && !tc.student_generated)
                    .length
                }
              </Text>
            </Text>
            <UnstyledButton onClick={handleReset} disabled={noneSolved}>
              <HiOutlineRefresh
                size='24px'
                className={
                  noneSolved
                    ? 'bg-gray-200 stroke-gray-400 rounded-full p-1'
                    : 'bg-emerald-500 stroke-emerald-50 rounded-full p-1'
                }
              />
            </UnstyledButton>
            <UnstyledButton onClick={handleNext} disabled={allSolved}>
              <IoShuffle
                size='24px'
                className={
                  allSolved
                    ? 'bg-gray-200 stroke-gray-400 rounded-full p-1'
                    : 'bg-emerald-500 stroke-emerald-50 rounded-full p-1'
                }
              />
            </UnstyledButton>
          </Group>
        </Group>
        {allSolved ? (
          <Text>All test cases solved!</Text>
        ) : (
          <>
            <Text>
              Given input:{' '}
              <Text inherit component='span' className=' font-bold'>
                {currentTestCase?.input}
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
                  (incorrectAnswer && (
                    <HiX size='32px' className=' fill-red-500 p-1' />
                  )) ||
                  (currentTestCase?.solved && (
                    <HiCheck size='32px' className=' fill-green-500 p-1' />
                  ))
                }
              />
              {currentTestCase?.solved ? (
                <Button
                  size='md'
                  className='bg-emerald-500 fill-emerald-50 hover:bg-emerald-600'
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  size='md'
                  className='bg-emerald-500 fill-emerald-50 hover:bg-emerald-600'
                  onClick={handleSubmitInput}
                  disabled={isLoading}
                >
                  Submit
                </Button>
              )}
            </Group>
          </>
        )}
      </Stack>
    </ScrollArea>
  );
};

export default ProblemPage;
