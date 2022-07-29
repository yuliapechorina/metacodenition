import { collection, doc, DocumentData } from 'firebase/firestore';
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../util/firebase';

interface IAssignmentContext {
  assignmentId: string;
  setAssignmentId: (s: string) => void;
  questionId: string;
  setQuestionId: (s: string) => void;
  assignmentsData: DocumentData[] | undefined;
  userDocData: DocumentData | undefined;
}

const AssignmentContext = createContext<Partial<IAssignmentContext>>({});

type AssignmentProviderProps = {
  children: ReactNode;
};

export const AssignmentProvider = ({ children }: AssignmentProviderProps) => {
  const [assignmentId, setAssignmentId] = useState<string | undefined>();
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

  const context = useMemo(
    () => ({
      assignmentId,
      setAssignmentId,
      questionId,
      setQuestionId,
      assignmentsData,
      userDocData,
    }),
    [
      assignmentId,
      setAssignmentId,
      questionId,
      setQuestionId,
      assignmentsData,
      userDocData,
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
