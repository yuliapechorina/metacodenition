import { Button, Center, Stack, Text, Title } from '@mantine/core';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, logIn } from '../../util/firebase';

const Login = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate('/assignment');
    }
  }, [user, navigate]);

  return (
    <Center className='w-screen h-screen'>
      <Stack>
        <Title>Login with Google!</Title>
        {loading ? (
          <Text>Loading</Text>
        ) : (
          <Button
            uppercase
            size='md'
            onClick={() => logIn()}
            className='bg-emerald-500 hover:bg-emerald-600 rounded-lg'
          >
            Login
          </Button>
        )}
        {error && <Text>Error: {error.message}</Text>}
      </Stack>
    </Center>
  );
};

export default Login;
