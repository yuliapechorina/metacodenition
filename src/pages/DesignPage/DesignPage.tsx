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
  const { getProblemStatement, highlightChunk } = useProblem();
  const [highlightedChunk, setHighlightedChunk] = useState<Selection | null>(
    null
  );
  const [inputValue, setInputValue] = useState<string>('');

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection) {
      return;
    }
    setHighlightedChunk(selection);
    setInputValue('');
    highlightChunk!(selection!);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  const handleSubmitAction = () => {
    console.log(inputValue!);
  };

  return (
    <Stack className='p-2'>
      <Title order={4}>Highlight a Key Phrase:</Title>
      <Text className='text-justify'>
        <TypographyStylesProvider
          onMouseUp={handleMouseUp}
          className='selection:bg-yellow-200'
        >
          {HTMLReactParser(getProblemStatement!())}
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
            {highlightedChunk?.toString()}
          </Text>
        </Text>
      )}
      <Group className='w-full'>
        <Input
          size='md'
          className='grow'
          classNames={{
            input:
              'font-mono rounded bg-gray-100 w-full focus:border-emerald-500',
          }}
          placeholder='Describe an action here...'
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button
          size='md'
          className='bg-emerald-500 fill-emerald-50 hover:bg-emerald-600'
          onClick={handleSubmitAction}
        >
          Submit
        </Button>
      </Group>
    </Stack>
  );
};

export default DesignPage;
