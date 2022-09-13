import { doc } from 'firebase/firestore';
import Prando from 'prando';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import useNotifications from '../context/NotificationContext';
import { auth, db } from '../util/firebase';
import useUpdate from './useUpdate';

const useUser = () => {
  const [user] = useAuthState(auth);
  const userDoc = user ? doc(db, 'users', user!.uid) : undefined;

  const {
    isLoading: isUserUpdateLoading,
    isError: isUserUpdateError,
    updateDocumentRef,
  } = useUpdate();

  const { addNotification } = useNotifications();

  const [userData, isLoading, isError] = useDocumentData(userDoc);

  const updateUserDocument = async (data: { [x: string]: any }) =>
    userDoc && updateDocumentRef(userDoc, data);

  useEffect(() => {
    if (isUserUpdateError) {
      addNotification!({
        type: 'failure',
        content: 'Error updating user data',
      });
    }
  }, [isUserUpdateError]);

  useEffect(() => {
    if (isError) {
      addNotification!({
        type: 'failure',
        content: 'Error fetching user data',
      });
    }
  }, [isError]);

  useEffect(() => {
    if (user && userData?.userGroup === undefined) {
      const upi = user.email?.split('@')?.[0];
      const userGroup = new Prando(upi).nextBoolean() ? 'A' : 'B';
      updateUserDocument({ userGroup });
    }
  });

  return {
    userData,
    updateUserDocument,
    isUserUpdateLoading,
    isLoading,
    isError,
  };
};

export default useUser;
