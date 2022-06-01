import { Button, Group, Input, Stack, Text } from '@mantine/core';
import React, { useState } from 'react';
import { HiOutlineDotsCircleHorizontal, HiOutlinePlay } from 'react-icons/hi';

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
        <Input
          variant='filled'
          className='grow'
          placeholder='Input'
          size='lg'
          value={input}
          onChange={handleInputChange}
        />
        <Button
          className='hover:bg-transparent hover:scale-150'
          size='lg'
          onClick={runCallback}
        >
          {loading ? (
            <HiOutlineDotsCircleHorizontal
              size={24}
              className='bg-emerald-300 stroke-emerald-400 h-full w-full rounded-md p-0.5'
            />
          ) : (
            <HiOutlinePlay
              size={24}
              className='bg-emerald-400 stroke-emerald-800 h-full w-full rounded-md p-0.5'
            />
          )}
        </Button>
      </Group>
    </Stack>
  );
};

export default InputArea;
