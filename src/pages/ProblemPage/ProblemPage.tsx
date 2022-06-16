import {
  Divider,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import HTMLReactParser from 'html-react-parser';
import React, { useState } from 'react';
import useProblem from '../../context/ProblemContext';

const ProblemPage = () => {
  const { problemStatement } = useProblem();
  const [problem, setProblem] = useState(problemStatement);

  const highlightChunk = (chunk: string) => {
    const highlightedProblem = problem!.replace(
      chunk,
      `<mark className='bg-yellow-200'>${chunk}</mark>`
    );
    setProblem(highlightedProblem);
  };

  const handleMouseUp = () => {
    highlightChunk(window.getSelection()?.toString()!);
  };

  return (
    <Stack className='p-2'>
      <Title order={4}>Problem:</Title>
      <Text className='text-justify'>
        <TypographyStylesProvider
          onMouseUp={handleMouseUp}
          className='selection:bg-yellow-200'
        >
          {HTMLReactParser(problem!)}
        </TypographyStylesProvider>
      </Text>
      <Divider />
      <Title order={4}>Check my understanding:</Title>
    </Stack>
  );
};

export default ProblemPage;
