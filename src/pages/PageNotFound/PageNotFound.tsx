import React from 'react';
import { Group, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import GenericButton from '../../components/generics/GenericButton';
import { ReactComponent as ErrorIcon } from '../../assets/error-icon.svg';

const PageNotFound = () => {
  const navigate = useNavigate();

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <Group className='items-center h-full justify-center'>
      <ErrorIcon className='w-[180px]' />
      <Stack className='p-4 w-fit'>
        <Text className='font-bold -mb-4 text-lg'>Page Not Found</Text>
        <Text>The page that you are trying to access may be disabled.</Text>
        <GenericButton
          text='Go back to previous page'
          onClick={navigateBack}
          className='mt-4 w-auto'
        />
      </Stack>
    </Group>
  );
};

export default PageNotFound;
