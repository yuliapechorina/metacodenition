import { Popover, UnstyledButton } from '@mantine/core';
import { logEvent } from 'firebase/analytics';
import React from 'react';
import { HiQuestionMarkCircle } from 'react-icons/hi';
import { analytics } from '../../util/firebase';
import ProblemText from '../ProblemText';

type ProblemPopoverProps = {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
  className?: string;
};

const ProblemPopover = ({
  opened,
  setOpened,
  className,
}: ProblemPopoverProps) => {
  const handleClickOpenProblem = () => {
    if (!opened) logEvent(analytics, 'open_problem_popover');
    setOpened(!opened);
  };

  return (
    <Popover
      id='problem-popover'
      opened={opened}
      onClose={() => setOpened(false)}
      target={
        <UnstyledButton
          className='flex items-center'
          onClick={handleClickOpenProblem}
        >
          <HiQuestionMarkCircle
            size='36px'
            className='fill-emerald-500 rounded-full hover:fill-emerald-600'
          />
        </UnstyledButton>
      }
      position='bottom'
      placement='end'
      width='75vw'
      gutter={0}
      withArrow
      title='Problem:'
      classNames={{
        root: `${className}`,
        body: 'border-gray-300 border-sm',
        header: 'border-gray-300 border-sm',
        popover: 'bg-white/30 backdrop-blur-md',
        arrow: 'bg-white/30 backdrop-blur-md border-gray-300 border-sm mr-1',
      }}
    >
      <ProblemText
        classNames={{ provider: 'text-sm' }}
        relativeParentId='problem-popover-body'
        tooltipOffset={10}
      />
    </Popover>
  );
};

ProblemPopover.defaultProps = {
  className: '',
};

export default ProblemPopover;
