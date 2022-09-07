import { Group, Stack, Text, Tooltip, UnstyledButton } from '@mantine/core';
import React, { useEffect } from 'react';
import { HiDotsHorizontal, HiPlay } from 'react-icons/hi';
import useQuestion from '../../hooks/useQuestion';
import { IArgument } from '../../util/testcase';
import TestCaseInput from './TestCaseInput';

type InputAreaProps = {
  loading: boolean;
  runCallback: (args: IArgument[]) => void;
};

const InputArea = (props: InputAreaProps) => {
  const { loading, runCallback } = props;
  const { questionFunction } = useQuestion();

  const [args, setArgs] = React.useState<IArgument[]>([
    ...(questionFunction?.arguments ?? []),
  ]);

  useEffect(() => {
    if (questionFunction) {
      setArgs([...(questionFunction.arguments ?? [])]);
    }
  }, [questionFunction]);

  return (
    <Stack>
      <Text className='grow text-lg'>Input</Text>
      <Group>
        <TestCaseInput
          className='grow rounded'
          value={args}
          onChange={setArgs}
        />
        <UnstyledButton
          className='hover:scale-110'
          onClick={() => runCallback(args)}
        >
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
