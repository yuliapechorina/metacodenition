import {
  Button,
  Divider,
  Group,
  Input,
  Notification,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { arrayUnion } from 'firebase/firestore/lite';
import HTMLReactParser from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import useProblem from '../../context/ProblemContext';
import { auth } from '../../firebase';
import useUpdate from '../../hooks/useUpdate';

const DesignPage = () => {
  const { getProblemStatement, highlightChunk } = useProblem();
  const [highlightedChunk, setHighlightedChunk] = useState<Selection | null>(
    null
  );
  const [inputValue, setInputValue] = useState<string>('');
  const [user] = useAuthState(auth);
  const { isLoading, isError, updateDocument } = useUpdate();
  const [errorNotificationVisible, setErrorNotificationVisible] =
    useState(false);
  const [errorNotificationDismissed, setErrorNotifcationDismissed] =
    useState(false);

  useEffect(() => {
    if (isError) {
      setErrorNotificationVisible(true);
    }

    if (errorNotificationDismissed) {
      setErrorNotificationVisible(false);
    }
  }, [isError, errorNotificationDismissed]);

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
    if (!inputValue) {
      return;
    }

    const addActionToUser = async () => {
      if (user) {
        updateDocument('users', user.uid, {
          highlights: arrayUnion({
            highlightedText: highlightedChunk,
            action: inputValue,
          }),
        });
      }
    };
    addActionToUser();
  };

  return (
    <Stack className='p-2 overflow-y-scroll'>
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
          disabled={isLoading}
        >
          Submit
        </Button>
      </Group>
      {errorNotificationVisible && (
        <Notification
          title='Failed to submit action'
          color='red'
          className='mb-10'
          onClose={() => setErrorNotifcationDismissed(true)}
        >
          Please try again.
        </Notification>
      )}
    </Stack>
  );
};

export default DesignPage;
