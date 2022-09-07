import { Code, Group, Stack } from '@mantine/core';
import React from 'react';
import useQuestion from '../../hooks/useQuestion';
import { IArgument } from '../../util/testcase';
import ArgumentInput from './ArgumentInput';

const TestCaseInput = ({
  className,
  value,
  onChange,
}: {
  className?: string;
  value?: IArgument[];
  onChange?: (args: IArgument[]) => void;
}) => {
  const { questionFunction } = useQuestion();

  const handleArgChange = (event: React.ChangeEvent, index: number) => {
    const newArgs = [...value!];
    newArgs[index].value = (event.target as HTMLInputElement).value;
    onChange!(newArgs);
  };

  return (
    <Stack className={className}>
      <Code block className='text-md font-bold bg-gray-100'>
        {value?.map((arg: IArgument, idx) => (
          <Group key={arg.name ?? idx} className='space-x-0 px-0 mx-0'>
            {arg.type} {arg.name}
            {arg.isArray ? '[]' : ''} =
            <ArgumentInput
              argument={arg}
              onChange={(e) => handleArgChange(e, idx)}
            />
            ;
          </Group>
        ))}
        {questionFunction?.returnType !== 'void'
          ? `${questionFunction.returnType} return_value = ${
              questionFunction.name
            }(${questionFunction.arguments
              ?.map((arg) => arg.name)
              .join(', ')});`
          : `${questionFunction.name}(${questionFunction.arguments
              ?.map((arg) => arg.name)
              .join(', ')});`}
      </Code>
    </Stack>
  );
};

TestCaseInput.defaultProps = {
  className: '',
  value: [],
  onChange: () => {},
};

export default TestCaseInput;
