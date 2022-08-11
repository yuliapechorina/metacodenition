import { Code, Container, Tooltip, ActionIcon } from '@mantine/core';
import { useState } from 'react';
import { HiCheck, HiClipboardCopy } from 'react-icons/hi';

const CodeCopyBox = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    setCopied(true);
    navigator.clipboard.writeText(code);
    window.setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Code block className='text-base relative'>
      <Container className='absolute right-0 top-0' px={8} py={8}>
        <Tooltip
          withArrow
          position='right'
          label={copied ? 'Copied!' : 'Copy code to clipboard'}
        >
          <ActionIcon onClick={() => handleCopyClick()}>
            {copied ? <HiCheck size={32} /> : <HiClipboardCopy size={32} />}
          </ActionIcon>
        </Tooltip>
      </Container>
      {code}
    </Code>
  );
};

export default CodeCopyBox;
