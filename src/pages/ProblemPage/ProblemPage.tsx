import {
  Divider,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import HTMLReactParser from 'html-react-parser';
import React from 'react';
import useProblem from '../../context/ProblemContext';

const ProblemPage = () => {
  const { getProblemStatement } = useProblem();

  return (
    <Stack className='p-2'>
      <Title order={4}>Problem:</Title>
      <Text className='text-justify'>
        <TypographyStylesProvider>
          {HTMLReactParser(getProblemStatement!())}
        </TypographyStylesProvider>
      </Text>
      <Divider />
      <Title order={4}>Check my understanding:</Title>
    </Stack>
  );
};

export default ProblemPage;
