import { Input } from '@mantine/core';
import React from 'react';

type CodeInputProps = {
  className?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string | number | readonly string[];
};

const CodeInputIcon = () => <p className='text-lg font-mono'>{'>'}</p>;

const CodeInput = (props: CodeInputProps) => {
  const { className, placeholder, onChange, value } = props;
  return (
    <Input
      className={className}
      classNames={{
        input: 'font-mono rounded h-10 text-lg bg-gray-100 w-full',
      }}
      icon={CodeInputIcon()}
      variant='headless'
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

CodeInput.defaultProps = {
  className: '',
  placeholder: '',
  onChange: null,
  value: '',
};

export default CodeInput;
