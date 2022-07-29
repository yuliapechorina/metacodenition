import { collection, doc, DocumentData } from 'firebase/firestore';
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../util/firebase';

interface IAssignmentContext {
  assignmentName: string;
  setAssignmentName: (s: string | undefined) => void;
  questionId: string;
  setQuestionId: (s: string) => void;
  assignmentsData: DocumentData[] | undefined;
  userDocData: DocumentData | undefined;
  questionNumber: number;
  questionsLength: number;
  setNextQuestion: () => void;
}

const AssignmentContext = createContext<Partial<IAssignmentContext>>({});

type AssignmentProviderProps = {
  children: ReactNode;
};

export const AssignmentProvider = ({ children }: AssignmentProviderProps) => {
  const [assignmentName, setAssignmentName] = useState<string | undefined>();
  const [questionId, setQuestionId] = useState<string | undefined>(
    'wIK4Zf2d0ZKLpnnzsfxp'
  );

  const [user] = useAuthState(auth);
  const userDoc = user ? doc(db, 'users', user?.uid) : undefined;
  const [userDocData] = useDocumentData(userDoc);
  const assignmentsCollection = user
    ? collection(db, 'assignments')
    : undefined;
  const [assignmentsData] = useCollectionData(assignmentsCollection);

  const currentAssignment = assignmentsData?.find(
    (a) => a.name === assignmentName
  );
  const currentQuestionIndex = currentAssignment?.questions?.findIndex(
    (uid: string) => uid === questionId
  );
  const questionNumber = currentQuestionIndex + 1;
  const questionsLength = currentAssignment?.questions?.length;
  const finalQuestion = questionNumber === questionsLength;

  const setNextQuestion = () => {
    if (!finalQuestion) {
      setQuestionId(currentAssignment?.questions?.[questionNumber]);
    }
  };

  const context = useMemo(
    () => ({
      assignmentName,
      setAssignmentName,
      questionId,
      setQuestionId,
      assignmentsData,
      userDocData,
      questionNumber,
      questionsLength,
      setNextQuestion,
    }),
    [
      assignmentName,
      setAssignmentName,
      questionId,
      setQuestionId,
      assignmentsData,
      userDocData,
      questionNumber,
      questionsLength,
      setNextQuestion,
    ]
  );

  return (
    <AssignmentContext.Provider value={context}>
      {children}
    </AssignmentContext.Provider>
  );
};

const useAssignment = () => useContext(AssignmentContext);

export default useAssignment;
