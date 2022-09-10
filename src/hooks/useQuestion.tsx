import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import useAssignment from '../context/AssignmentContext';
import useNotifications from '../context/NotificationContext';
import { auth, db } from '../util/firebase';
import { applyHighlightToText } from '../util/highlighter';
import { IFunction, ITestCase } from '../util/testcase';
import useUpdate from './useUpdate';

const useQuestion = () => {
  const { questionId } = useAssignment();
  const [user] = useAuthState(auth);
  const questionDoc =
    user && questionId !== undefined
      ? doc(db, 'questions', questionId || '')
      : undefined;
  const [questionData] = useDocumentData(questionDoc);
  const userQuestionDoc =
    user && questionId
      ? doc(db, 'users', user!.uid, 'questions', questionId)
      : undefined;
  const [userQuestionData] = useDocumentData(userQuestionDoc);

  const [questionFunction, setQuestionFunction] = useState<IFunction>({});
  const [problemStatement, setProblemStatement] = useState<string>('');
  const [defaultTestCases, setDefaultTestCases] = useState<any[]>([]);
  const [initialCode, setInitialCode] = useState<string>('');
  const [codeTemplate, setCodeTemplate] = useState<string>('');

  useEffect(() => {
    if (questionData?.function !== undefined)
      setQuestionFunction(questionData.function);
    if (questionData?.text !== undefined)
      setProblemStatement(questionData.text);
    if (questionData?.testCases !== undefined)
      setDefaultTestCases(questionData.testCases);
    if (questionData?.initialCode !== undefined)
      setInitialCode(questionData.initialCode);
    if (questionData?.codeTemplate !== undefined)
      setCodeTemplate(questionData.codeTemplate);
  }, [questionData]);

  const [highlights, setHighlights] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [solvedTestCaseIds, setSolvedTestCaseIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [usedParsonsIds, setUsedParsonsIds] = useState<any[]>([]);
  const [userCode, setUserCode] = useState<string>('');
  const [userTestCases, setUserTestCases] = useState<ITestCase[]>([]);

  useEffect(() => {
    if (userQuestionData?.highlights !== undefined)
      setHighlights(userQuestionData?.highlights);
    if (userQuestionData?.actions !== undefined)
      setActions(userQuestionData?.actions);
    if (userQuestionData?.solvedTestCaseIds !== undefined)
      setSolvedTestCaseIds(userQuestionData?.solvedTestCaseIds);
    if (userQuestionData?.submitted !== undefined)
      setSubmitted(userQuestionData?.submitted);
    if (userQuestionData?.usedParsonsIds !== undefined)
      setUsedParsonsIds(userQuestionData?.usedParsonsIds);
    if (userQuestionData?.userCode !== undefined)
      setUserCode(userQuestionData?.userCode);
    if (userQuestionData?.userTestCases !== undefined)
      setUserTestCases(userQuestionData?.userTestCases);
  }, [userQuestionData]);

  useEffect(() => {
    if (userQuestionDoc) {
      getDoc(userQuestionDoc).then((d) => {
        if (!d.exists()) {
          setDoc(userQuestionDoc, {
            highlights: [],
            solvedTestCaseIds: [],
            submitted: false,
            usedParsonsIds: [],
            userCode: '',
            userTestCases: [],
          });
        }
      });
    }
  }, [userQuestionDoc, questionId]);

  const { isLoading, isError, updateDocumentRef } = useUpdate();

  const { addNotification } = useNotifications();

  const updateUserQuestionDocument = async (data: { [x: string]: any }) =>
    userQuestionDoc && updateDocumentRef(userQuestionDoc, data);

  const getProblemStatement = useCallback(
    () =>
      `<p class='whitespace-pre-line'>${applyHighlightToText(
        problemStatement.replaceAll('\\t', '\t').replaceAll('\\n', '\n'),
        highlights
      )}</p>`,
    [problemStatement, highlights]
  );

  useEffect(() => {
    if (isError)
      addNotification!({
        type: 'failure',
        content: 'Error loading question data',
      });
  }, [isError]);

  return {
    questionId,
    questionFunction,
    defaultTestCases,
    initialCode,
    codeTemplate,
    highlights,
    actions,
    solvedTestCaseIds,
    submitted,
    usedParsonsIds,
    userCode,
    userTestCases,
    isLoading,
    isError,
    getProblemStatement,
    updateUserQuestionDocument,
  };
};

export default useQuestion;
