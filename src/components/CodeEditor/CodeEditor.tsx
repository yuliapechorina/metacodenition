import { Button, Code, Group, Stack, Text, Title } from '@mantine/core';
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import useCode, { Comment } from '../../context/CodeContext';
import useNotifications from '../../context/NotificationContext';
import useParsons from '../../hooks/useParsons';
import getOutput from '../../util/comment-generator';
import ProblemPopover from '../ProblemPopover';

const CodeEditor = () => {
  const { file, defaultFile, setFile } = useCode();
  const { getUsedParsonsFragments } = useParsons();
  const { addNotification } = useNotifications();
  const [isProblemOpened, setProblemOpened] = useState(false);

  const handleFileEdit = (content?: string) => {
    if (content) setFile!({ ...file!, content });
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
      addNotification!({
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
      addNotification!({
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
      <Group className='justify-between p-4'>
        <Title order={4}>Your Solution:</Title>
        <Group>
          <Button
            size='xs'
            className='bg-emerald-500 fill-emerald-50 hover:bg-emerald-600'
            onClick={() => generateComments()}
          >
            Auto-Generate Comments
          </Button>
          <ProblemPopover
            opened={isProblemOpened}
            setOpened={setProblemOpened}
          />
        </Group>
      </Group>
      <Editor
        theme='vs'
        language='c'
        value={file?.content}
        className='shrink'
        onChange={handleFileEdit}
      />
    </Stack>
  );
};

CodeEditor.defaultProps = { className: '' };

export default CodeEditor;
