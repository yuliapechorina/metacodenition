import { collection, doc, DocumentData, setDoc } from 'firebase/firestore';
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../util/firebase';
import useUpdate from '../hooks/useUpdate';

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
  assignmentComplete: boolean;
  assignmentSubmitted: boolean;
  updateUserAssignmentDoc: (data: { [x: string]: any }) => void;
  getAllCode: () => string[] | undefined;
}

const AssignmentContext = createContext<Partial<IAssignmentContext>>({});

type AssignmentProviderProps = {
  children: ReactNode;
};

export const AssignmentProvider = ({ children }: AssignmentProviderProps) => {
  const [assignmentName, setAssignmentName] = useState<string | undefined>();
  const [questionId, setQuestionId] = useState<string | undefined>();
  const [assignmentComplete, setAssignmentComplete] = useState(false);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  const [user] = useAuthState(auth);
  const userDoc = user ? doc(db, 'users', user?.uid) : undefined;
  const [userDocData] = useDocumentData(userDoc);
  const assignmentsCollection = user
    ? collection(db, 'assignments')
    : undefined;
  const [assignmentsData, , , assignmentsSnapShot] = useCollectionData(
    assignmentsCollection
  );

  const currentAssignment = assignmentsData?.find(
    (a) => a.name === assignmentName
  );
  const currentQuestionIndex =
    questionId !== undefined
      ? currentAssignment?.questions?.findIndex(
          (uid: string) => uid === questionId
        )
      : 0;
  const questionNumber = currentQuestionIndex + 1;
  const questionsLength = currentAssignment?.questions?.length;
  const finalQuestion = questionNumber === questionsLength;

  const assignmentIds = assignmentsSnapShot?.docs.map((v) => v.id);
  const assignmentIndex = assignmentsData?.findIndex(
    (a) => a.name === assignmentName
  );
  const assignmentId =
    assignmentIds && assignmentIndex !== undefined
      ? assignmentIds[assignmentIndex]
      : 0;
  const userAssignmentDoc =
    user && assignmentId && currentAssignment
      ? doc(db, 'users', user?.uid, 'assignments', assignmentId)
      : undefined;
  const [userAssignmentDocData] = useDocumentData(userAssignmentDoc);
  const { updateDocumentRef } = useUpdate();
  const updateUserAssignmentDoc = (data: { [x: string]: any }) => {
    if (userAssignmentDoc) {
      updateDocumentRef(userAssignmentDoc, data);
    }
  };

  const setNextQuestion = () => {
    if (!finalQuestion) {
      setQuestionId(currentAssignment?.questions?.[questionNumber]);
    } else {
      if (userAssignmentDoc) {
        updateUserAssignmentDoc({ complete: true });
      }
      setQuestionId(undefined);
    }
  };

  const getAllCode = (): string[] | undefined => {
    if (currentAssignment?.questions !== undefined) {
      return currentAssignment.questions
        .map((qid: string) => {
          const questionDoc =
            user && qid
              ? doc(db, 'users', user?.uid, 'questions', qid)
              : undefined;
          const [questionDocData] = useDocumentData(questionDoc);
          return questionDocData?.userCode.content;
        })
        .filter((c: string) => c !== undefined);
    }
    return undefined;
  };

  useEffect(() => {
    if (userAssignmentDocData !== undefined) {
      if (userAssignmentDocData.complete !== undefined) {
        setAssignmentComplete(userAssignmentDocData.complete);
      }
      if (userAssignmentDocData.submitted !== undefined) {
        setAssignmentSubmitted(userAssignmentDocData.submitted);
      }
    }
  }, [userAssignmentDocData]);

  useEffect(() => {
    if (userAssignmentDoc) {
      setDoc(userAssignmentDoc, {}, { merge: true });
    }
  }, [userAssignmentDoc]);

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
      assignmentComplete,
      assignmentSubmitted,
      updateUserAssignmentDoc,
      getAllCode,
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
      assignmentComplete,
      assignmentSubmitted,
      updateUserAssignmentDoc,
      getAllCode,
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
