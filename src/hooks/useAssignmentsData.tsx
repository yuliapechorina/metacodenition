import { collection } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../util/firebase';

const useAssignmentsData = () => {
  const [user] = useAuthState(auth);

  const assignmentsCollection =
    user && db ? collection(db, 'assignments') : undefined;
  const [assignmentsData, , , assignmentsSnapShot] = useCollectionData(
    assignmentsCollection
  );

  const userAssignmentsCollection =
    user && db ? collection(db, 'users', user?.uid, 'assignments') : undefined;
  const [userAssignmentsData, , , userAssignmentsSnapShot] = useCollectionData(
    userAssignmentsCollection
  );

  const assignmentIds = assignmentsSnapShot?.docs.map((v) => v.id);

  const userAssignmentIds = userAssignmentsSnapShot?.docs.map((v) => v.id);

  return {
    assignmentsData,
    assignmentIds,
    userAssignmentsData,
    userAssignmentIds,
  };
};

export default useAssignmentsData;