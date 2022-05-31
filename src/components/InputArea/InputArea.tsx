import { Button, Group, Input, Text } from '@mantine/core';
import React, { useState } from 'react';

const InputArea = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <Group>
      <Input
        variant='filled'
        className='grow'
        placeholder='Input'
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
      />
      <Button
        className='bg-emerald-500 hover:bg-emerald-800 fill-emerald-50'
        onClick={() => setLoading(!loading)}
      >
        Run
      </Button>
      {loading && <Text>...</Text>}
    </Group>
  );
};

export default InputArea;
