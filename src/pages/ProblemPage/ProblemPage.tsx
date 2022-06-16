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
  const { problemStatement, highlightProblemChunk } = useProblem();

  const handleMouseUp = () => {
    highlightProblemChunk!(window.getSelection()?.toString()!);
  };

  return (
    <Stack className='p-2'>
      <Title order={4}>Problem:</Title>
      <Text className='text-justify'>
        <TypographyStylesProvider
          onMouseUp={handleMouseUp}
          className='selection:bg-yellow-200'
        >
          {HTMLReactParser(problemStatement!)}
        </TypographyStylesProvider>
      </Text>
      <Divider />
      <Title order={4}>Check my understanding:</Title>
    </Stack>
  );
};

export default ProblemPage;
