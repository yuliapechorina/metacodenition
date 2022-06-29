import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../../util/firebase';

const AuthRoute = () => {
  const [user] = useAuthState(auth);

  if (user) {
    return <Outlet />;
  }

  return <Navigate to='/login' />;
};

export default AuthRoute;
