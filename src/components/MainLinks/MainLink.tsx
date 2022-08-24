import { Group, Stack, Text, UnstyledButton } from '@mantine/core';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAssignment from '../../context/AssignmentContext';
import NavigationModal from '../NavigationModal';

interface LinkProps {
  icon: React.ReactNode;
  label: string;
  pathName: string;
}

const MainLink = ({ icon, label, pathName }: LinkProps) => {
  const [showModal, setShowModal] = React.useState(false);
  const { unsavedChanges } = useAssignment();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (unsavedChanges) {
      setShowModal(true);
    } else {
      navigate(`/assignment/${pathName}`);
    }
  };

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
      <NavigationModal
        opened={showModal}
        setOpened={setShowModal}
        path={`/assignment/${pathName}`}
      />
    </Stack>
  );
};

export default MainLink;
