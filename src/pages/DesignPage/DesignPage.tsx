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

const DesignPage = () => {
  const { problemStatement, highlightProblemChunk } = useProblem();

  const handleMouseUp = () => {
    highlightProblemChunk!(window.getSelection()?.toString()!);
  };

  return (
    <Stack className='p-2'>
      <Title order={4}>Highlight a Key Phrase:</Title>
      <Text className='text-justify'>
        <TypographyStylesProvider
          onMouseUp={handleMouseUp}
          className='selection:bg-yellow-200'
        >
          {HTMLReactParser(problemStatement!)}
        </TypographyStylesProvider>
      </Text>
      <Divider />
      <Title order={4}>Describe an action:</Title>
    </Stack>
  );
};

export default DesignPage;
