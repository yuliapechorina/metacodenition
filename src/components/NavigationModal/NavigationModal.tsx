import React from 'react';
import { Group, Modal, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import useAssignment from '../../context/AssignmentContext';
import GenericButton from '../generics/GenericButton';

type NavigationModalProps = {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
  path: string;
};
const NavigationModal = ({ opened, setOpened, path }: NavigationModalProps) => {
  const { setUnsavedChanges } = useAssignment();
  const navigate = useNavigate();

  const handleClickYes = () => {
    setOpened(false);
    setUnsavedChanges!(false);
    navigate(path);
  };

  const handleClickNo = () => {
    setOpened(false);
  };

  return (
    <Modal
      centered
      opened={opened}
      onClose={() => setOpened(false)}
      title='You have unsaved changes.'
      classNames={{
        title: 'font-bold',
        body: 'space-y-8',
      }}
    >
      <Text className='text-sm'>
        If you leave now, you will lose anything that hasn&apos;t been saved.
        <br />
        <br />
        Are you sure you want to leave?
      </Text>
      <Group className='space-x-1 justify-center'>
        <GenericButton text='Yes' onClick={handleClickYes} />
        <GenericButton text='No' red onClick={handleClickNo} />
      </Group>
    </Modal>
  );
};

export default NavigationModal;
