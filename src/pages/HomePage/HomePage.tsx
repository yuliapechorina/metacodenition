import React, { useEffect } from 'react';
import {
  Group,
  Stack,
  Text,
  Button,
  Container,
  LoadingOverlay,
} from '@mantine/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, logIn } from '../../util/firebase';
import { ReactComponent as ProgrammingEducationImage } from './programming-education.svg';
import { ReactComponent as GoogleGLogo } from './google-g-logo.svg';

const HomePage = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/assignment');
    }
  }, [user, navigate]);

  return (
    <Group className='grid grid-cols-2 items-center h-full'>
      <Container className='object-contain w-full justify-end my-auto p-4'>
        <ProgrammingEducationImage className='ml-auto w-3/4 max-w-[500px]' />
      </Container>
      <Stack className='my-auto w-fit p-4'>
        <Text className='font-bold -mb-4 text-lg'>
          Welcome to Metacodenition!
        </Text>
        <Text className=''>
          Please use your university email to log in with Google
        </Text>
        <LoadingOverlay visible={loading} />
        <Button
          uppercase
          size='md'
          onClick={() => logIn()}
          className='bg-emerald-500 hover:bg-emerald-600 rounded-xl mt-4 w-auto'
          leftIcon={<GoogleGLogo />}
        >
          Login with Google
        </Button>
        {error && <Text className='text-red-600'>Error: {error!.message}</Text>}
      </Stack>
    </Group>
  );
};

export default HomePage;
