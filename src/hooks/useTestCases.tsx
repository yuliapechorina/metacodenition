import { useEffect, useState } from 'react';
import { submitRun } from '../api/codeRunner.api';
import useCode from '../context/CodeContext';
import useQuestion from './useQuestion';

export type ResultType = 'pass' | 'fail' | 'unrun';

export interface ITestCase {
  input: string;
  expected: string;
  output: string;
  solved: boolean;
  result: ResultType;
  student_generated?: boolean;
}

const useTestCases = () => {
  const [testCases, setTestCases] = useState<ITestCase[]>([]);
  const { getRunFile } = useCode();

  const {
    defaultTestCases,
    solvedTestCases,
    userTestCases,
    updateUserQuestionDocument,
  } = useQuestion();

  const runCases = async (runTestCases: ITestCase[]) => {
    const runCode = async (testCase: ITestCase) => {
      const { input, expected } = testCase;
      try {
        const runResult = await submitRun({
          run_spec: {
            language_id: 'c',
            sourcefilename: 'test.c',
            sourcecode: getRunFile!(),
            input,
          },
        });
        if (runResult.stderr || runResult.cmpinfo)
          throw new Error(runResult.stderr || runResult.cmpinfo);

        const result: ResultType =
          runResult.stdout === expected ? 'pass' : 'fail';
        const newTestCase = { ...testCase, output: runResult.stdout, result };
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
      const availableQuestionTestCases = new Map<string, string>(
        Object.entries(defaultTestCases)
      );
      const newQuestionTestCases: ITestCase[] = Array.from(
        availableQuestionTestCases
      ).map(([input, expected]) => ({
        input,
        expected,
        output: '',
        solved: false,
        selected: false,
        result: 'unrun',
      }));
      newTestCases.push(...newQuestionTestCases);
    }
    if (userTestCases !== undefined) newTestCases.push(...userTestCases);
    if (solvedTestCases !== undefined) {
      const availableSolvedTestCases = new Map<string, string>(
        Object.entries(solvedTestCases)
      );
      const solvedInputs = Array.from(availableSolvedTestCases).map(
        ([, v]) => v
      );
      const newSolvedTestCases = newTestCases.map((testCase) =>
        solvedInputs.includes(testCase.input)
          ? { ...testCase, solved: true }
          : testCase
      );
      setTestCases(newSolvedTestCases);
    } else setTestCases(newTestCases);
  }, [defaultTestCases, userTestCases, solvedTestCases]);

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
