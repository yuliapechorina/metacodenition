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
import React, { useEffect, useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import GenericInput from '../../components/generics/GenericInput';
import { findHighlightInParent, Highlight } from '../../util/highlighter';
import useQuestion from '../../hooks/useQuestion';
import GenericButton from '../../components/generics/GenericButton';
import useAssignment from '../../context/AssignmentContext';

const DesignPage = () => {
  const { unsavedChanges, setUnsavedChanges } = useAssignment();

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

  const [saved, setSaved] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const highlight: Highlight | undefined = highlights.find(
      (h) => h.id === highlightedChunk?.id
    );
    if (highlight === undefined) {
      setUnsavedChanges!(true);
    } else if (highlight.action === inputValue) {
      setUnsavedChanges!(false);
    } else {
      setUnsavedChanges!(true);
    }
  }, [highlightedChunk, inputValue, highlights]);

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
      ? [...highlights.filter((hl) => hl.action), newHighlight]
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

  const handleSaveAction = () => {
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
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
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
      setDeleted(true);
      window.setTimeout(() => setDeleted(false), 3000);
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
            text='Save'
            disabled={!inputValue || !unsavedChanges}
            onClick={handleSaveAction}
            loading={saved && isLoading}
            leftIcon={saved && !isLoading && <HiCheck size={20} />}
          />
          <GenericButton
            text='Delete'
            red
            disabled={highlightedChunk === undefined}
            onClick={handleDeleteAction}
            loading={deleted && isLoading}
            leftIcon={deleted && !isLoading && <HiCheck size={20} />}
          />
        </Group>
      </Stack>
    </ScrollArea>
  );
};

export default DesignPage;
