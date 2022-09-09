import React from 'react';
import { Modal, Text } from '@mantine/core';
import HelpGif from '../HelpGif';
import ProblemText from '../ProblemText';

type ProblemModalProps = {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
};

const ProblemModal = ({ opened, setOpened }: ProblemModalProps) => (
  <Modal
    id='problem-popover'
    opened={opened}
    onClose={() => setOpened(false)}
    title='Problem:'
    size='75vw'
    centered
    classNames={{
      title: 'font-bold',
      body: 'space-y-4',
    }}
  >
    <ProblemText
      classNames={{ provider: 'text-sm' }}
      relativeParentId='problem-popover-body'
      tooltipOffset={10}
    />
    <Text className='font-bold'>Example usage:</Text>
    <HelpGif />
  </Modal>
);

export default ProblemModal;
