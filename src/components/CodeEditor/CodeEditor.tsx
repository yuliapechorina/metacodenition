import {
  Button,
  Code,
  Group,
  Notification,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import Editor from '@monaco-editor/react';
import { ReactNode, useState } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';
import useCode, { Comment } from '../../context/CodeContext';
import useParsons from '../../hooks/useParsons';
import getOutput from '../../util/comment-generator';

type NotificationType = 'success' | 'failure';

interface INotification {
  type: NotificationType;
  content: ReactNode;
}

const CodeEditor = () => {
  const { file, defaultFile, setFile } = useCode();
  const { getUsedParsonsFragments } = useParsons();
  const [notification, setNotification] = useState<INotification | undefined>();

  const handleFileEdit = (content?: string) => {
    if (content) setFile!({ ...file!, content });
  };

  const getNotificationIcon = () => {
    switch (notification?.type) {
      case 'success':
        return <HiCheck size={18} />;
      case 'failure':
        return <HiX size={18} />;
      default:
        return null;
    }
  };

  const getNotificationTitle = () =>
    (notification!.type.at(0)?.toUpperCase() || '') +
    notification!.type.slice(1);

  const getNotificationColour = () => {
    switch (notification?.type) {
      case 'success':
        return 'green';
      case 'failure':
        return 'red';
      default:
        return 'orange';
    }
  };

  const getComments = () =>
    getUsedParsonsFragments!().map<Comment>((fragment) => ({
      id: fragment.listItem.id,
      text: `\t// ${fragment.listItem.action}`,
    }));

  const generateComments = () => {
    const firstLineBreakIndex = defaultFile?.content.search('\n');
    const firstLine = defaultFile?.content.slice(0, firstLineBreakIndex);
    if (file?.content.includes(firstLine!)) {
      const generatorOutput = getOutput(getComments, file);
      setFile!({
        ...file,
        content: generatorOutput.newContent,
        comments: generatorOutput.newComments,
      });
      setNotification({
        type: 'success',
        content: (
          <Text>
            Successfully generated {generatorOutput.commentsGenerated} comments,
            <br />
            of which {generatorOutput.commentsUpdated} were re-generated and
            updated.
          </Text>
        ),
      });
    } else
      setNotification({
        type: 'failure',
        content: (
          <Text>
            Could not find the line
            <br />
            <Code className='text-md font-bold'>{firstLine}</Code>
            <br /> Please ensure that this exists in your current solution, as
            we can&apos;t generate comments without it!
          </Text>
        ),
      });
  };

  return (
    <Stack className='overflow-hidden'>
      <Group className='justify-between'>
        <Title order={2}>Your Solution:</Title>
        <Button
          size='md'
          className='bg-emerald-500 fill-emerald-50 hover:bg-emerald-600'
          onClick={() => generateComments()}
        >
          Auto-Generate Comments
        </Button>
      </Group>
      <Editor
        theme='vs'
        language='c'
        value={file?.content}
        className='shrink'
        onChange={handleFileEdit}
      />
      {notification && (
        <Notification
          icon={getNotificationIcon()}
          title={getNotificationTitle()}
          color={getNotificationColour()}
          className='fixed right-0 top-0 m-4 max-w-md'
          classNames={{ title: 'text-lg' }}
          onClose={() => setNotification(undefined)}
        >
          {notification.content}
        </Notification>
      )}
    </Stack>
  );
};

CodeEditor.defaultProps = { className: '' };

export default CodeEditor;
