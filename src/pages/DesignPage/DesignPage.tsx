import {
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import HTMLReactParser from 'html-react-parser';
import React, { useState } from 'react';
import GenericInput from '../../components/generics/GenericInput';
import { findHighlightInParent, Highlight } from '../../util/highlighter';
import useQuestion from '../../hooks/useQuestion';
import GenericButton from '../../components/generics/GenericButton';

const DesignPage = () => {
  const {
    isLoading,
    highlights,
    getProblemStatement,
    updateUserQuestionDocument,
  } = useQuestion();

  const [highlightedChunk, setHighlightedChunk] = useState<
    Highlight | undefined
  >();

  const [inputValue, setInputValue] = useState<string>('');

  const highlightChunk = (chunk: Selection): Highlight | undefined => {
    const indexPair = findHighlightInParent(chunk);

    if (highlights) {
      const selectedHighlight = highlights?.find(
        (highlight: Highlight) =>
          highlight.indexPair.start <= indexPair.start &&
          highlight.indexPair.end >= indexPair.end,
        indexPair
      );

      if (selectedHighlight || !chunk.toString) {
        return selectedHighlight;
      }
    }

    const newHighlight: Highlight = {
      id: Math.floor(Math.random() * 100),
      indexPair,
      highlightedText: chunk.toString(),
      action: '',
    };

    if (newHighlight.highlightedText === '') return undefined;

    const newHighlights = highlights
      ? [...highlights, newHighlight]
      : [newHighlight];
    updateUserQuestionDocument({ highlights: newHighlights });

    return newHighlight;
  };

  const removeHighlightedChunk = (highlight: Highlight) => {
    if (!highlights) {
      return;
    }

    const newHighlights = highlights.filter(
      (thisHighlight: Highlight) => thisHighlight !== highlight
    );
    updateUserQuestionDocument({ highlights: newHighlights });
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const newHighlightedChunk = highlightChunk!(selection!);
    setHighlightedChunk(newHighlightedChunk);
    setInputValue(newHighlightedChunk?.action || '');
  };

  const handleInputChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e!.currentTarget.value);
  };

  const handleSubmitAction = () => {
    if (!inputValue) {
      return;
    }

    if (highlights && highlightedChunk) {
      const newHighlightedChunk = {
        ...highlightedChunk,
        action: inputValue,
      };
      setHighlightedChunk(newHighlightedChunk);
      const newHighlights = highlights.map((highlight) =>
        highlight.id === newHighlightedChunk.id
          ? newHighlightedChunk
          : highlight
      );
      updateUserQuestionDocument({
        highlights: newHighlights,
      });
    }
  };

  const handleDeleteAction = () => {
    if (highlightedChunk !== undefined) {
      removeHighlightedChunk!(highlightedChunk);
      setHighlightedChunk(undefined);
      setInputValue('');
      updateUserQuestionDocument({
        highlights: highlights.filter((hl) => hl.id !== highlightedChunk.id),
      });
    }
  };

  return (
    <ScrollArea className='h-full'>
      <Stack className='p-4 h-full'>
        <Text>
          <Text inherit component='span' className='font-bold'>
            Task:{' '}
          </Text>
          Identify and highlight key phrases of the problem statement and assign
          an action to achieve it.
          <br />
          <Text inherit component='span' className='italic'>
            Hint: Highlight the parts of the problem statement that require code
            to achieve, for example &quot;multiply the result by 3&quot;.
          </Text>
        </Text>
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
            Highlighted text:{` `}
            <Text inherit component='span' className=' font-bold'>
              {highlightedChunk.highlightedText}
            </Text>
          </Text>
        )}
        <Group className='w-full h-fit'>
          <GenericInput
            placeholder='Describe an action here...'
            value={inputValue}
            onChange={handleInputChange}
          />
          <GenericButton
            text='Submit'
            onClick={handleSubmitAction}
            disabled={isLoading}
          />
          <GenericButton
            text='Delete'
            red
            onClick={handleDeleteAction}
            disabled={isLoading}
          />
        </Group>
      </Stack>
    </ScrollArea>
  );
};

export default DesignPage;
