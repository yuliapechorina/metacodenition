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
import { HiX } from 'react-icons/hi';
import useCode from '../../context/CodeContext';
import useParsons from '../../context/ParsonsContext';

const CodeEditor = () => {
  const { file, defaultFile, setFile } = useCode();
  const { getUsedParsonsFragments } = useParsons();
  const [notificationReason, setNotificationReason] = useState<
    ReactNode | undefined
  >();

  const handleFileEdit = (content?: string) => {
    if (content) setFile!({ ...file, content });
  };

  const generateComments = () => {
    const firstLineBreakIndex = defaultFile?.content.search('\n');
    const firstLine = defaultFile?.content.slice(0, firstLineBreakIndex);
    if (file?.content.includes(firstLine!)) {
      const comments = getUsedParsonsFragments!().map(
        (fragment) => `\t// ${fragment.listItem.action}`
      );
      const commentBlock = comments?.reduce((s, c) => `${s + c}\n\n`, '') || '';
      const newContent = file.content.split('\n');
      newContent.splice(1, 0, commentBlock);
      setFile!({ ...file, content: newContent.join('\n') });
    } else
      setNotificationReason(
        <Text>
          Could not find the line
          <br />
          <Code className='text-md font-bold'>{firstLine}</Code>
          <br /> Please ensure that this exists in your current solution, as we
          can&apos;t generate comments without it!
        </Text>
      );
  };

  return (
    <Stack className='overflow-hidden'>
      <Group className='p-4'>
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
      {notificationReason && (
        <Notification
          icon={<HiX size={18} />}
          title='Could not Auto-Generate Comments!'
          color='red'
          className='fixed right-0 top-0 m-4 max-w-md'
          classNames={{ title: 'text-lg' }}
          onClose={() => setNotificationReason(undefined)}
        >
          {notificationReason}
        </Notification>
      )}
    </Stack>
  );
};

CodeEditor.defaultProps = { className: '' };

export default CodeEditor;
