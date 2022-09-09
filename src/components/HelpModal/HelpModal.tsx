import React from 'react';
import { Modal } from '@mantine/core';
import HelpGif from '../HelpGif';

type HelpModalProps = {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
};

const HelpModal = ({ opened, setOpened }: HelpModalProps) => (
  <Modal
    opened={opened}
    onClose={() => setOpened(false)}
    title='Example usage:'
    size='50vw'
    centered
    classNames={{
      title: 'font-bold',
      body: 'space-y-4',
    }}
  >
    <HelpGif />
  </Modal>
);

export default HelpModal;
