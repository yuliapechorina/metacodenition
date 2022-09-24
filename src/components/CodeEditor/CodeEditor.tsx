import { Group, Stack, Title } from '@mantine/core';
import Editor from '@monaco-editor/react';
import { logEvent } from 'firebase/analytics';
import { useState } from 'react';
import useAssignment from '../../context/AssignmentContext';
import useCode from '../../context/CodeContext';
import useUser from '../../hooks/useUser';
import { analytics } from '../../util/firebase';
import HelpButton from '../HelpButton';
import ProblemModal from '../ProblemModal';

const CodeEditor = () => {
  const { file, setFile } = useCode();
  const [isProblemOpened, setProblemOpened] = useState(false);
  const { questionNumber } = useAssignment();
  const { upi, userGroup } = useUser();

  const handleFileEdit = (content?: string) => {
    if (content) setFile!({ ...file!, content });
  };

  const handleClickOpenProblem = () => {
    logEvent(analytics, 'open_problem_modal', {
      question_number: questionNumber,
      user_upi: upi,
      user_testing_group: userGroup,
      my_timestamp: new Date(Date.now()).toISOString(),
    });
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
