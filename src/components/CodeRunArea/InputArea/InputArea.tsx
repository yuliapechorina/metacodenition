import { Group, Stack, Text, UnstyledButton } from '@mantine/core';
import React, { useState } from 'react';
import { HiDotsHorizontal, HiPlay } from 'react-icons/hi';
import CodeInput from '../../CodeInput';

type InputAreaProps = {
  loading: boolean;
  runCallback: () => void;
};

const InputArea = (props: InputAreaProps) => {
  const { loading, runCallback } = props;
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  return (
    <Stack>
      <Text className='grow text-lg'>Input</Text>
      <Group>
        <CodeInput
          className='grow rounded'
          placeholder='Input'
          value={input}
          onChange={handleInputChange}
        />
        <UnstyledButton className='hover:scale-150' onClick={runCallback}>
          {loading ? (
            <HiDotsHorizontal
              size='36px'
              className=' bg-emerald-500 fill-emerald-50 rounded-full p-1'
            />
          ) : (
            <HiPlay
              size='36px'
              className=' bg-emerald-500 fill-emerald-50 rounded-full p-1'
            />
          )}
        </UnstyledButton>
      </Group>
    </Stack>
  );
};

export default InputArea;
