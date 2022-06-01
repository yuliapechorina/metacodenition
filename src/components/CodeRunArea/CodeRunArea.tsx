import { Stack } from '@mantine/core';
import { useState } from 'react';
import InputArea from './InputArea';
import OutputArea from './OutputArea';

type CodeRunAreaProps = {
  className?: string;
};

const CodeRunArea = (props: CodeRunAreaProps) => {
  const { className } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const run = () => {
    setLoading(true);
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
