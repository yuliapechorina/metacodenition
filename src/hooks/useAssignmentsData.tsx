import { collection } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../util/firebase';

const useAssignmentsData = () => {
  const [user] = useAuthState(auth);

  const assignmentsCollection =
    user && db ? collection(db, 'assignments') : undefined;
  const [rawAssignmentsData, , , assignmentsSnapShot] = useCollectionData(
    assignmentsCollection
  );

  const userAssignmentsCollection =
    user && db ? collection(db, 'users', user?.uid, 'assignments') : undefined;
  const [userAssignmentsData, , , userAssignmentsSnapShot] = useCollectionData(
    userAssignmentsCollection
  );

  const assignmentsData = rawAssignmentsData;

  const assignmentIds = assignmentsSnapShot?.docs.reduce(
    (a, v) => [...a, v.id],
    [] as string[]
  );

  const userAssignmentIds = userAssignmentsSnapShot?.docs.map((v) => v.id);

  return {
    assignmentsData,
    assignmentIds,
    userAssignmentsData,
    userAssignmentIds,
  };
};

export default useAssignmentsData;
