import { Button, Group, Input, Stack, Text } from '@mantine/core';
import React, { useState } from 'react';

const InputArea = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <Stack>
      <Text className='grow text-lg'>Input</Text>
      <Group>
        <Input
          variant='filled'
          className='grow'
          placeholder='Input'
          size='lg'
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
        <Button
          className='hover:bg-transparent text-3xl hover:scale-150'
          onClick={() => setLoading(!loading)}
        >
          {loading ? '⏸️' : '▶️'}
        </Button>
      </Group>
    </Stack>
  );
};

export default InputArea;
