import { Group, Modal, Stack, Text, UnstyledButton } from '@mantine/core';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAssignment from '../../context/AssignmentContext';
import GenericButton from '../generics/GenericButton';

interface LinkProps {
  icon: React.ReactNode;
  label: string;
  pathName: string;
}

const MainLink = ({ icon, label, pathName }: LinkProps) => {
  const [showModal, setShowModal] = React.useState(false);
  const { unsavedChanges, setUnsavedChanges } = useAssignment();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (unsavedChanges) {
      setShowModal(true);
    } else {
      navigate(`/assignment/${pathName}`);
    }
  };

  const handleConfirmNavigation = () => {
    setShowModal(false);
    setUnsavedChanges!(false);
    navigate(`/assignment/${pathName}`);
  };

  const handleDeclineNavigation = () => setShowModal(false);

  return (
    <Stack>
      <UnstyledButton
        className={
          location.pathname === `/assignment/${pathName}`
            ? 'bg-emerald-100 w-full h-10 p-2 rounded-md whitespace-nowrap'
            : 'bg-zinc-50 w-full h-10 p-2 rounded-md whitespace-nowrap'
        }
        onClick={handleLinkClick}
      >
        <Group className='justify-start flex-nowrap'>
          {icon}
          <Text size='sm'>{label}</Text>
        </Group>
      </UnstyledButton>
      <Modal
        centered
        opened={showModal}
        onClose={() => setShowModal(false)}
        size='sm'
        title='Unsaved Changes'
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
          <GenericButton text='Yes' red onClick={handleConfirmNavigation} />
          <GenericButton text='No' onClick={handleDeclineNavigation} />
        </Group>
      </Modal>
    </Stack>
  );
};

export default MainLink;
