import React from 'react';
import { Button, MantineSize } from '@mantine/core';

type GenericButtonProps = {
  text: string;
  onClick?: () => void;
  className?: string;
  leftIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset' | undefined;
  size?: MantineSize;
};

const GenericButton = ({
  text,
  onClick,
  leftIcon,
  className,
  type,
  size,
}: GenericButtonProps) => (
  <Button
    uppercase
    size={size}
    onClick={onClick}
    className={`w-fit bg-emerald-500 hover:bg-emerald-600 rounded-xl ${className}`}
    leftIcon={leftIcon}
    type={type}
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
};

export default GenericButton;
