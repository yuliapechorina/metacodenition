import { doc, DocumentData, setDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
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
import useAssignmentsData from '../hooks/useAssignmentsData';

interface IAssignmentContext {
  assignmentName: string;
  setAssignmentName: (s?: string) => void;
  questionId: string;
  setQuestionId: (s: string) => void;
  assignmentsData?: DocumentData[];
  questionNumber: number;
  questionsLength: number;
  setNextQuestion: () => void;
  assignmentComplete: boolean;
  assignmentSubmitted: boolean;
  userAssignmentDocData?: DocumentData;
  updateUserAssignmentDoc: (data: { [x: string]: any }) => void;
  getAllCode: () => string[] | undefined;
  userAssignmentCompletion?: boolean[];
  isLoading: boolean;
  isError: boolean;
}

const AssignmentContext = createContext<Partial<IAssignmentContext>>({});

type AssignmentProviderProps = {
  children: ReactNode;
};

export const AssignmentProvider = ({ children }: AssignmentProviderProps) => {
  const [assignmentName, setAssignmentName] = useState<string | undefined>();
  const [questionIndex, setQuestionIndex] = useState<number | undefined>();
  const [questionId, setQuestionId] = useState<string | undefined>();
  const [assignmentComplete, setAssignmentComplete] = useState(false);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  const [user] = useAuthState(auth);

  const {
    assignmentsData,
    assignmentIds,
    userAssignmentsData,
    userAssignmentIds,
  } = useAssignmentsData();

  const assignmentIndex = assignmentsData?.findIndex(
    (a) => a.name === assignmentName
  );
  const assignmentId =
    assignmentIds && assignmentIndex !== undefined
      ? assignmentIds[assignmentIndex]
      : 0;
  const currentAssignment =
    assignmentIndex !== undefined
      ? assignmentsData?.[assignmentIndex]
      : undefined;

  const userAssignmentCompletion: boolean[] | undefined =
    assignmentsData?.map<boolean>((a, i) => {
      const aid = assignmentIds?.[i];
      const indexInUserAssignmentsCollection = userAssignmentIds?.findIndex(
        (v) => v === aid
      );
      if (indexInUserAssignmentsCollection !== undefined) {
        const submitted: boolean =
          userAssignmentsData?.[indexInUserAssignmentsCollection]?.submitted ||
          userAssignmentsData?.[indexInUserAssignmentsCollection]?.complete;
        return submitted !== undefined ? submitted : false;
      }
      return false;
    });

  const userAssignmentDoc =
    user && assignmentId && currentAssignment
      ? doc(db, 'users', user?.uid, 'assignments', assignmentId)
      : undefined;
  const [userAssignmentDocData] = useDocumentData(userAssignmentDoc);

  const questionNumber = questionIndex !== undefined ? questionIndex + 1 : 0;
  const questionsLength = currentAssignment?.questions?.length;
  const finalQuestion = questionNumber === questionsLength;

  const { updateDocumentRef, isLoading, isError } = useUpdate();
  const updateUserAssignmentDoc = (data: { [x: string]: any }) => {
    if (userAssignmentDoc) {
      updateDocumentRef(userAssignmentDoc, data);
    }
  };

  const setNextQuestion = () => {
    if (!finalQuestion) {
      updateUserAssignmentDoc({
        questionIndex: questionIndex !== undefined ? questionIndex + 1 : 0,
      });
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
      if (userAssignmentDocData.questionIndex !== undefined) {
        setQuestionIndex(userAssignmentDocData.questionIndex);
        setQuestionId(
          currentAssignment?.questions?.[userAssignmentDocData.questionIndex]
        );
      } else {
        setQuestionIndex(0);
        setQuestionId(currentAssignment?.questions?.[0]);
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
      questionNumber,
      questionsLength,
      setNextQuestion,
      assignmentComplete,
      assignmentSubmitted,
      userAssignmentDocData,
      updateUserAssignmentDoc,
      getAllCode,
      userAssignmentCompletion,
      isLoading,
      isError,
    }),
    [
      assignmentName,
      setAssignmentName,
      questionId,
      setQuestionId,
      assignmentsData,
      questionNumber,
      questionsLength,
      setNextQuestion,
      assignmentComplete,
      assignmentSubmitted,
      userAssignmentDocData,
      updateUserAssignmentDoc,
      getAllCode,
      userAssignmentCompletion,
      isLoading,
      isError,
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
