import { Stack } from '@mantine/core';
import { useState } from 'react';
import ExpandToggle from './ExpandToggle';
import InputArea from './InputArea';
import OutputArea from './OutputArea';

const CodeRunArea = (props: { className?: string }) => {
  const { className } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Stack
      className={`${className} ${
        !isExpanded && 'h-0 -translate-y-8'
      } transition-all ease-in duration-300`}
    >
      <ExpandToggle isExpanded={isExpanded} callback={toggleExpand} />
      <InputArea />
      <OutputArea />
    </Stack>
  );
};

CodeRunArea.defaultProps = { className: '' };

export default CodeRunArea;
