import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import useAssignment from '../context/AssignmentContext';
import useNotifications from '../context/NotificationContext';
import { auth, db } from '../util/firebase';
import { applyHighlightToText } from '../util/highlighter';
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

  const [problemStatement, setProblemStatement] = useState<string>('');
  const [defaultTestCases, setDefaultTestCases] = useState<any[]>([]);
  const [defaultListItems, setDefaultListItems] = useState<any[]>([]);
  const [initialCode, setInitialCode] = useState<string>('');
  const [codeTemplate, setCodeTemplate] = useState<string>('');

  useEffect(() => {
    if (questionData?.text !== undefined)
      setProblemStatement(questionData.text);
    if (questionData?.testCases !== undefined)
      setDefaultTestCases(questionData.testCases);
    if (questionData?.defaultListItems !== undefined)
      setDefaultListItems(questionData.defaultListItems);
    if (questionData?.initialCode !== undefined)
      setInitialCode(questionData.initialCode);
    if (questionData?.codeTemplate !== undefined)
      setCodeTemplate(questionData.codeTemplate);
  }, [questionData]);

  const [highlights, setHighlights] = useState<any[]>([]);
  const [solvedTestCases, setSolvedTestCases] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [usedParsonsIds, setUsedParsonsIds] = useState<any[]>([]);
  const [userCode, setUserCode] = useState<string>('');
  const [userTestCases, setUserTestCases] = useState<any[]>([]);

  useEffect(() => {
    if (userQuestionData?.highlights !== undefined)
      setHighlights(userQuestionData?.highlights);
    if (userQuestionData?.solvedTestCases !== undefined)
      setSolvedTestCases(userQuestionData?.solvedTestCases);
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
            solvedTestCases: [],
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

  const getProblemStatement = () =>
    `<p class='whitespace-pre-line'>${applyHighlightToText(
      problemStatement.replaceAll('\\t', '\t').replaceAll('\\n', '\n'),
      highlights
    )}</p>`;

  useEffect(() => {
    if (isError)
      addNotification!({
        type: 'failure',
        content: 'Error loading question data',
      });
  }, [isError]);

  return {
    questionId,
    defaultTestCases,
    defaultListItems,
    initialCode,
    codeTemplate,
    highlights,
    solvedTestCases,
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
