import { Input } from '@mantine/core';
import React, { ReactNode } from 'react';

type GenericInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  rightSection?: ReactNode;
};

const GenericInput = ({
  placeholder,
  value,
  onChange,
  rightSection,
}: GenericInputProps) => (
  <Input
    size='md'
    className='grow'
    classNames={{
      input: 'font-mono rounded bg-gray-100 w-full focus:border-emerald-500',
    }}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rightSection={rightSection}
  />
);

GenericInput.defaultProps = {
  placeholder: '',
  value: '',
  onChange: () => {},
  rightSection: undefined,
};

export default GenericInput;
