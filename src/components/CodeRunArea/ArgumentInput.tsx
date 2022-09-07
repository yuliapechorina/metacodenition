import { TextInput } from '@mantine/core';
import React from 'react';
import { IArgument } from '../../util/testcase';

const ArgumentInput = ({
  argument,
  onChange,
}: {
  argument: IArgument;
  onChange: (event: React.ChangeEvent) => void;
}) => (
  <TextInput
    value={argument?.value}
    onChange={onChange}
    placeholder={argument.name}
    classNames={{
      input: 'font-mono rounded h-10 text-lg w-full',
    }}
  />
);
export default ArgumentInput;
