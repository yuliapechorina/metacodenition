import React, { useEffect, useState } from 'react';
import { Group, Text, Title, UnstyledButton } from '@mantine/core';
import { HiCheck, HiOutlineRefresh, HiX } from 'react-icons/hi';
import { IoShuffle } from 'react-icons/io5';
import useQuestion from '../../hooks/useQuestion';
import useTestCases, { ITestCase } from '../../hooks/useTestCases';
import GenericInput from '../generics/GenericInput';
import GenericButton from '../generics/GenericButton';

const TestCaseSolver = () => {
  const { isLoading, updateUserQuestionDocument } = useQuestion();
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
        updateUserQuestionDocument({
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
    updateUserQuestionDocument({
      solvedTestCases: '',
    });
    setCurrentTestCase(getRandomUnsolvedTestCase());
  };

  const noneSolved = testCases.filter((tc) => tc.solved).length === 0;
  const allSolved = testCases.filter((tc) => !tc.solved).length === 0;

  return (
    <>
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
              <GenericButton
                text='Next Question'
                onClick={handleNext}
                disabled={isLoading}
              />
            ) : (
              <GenericButton
                text='Submit'
                onClick={handleSubmitInput}
                disabled={isLoading}
              />
            )}
          </Group>
        </>
      )}
    </>
  );
};

export default TestCaseSolver;