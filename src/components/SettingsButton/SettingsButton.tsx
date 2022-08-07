import { UnstyledButton } from '@mantine/core';
import React from 'react';
import { HiOutlineCog } from 'react-icons/hi';
import SettingsDrawer from '../SettingsDrawer/SettingsDrawer';

const SettingsButton = () => {
  const [interventionModalOpened, setInterventionModalOpened] =
    React.useState(false);

  return (
    <>
      <UnstyledButton
        className='flex items-center'
        onClick={() => setInterventionModalOpened(true)}
      >
        <HiOutlineCog size='24px' className='stroke-black hover:scale-110' />
      </UnstyledButton>
      <SettingsDrawer
        opened={interventionModalOpened}
        setOpened={setInterventionModalOpened}
      />
    </>
  );
};

export default SettingsButton;
