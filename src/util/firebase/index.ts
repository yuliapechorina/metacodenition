import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getAnalytics,
  initializeAnalytics,
  setUserProperties,
} from 'firebase/analytics';
import { signIn, signOutAndNavigateHome } from './authentication';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
initializeAnalytics(app, {
  config: {
    send_page_view: false,
  },
});
const analytics = getAnalytics(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
const auth = getAuth(app);

const logIn = () => {
  signIn(auth, googleProvider, db);
  const upi = auth.currentUser?.email?.split('@')?.[0];
  setUserProperties(analytics, {
    upi,
  });
};

const logOut = () => {
  signOutAndNavigateHome(auth);
};

export { db, auth, logIn, logOut, analytics };
export default app;
