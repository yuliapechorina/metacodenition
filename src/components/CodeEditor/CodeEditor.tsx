import { Group, Stack, Title } from '@mantine/core';
import Editor from '@monaco-editor/react';
import { logEvent } from 'firebase/analytics';
import { useState } from 'react';
import useCode from '../../context/CodeContext';
import { analytics } from '../../util/firebase';
import HelpButton from '../HelpButton';
import ProblemModal from '../ProblemModal';

const CodeEditor = () => {
  const { file, setFile } = useCode();
  const [isProblemOpened, setProblemOpened] = useState(false);

  const handleFileEdit = (content?: string) => {
    if (content) setFile!({ ...file!, content });
  };

  const handleClickOpenProblem = () => {
    logEvent(analytics, 'open_problem_modal');
    setProblemOpened(!isProblemOpened);
  };

  return (
    <>
      <Stack className='overflow-hidden'>
        <Group className='justify-between p-4'>
          <Title order={4}>Your Solution:</Title>
          <HelpButton onClick={handleClickOpenProblem} />
        </Group>
        <Editor
          theme='vs'
          language='c'
          value={file?.content}
          className='shrink'
          onChange={handleFileEdit}
        />
      </Stack>
      <ProblemModal opened={isProblemOpened} setOpened={setProblemOpened} />
    </>
  );
};

CodeEditor.defaultProps = { className: '' };

export default CodeEditor;
