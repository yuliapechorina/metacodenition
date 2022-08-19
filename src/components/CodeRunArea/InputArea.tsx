import { Group, Stack, Text, Tooltip, UnstyledButton } from '@mantine/core';
import React from 'react';
import { HiDotsHorizontal, HiPlay } from 'react-icons/hi';
import CodeInput from '../CodeInput';

type InputAreaProps = {
  loading: boolean;
  runCallback: () => void;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
};

const InputArea = (props: InputAreaProps) => {
  const { loading, runCallback, value, onChange } = props;

  return (
    <Stack>
      <Text className='grow text-lg'>Input</Text>
      <Group>
        <CodeInput
          className='grow rounded'
          placeholder='Input'
          value={value}
          onChange={onChange}
        />
        <UnstyledButton className='hover:scale-110' onClick={runCallback}>
          {loading ? (
            <HiDotsHorizontal
              size='36px'
              className=' bg-white fill-emerald-500 rounded-full'
            />
          ) : (
            <Tooltip label='Run'>
              <HiPlay
                size='36px'
                className=' bg-white fill-emerald-500 rounded-full'
              />
            </Tooltip>
          )}
        </UnstyledButton>
      </Group>
    </Stack>
  );
};

export default InputArea;
