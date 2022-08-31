import {
  Popover,
  Text,
  TypographyStylesProvider,
  UnstyledButton,
} from '@mantine/core';
import { getAnalytics, logEvent } from 'firebase/analytics';
import HTMLReactParser from 'html-react-parser';
import React from 'react';
import { HiQuestionMarkCircle } from 'react-icons/hi';
import useQuestion from '../../hooks/useQuestion';

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
  const { getProblemStatement } = useQuestion();

  const analytics = getAnalytics();

  const handleClickOpenProblem = () => {
    if (!opened) logEvent(analytics, 'open_problem_popover');
    setOpened(!opened);
  };

  return (
    <Popover
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
        root: className,
        body: 'border-gray-300 border-sm',
        header: 'border-gray-300 border-sm',
        popover: 'bg-white/30 backdrop-blur-md',
        arrow: 'bg-white/30 backdrop-blur-md border-gray-300 border-sm mr-1',
      }}
    >
      <Text className='text-justify'>
        <TypographyStylesProvider className='text-sm'>
          {HTMLReactParser(getProblemStatement!())}
        </TypographyStylesProvider>
      </Text>
    </Popover>
  );
};

ProblemPopover.defaultProps = {
  className: '',
};

export default ProblemPopover;
