import { Stack } from '@mantine/core';
import InputArea from './InputArea';
import OutputArea from './OutputArea';

const CodeRunArea = (props: { className?: string }) => {
  const { className } = props;

  return (
    <Stack className={className}>
      <InputArea />
      <OutputArea />
    </Stack>
  );
};

CodeRunArea.defaultProps = { className: '' };

export default CodeRunArea;
