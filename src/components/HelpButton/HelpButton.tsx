import React from 'react';
import { UnstyledButton } from '@mantine/core';
import { HiQuestionMarkCircle } from 'react-icons/hi';

type HelpButtonProps = {
  onClick: () => void;
  className?: string;
};

const HelpButton = ({ onClick, className }: HelpButtonProps) => (
  <UnstyledButton className='flex items-center' onClick={onClick}>
    <HiQuestionMarkCircle
      size='36px'
      className={`${className} fill-emerald-500 rounded-full hover:fill-emerald-600 mr-2`}
    />
  </UnstyledButton>
);

HelpButton.defaultProps = {
  className: undefined,
};

export default HelpButton;
