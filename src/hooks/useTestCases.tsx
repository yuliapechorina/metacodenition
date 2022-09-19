import { useEffect, useState } from 'react';
import { submitRun } from '../api/codeRunner.api';
import useCode from '../context/CodeContext';
import { IArgument, ITestCase, ResultType } from '../util/testcase';
import useQuestion from './useQuestion';

const useTestCases = () => {
  const [testCases, setTestCases] = useState<ITestCase[]>([]);
  const { getRunFile } = useCode();

  const {
    questionFunction,
    defaultTestCases,
    solvedTestCaseIds,
    userTestCases,
    updateUserQuestionDocument,
  } = useQuestion();

  const constructArgs = (partial: IArgument[]): IArgument[] | undefined =>
    questionFunction?.arguments?.map((arg, idx) => ({
      ...arg,
      ...(partial[idx] ?? {}),
    }));

  const checkResult = (stdout: string, expected: string) =>
    stdout === expected ? 'pass' : 'fail';

  const runCases = async (runTestCases: ITestCase[]) => {
    const runCode = async (testCase: ITestCase) => {
      const { input, expected } = testCase;
      try {
        const runResult = await submitRun({
          run_spec: {
            language_id: 'c',
            sourcefilename: 'test.c',
            sourcecode: getRunFile!(constructArgs(input) ?? []),
            input: '',
          },
        });
        if (runResult.stderr || runResult.cmpinfo)
          throw new Error(runResult.stderr || runResult.cmpinfo);

        const result: ResultType = checkResult(runResult.stdout, expected);
        const newTestCase = {
          ...testCase,
          output: runResult?.stdout ?? '',
          result,
        };
        setTestCases(
          testCases.map((tc) =>
            tc.input === newTestCase.input ? newTestCase : tc
          )
        );
        return newTestCase as ITestCase;
      } catch (error: any) {
        const result: ResultType = 'fail';
        const newTestCase = { ...testCase, output: error.toString(), result };
        setTestCases(
          testCases.map((tc) =>
            tc.input === newTestCase.input ? newTestCase : tc
          )
        );
        return newTestCase as ITestCase;
      }
    };
    const resultTestCases = await Promise.all(
      runTestCases.map((tc) => runCode(tc))
    );
    const newTestCases = testCases.map(
      (tc) => resultTestCases.find((rtc) => rtc.input === tc.input) || tc
    );
    setTestCases(newTestCases);
    return resultTestCases;
  };

  useEffect(() => {
    const newTestCases: ITestCase[] = [];
    if (defaultTestCases !== undefined) {
      const newQuestionTestCases: ITestCase[] = defaultTestCases;
      newTestCases.push(...newQuestionTestCases);
    }
    if (userTestCases !== undefined) newTestCases.push(...userTestCases);
    if (solvedTestCaseIds !== undefined) {
      const newSolvedTestCases = newTestCases.map((testCase) =>
        solvedTestCaseIds.includes(testCase.id)
          ? { ...testCase, solved: true }
          : testCase
      );
      setTestCases(
        newSolvedTestCases.map((tc) => ({ ...tc, result: 'unrun' }))
      );
    } else setTestCases(newTestCases);
  }, [defaultTestCases, userTestCases, solvedTestCaseIds]);

  const getRandomUnsolvedTestCase = () => {
    const unsolvedTestCases = testCases.filter((tc) => !tc.solved);
    return unsolvedTestCases.length > 0
      ? unsolvedTestCases[Math.floor(Math.random() * unsolvedTestCases.length)]
      : undefined;
  };

  const markAsSolved = (testCase: ITestCase) =>
    setTestCases([...testCases, { ...testCase, solved: true }]);

  const addUserTestCase = (testCase: ITestCase) => {
    if (!testCase.student_generated) return;
    updateUserQuestionDocument({
      userTestCases: [...userTestCases, testCase],
    });
  };

  const deleteUserTestCase = (testCase: ITestCase) => {
    if (!testCase.student_generated) return;
    const newUserTestCases = testCases.filter(
      (tc) => tc.student_generated && tc.input !== testCase.input
    );
    updateUserQuestionDocument({
      userTestCases: newUserTestCases,
    });
  };

  return {
    testCases,
    runCases,
    getRandomUnsolvedTestCase,
    markAsSolved,
    addUserTestCase,
    deleteUserTestCase,
  };
};

export default useTestCases;
