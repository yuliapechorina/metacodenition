import React from 'react';
import { Group, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import GenericButton from '../../components/generics/GenericButton';
import { ReactComponent as ErrorIcon } from './error-icon.svg';

const InvalidEmailPage = () => {
  const navigate = useNavigate();

  const navigateToHomePage = () => {
    navigate('/');
  };

  return (
    <Group className='items-center h-full justify-center'>
      <ErrorIcon className='w-[180px]' />
      <Stack className='p-4 w-fit'>
        <Text className='font-bold -mb-4 text-lg'>Invalid Email</Text>
        <Text>Please log in again with a University of Auckland email.</Text>
        <GenericButton
          text='Return to home page'
          onClick={navigateToHomePage}
          className='mt-4 w-auto'
        />
      </Stack>
    </Group>
  );
};

export default InvalidEmailPage;
