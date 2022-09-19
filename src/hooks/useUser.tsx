import { setUserProperties } from 'firebase/analytics';
import { doc } from 'firebase/firestore';
import Prando from 'prando';
import { useEffect, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import useNotifications from '../context/NotificationContext';
import { analytics, auth, db } from '../util/firebase';
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

  const upi = useMemo(() => user?.email?.split('@')?.[0], [user?.email]);
  const userGroup = useMemo(
    () => (new Prando(upi).nextBoolean() ? 'A' : 'B'),
    [upi]
  );

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
    if (user) {
      if (userData && !userData?.userGroup)
        updateUserDocument({ userGroup, upi });
      setUserProperties(analytics, {
        upi,
        user_group: userGroup,
      });
    }
  }, [user, userData]);

  return {
    userData,
    updateUserDocument,
    isUserUpdateLoading,
    isLoading,
    isError,
    upi,
    userGroup,
  };
};

export default useUser;
