import React from 'react';
import { AppShell, Group, Header, Text } from '@mantine/core';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ReactComponent as TitleIcon } from './title.svg';
import { auth } from '../../util/firebase';
import AppNotifications from '../../components/AppNotifications';
import NavBar from '../../components/NavBar';

const ApplicationShell = () => {
  const location = useLocation();
  const [user] = useAuthState(auth);

  return (
    <>
      <AppNotifications />
      <AppShell
        header={
          <Header height={40} className='p-3'>
            <Group position='apart'>
              <TitleIcon />
              <Text>{user?.displayName}</Text>
            </Group>
          </Header>
        }
        navbar={
          location.pathname.startsWith('/assignment') ? <NavBar /> : undefined
        }
        classNames={{
          root: 'h-screen w-screen flex flex-col overflow-hidden',
          body: 'h-[calc(100%-40px)] min-h-0 w-screen flex flex-row flex-shrink',
          main: 'flex-auto p-0 w-48',
        }}
      >
        <Outlet />
      </AppShell>
    </>
  );
};
export default ApplicationShell;
