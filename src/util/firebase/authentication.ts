/* eslint-disable no-console */
/* eslint-disable no-alert */
// TODO: Implement a better way of presenting messages to the user, to prevent the use of
// console.log, alert, etc.
import { Auth, AuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, Firestore, setDoc } from 'firebase/firestore/lite';

const signIn = async (
  authenticator: Auth,
  provider: AuthProvider,
  database: Firestore
) => {
  try {
    const signInResult = await signInWithPopup(authenticator, provider);
    const { user } = signInResult;
    const id: string = user.uid;

    if (user.email?.endsWith('aucklanduni.ac.nz' || 'auckland.ac.nz')) {
      await setDoc(
        doc(database, 'users/', id),
        {
          uid: user.uid,
          name: user.displayName,
          authProvider: 'google',
          email: user.email,
        },
        { merge: true }
      );
    } else {
      await signOut(authenticator);
      document.location.href = '/invalid-email';
    }
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
};

export default signIn;
