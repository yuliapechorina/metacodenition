import React from 'react';
import { Button, MantineSize } from '@mantine/core';

type GenericButtonProps = {
  text: string;
  onClick?: () => void;
  className?: string;
  leftIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset' | undefined;
  size?: MantineSize;
  disabled?: boolean;
  loading?: boolean;
  red?: boolean;
  blue?: boolean;
};

const GenericButton = ({
  text,
  onClick,
  leftIcon,
  className,
  type,
  size,
  disabled,
  loading,
  red,
  blue,
}: GenericButtonProps) => {
  let myClassName = `w-fit bg-emerald-500 hover:bg-emerald-600 rounded-md ${className}`;
  if (red) {
    myClassName = `w-fit bg-red-500 fill-red-50 hover:bg-red-600 rounded-md ${className}`;
  } else if (blue) {
    myClassName = `w-fit bg-blue-500 fill-blue-50 hover:bg-blue-600 rounded-md ${className}`;
  }
  return (
    <Button
      uppercase
      size={size}
      onClick={onClick}
      className={myClassName}
      leftIcon={leftIcon}
      type={type}
      disabled={disabled}
      loading={loading}
    >
      {text}
    </Button>
  );
};

GenericButton.defaultProps = {
  onClick: undefined,
  className: '',
  leftIcon: undefined,
  type: undefined,
  size: 'md',
  disabled: false,
  loading: false,
  red: false,
  blue: false,
};

export default GenericButton;
