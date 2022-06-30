import { Stack } from '@mantine/core';
import { useState } from 'react';
import { submitRun } from '../../api/CodeRunnerAPI';
import useCode from '../../context/CodeContext';
import InputArea from './InputArea';
import OutputArea from './OutputArea';

type CodeRunAreaProps = {
  className?: string;
};

const CodeRunArea = (props: CodeRunAreaProps) => {
  const { className } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const { file } = useCode();

  const run = () => {
    setLoading(true);
    const runCode = async () => {
      try {
        await submitRun({
          run_spec: {
            language_id: 'c',
            sourcefilename: 'test.c',
            sourcecode: file!.content,
          },
        });
      } catch (error: any) {
        console.log(error);
      }
    };
    runCode();
    setTimeout(setLoading, 1000, false);
  };
  return (
    <Stack className={className}>
      <InputArea loading={loading} runCallback={run} />
      <OutputArea loading={loading} />
    </Stack>
  );
};

CodeRunArea.defaultProps = { className: '' };

export default CodeRunArea;
