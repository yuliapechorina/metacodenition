import React, { useEffect, useState } from 'react';
import {
  Code,
  Group,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { HiCheck, HiOutlineRefresh, HiX } from 'react-icons/hi';
import { IoShuffle } from 'react-icons/io5';
import { logEvent } from 'firebase/analytics';
import useQuestion from '../../hooks/useQuestion';
import useTestCases from '../../hooks/useTestCases';
import GenericInput from '../generics/GenericInput';
import GenericButton from '../generics/GenericButton';
import { analytics } from '../../util/firebase';
import { ITestCase } from '../../util/testcase';
import { buildTestCaseString } from '../../util/testcase-helpers';

const TestCaseSolver = () => {
  const { questionFunction, isLoading, updateUserQuestionDocument } =
    useQuestion();
  const { testCases, getRandomUnsolvedTestCase, markAsSolved } = useTestCases();

  const [currentTestCase, setCurrentTestCase] = useState<ITestCase | undefined>(
    undefined
  );
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [incorrectAnswer, setIncorrectAnswer] = useState(false);

  useEffect(() => {
    if (testCases.length !== 0 && currentTestCase?.solved !== true) {
      setCurrentTestCase(getRandomUnsolvedTestCase());
    }
  }, [testCases]);

  const handleCheckInput = () => {
    if (!inputValue || !currentTestCase) {
      return;
    }

    const { expected } = currentTestCase;
    if (expected) {
      if (inputValue === expected && currentTestCase !== undefined) {
        const solvedTestCaseIds = [
          ...testCases.filter((tc) => tc.solved).map((tc) => tc.id),
          currentTestCase.id,
        ];
        updateUserQuestionDocument({
          solvedTestCaseIds,
        });
        markAsSolved(currentTestCase);
        setCurrentTestCase({ ...currentTestCase, solved: true });
        setIncorrectAnswer(false);

        logEvent(analytics, 'check_test_case', {
          current_test_case: currentTestCase?.input,
          correct: true,
        });
      } else {
        setIncorrectAnswer(true);

        logEvent(analytics, 'check_test_case', {
          current_test_case: currentTestCase?.input,
          correct: false,
        });
      }
    }
  };

  const handleShuffle = () => {
    setInputValue('');
    setCurrentTestCase(getRandomUnsolvedTestCase());
    logEvent(analytics, 'shuffle_test_cases', {
      current_test_case: currentTestCase?.input,
    });
  };

  const handleNext = () => {
    setInputValue('');
    setCurrentTestCase(getRandomUnsolvedTestCase());
    logEvent(analytics, 'next_test_case', {
      current_test_case: currentTestCase?.input,
    });
  };

  const handleReset = () => {
    updateUserQuestionDocument({
      solvedTestCases: '',
    });
    setCurrentTestCase(getRandomUnsolvedTestCase());
    logEvent(analytics, 'reset_test_cases');
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
          <Tooltip label='Restart test cases'>
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
          </Tooltip>
          <Tooltip label='Shuffle test cases'>
            <UnstyledButton onClick={handleShuffle} disabled={allSolved}>
              <IoShuffle
                size='24px'
                className={
                  allSolved
                    ? 'bg-gray-200 stroke-gray-400 rounded-full p-1'
                    : 'bg-emerald-500 stroke-emerald-50 rounded-full p-1'
                }
              />
            </UnstyledButton>
          </Tooltip>
        </Group>
      </Group>
      {allSolved ? (
        <Text>All test cases solved!</Text>
      ) : (
        <>
          <Text>
            Given the following function call:
            <br />
            <Code block className='text-md font-bold'>
              {currentTestCase &&
                buildTestCaseString(questionFunction, currentTestCase)}
            </Code>
          </Text>
          <Text>
            What is{' '}
            {questionFunction?.returnType !== 'void'
              ? 'the value of return_value'
              : 'the output'}
            ?
          </Text>
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
                text='Next Test Case'
                onClick={handleNext}
                disabled={isLoading}
              />
            ) : (
              <GenericButton
                text='Check'
                onClick={handleCheckInput}
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
