import { Input } from '@mantine/core';
import React from 'react';

type GenericInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
};

const GenericInput = ({ placeholder, value, onChange }: GenericInputProps) => (
  <Input
    size='md'
    className='grow'
    classNames={{
      input: 'font-mono rounded bg-gray-100 w-full focus:border-emerald-500',
    }}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

GenericInput.defaultProps = {
  placeholder: '',
  value: '',
  onChange: () => {},
};

export default GenericInput;
