import { Code, Group, Stack, Text, Title } from '@mantine/core';
import Editor from '@monaco-editor/react';
import { logEvent } from 'firebase/analytics';
import { useEffect, useState } from 'react';
import useCode, { Comment } from '../../context/CodeContext';
import useNotifications from '../../context/NotificationContext';
import useInterventions from '../../hooks/useInterventions';
import useParsons from '../../hooks/useParsons';
import getOutput from '../../util/comment-generator';
import { analytics } from '../../util/firebase';
import GenericButton from '../generics/GenericButton';
import ProblemPopover from '../ProblemPopover';

const CodeEditor = () => {
  const { file, defaultCode, setFile } = useCode();
  const { getUsedParsonsFragments } = useParsons();
  const { addNotification } = useNotifications();
  const [isProblemOpened, setProblemOpened] = useState(false);
  const { interventions } = useInterventions();
  const [generateCommentsButtonVisible, setGenerateCommentsButtonVisible] =
    useState(true);

  useEffect(() => {
    const evaluatingASolutionEnabled = interventions.find(
      ({ name }) => name === 'Evaluating a solution'
    )?.enabled;
    setGenerateCommentsButtonVisible(evaluatingASolutionEnabled ?? false);
  }, [interventions]);

  const handleFileEdit = (content?: string) => {
    if (content) setFile!({ ...file!, content });
  };

  const getComments = () =>
    getUsedParsonsFragments!().map<Comment>((fragment) => ({
      id: fragment.listItem.id,
      text: `\t// ${fragment.listItem.action}`,
    }));

  const generateComments = () => {
    const firstLineBreakIndex = defaultCode?.search('\n');
    const firstLine = defaultCode?.slice(0, firstLineBreakIndex);
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

    logEvent(analytics, 'auto_generate_comments');
  };

  return (
    <Stack className='overflow-hidden'>
      <Group className='justify-between p-4'>
        <Title order={4}>Your Solution:</Title>
        <Group>
          {generateCommentsButtonVisible && (
            <GenericButton
              text='Auto-generate comments'
              size='xs'
              onClick={() => generateComments()}
            />
          )}
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
