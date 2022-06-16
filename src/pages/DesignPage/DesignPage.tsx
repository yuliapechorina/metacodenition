import {
  Button,
  Divider,
  Group,
  Input,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import HTMLReactParser from 'html-react-parser';
import React, { useState } from 'react';
import useProblem from '../../context/ProblemContext';

const DesignPage = () => {
  const { problemStatement, highlightProblemChunk } = useProblem();
  const [highlightedChunk, setHighlightedChunk] = useState<string | undefined>(
    undefined
  );
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);

  const handleMouseUp = () => {
    console.log(`Highlighted:  ${window.getSelection()?.toString()!}`);
    setHighlightedChunk(window.getSelection()?.toString()!);
    highlightProblemChunk!(window.getSelection()?.toString()!);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
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
      {highlightedChunk === undefined ? (
        <Text>Nothing highlighted yet!</Text>
      ) : (
        <Text>
          Highlighted text:{' '}
          <Text inherit component='span' className=' font-bold'>
            {highlightedChunk}
          </Text>
        </Text>
      )}
      <Group className='w-full'>
        <Input
          size='md'
          className='grow'
          classNames={{
            input: 'font-mono rounded bg-gray-100 w-full',
          }}
          placeholder='Describe an action here...'
          onChange={handleInputChange}
          value={inputValue}
        />
        <Button
          size='md'
          className='bg-emerald-500 fill-emerald-50 hover:bg-emerald-600'
        >
          Submit
        </Button>
      </Group>
    </Stack>
  );
};

export default DesignPage;
