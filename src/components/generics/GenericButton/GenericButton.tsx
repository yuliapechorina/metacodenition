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
};

const GenericButton = ({
  text,
  onClick,
  leftIcon,
  className,
  type,
  size,
  disabled,
}: GenericButtonProps) => (
  <Button
    uppercase
    size={size}
    onClick={onClick}
    className={`w-fit bg-emerald-500 hover:bg-emerald-600 rounded-md ${className}`}
    leftIcon={leftIcon}
    type={type}
    disabled={disabled}
  >
    {text}
  </Button>
);

GenericButton.defaultProps = {
  onClick: undefined,
  className: '',
  leftIcon: undefined,
  type: undefined,
  size: 'md',
  disabled: false,
};

export default GenericButton;
