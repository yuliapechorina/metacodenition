import { Tooltip, UnstyledButton } from '@mantine/core';
import React from 'react';
import { HiOutlineLogout } from 'react-icons/hi';
import { logOut } from '../../util/firebase';

const LogOutButton = () => (
  <Tooltip label='Log out' position='bottom'>
    <UnstyledButton className='flex items-center' onClick={() => logOut()}>
      <HiOutlineLogout size='24px' className='stroke-black hover:scale-110' />
    </UnstyledButton>
  </Tooltip>
);

export default LogOutButton;
