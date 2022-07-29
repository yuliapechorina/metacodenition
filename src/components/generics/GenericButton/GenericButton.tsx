import React from 'react';
import { Button } from '@mantine/core';

type GenericButtonProps = {
  text: string;
  onClick: () => void;
  className?: string;
  leftIcon?: React.ReactNode;
};

const GenericButton = ({
  text,
  onClick,
  leftIcon,
  className,
}: GenericButtonProps) => (
  <Button
    uppercase
    size='md'
    onClick={onClick}
    className={`w-fit bg-emerald-500 hover:bg-emerald-600 rounded-xl ${className}`}
    leftIcon={leftIcon}
  >
    {text}
  </Button>
);

GenericButton.defaultProps = {
  className: '',
  leftIcon: undefined,
};

export default GenericButton;
