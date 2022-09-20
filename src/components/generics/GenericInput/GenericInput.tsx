import { Input } from '@mantine/core';
import React, { ReactNode } from 'react';

type GenericInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  rightSection?: ReactNode;
  error?: boolean;
  onSubmit?: () => void;
};

const GenericInput = ({
  placeholder,
  value,
  onChange,
  rightSection,
  error,
  onSubmit,
}: GenericInputProps) => (
  <Input
    size='md'
    className='grow'
    classNames={{
      input: `font-mono rounded bg-gray-100 w-full ${
        error ? 'focus:border-red-500' : 'focus:border-emerald-500'
      }`,
    }}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rightSection={rightSection}
    onKeyDown={(e: { key: string }) => {
      if (e.key === 'Enter' && onSubmit !== undefined) {
        onSubmit();
      }
    }}
  />
);

GenericInput.defaultProps = {
  placeholder: '',
  value: '',
  onChange: () => {},
  rightSection: undefined,
  error: false,
  onSubmit: () => {},
};

export default GenericInput;
