import {
  AppShell,
  Group,
  Header,
  Navbar,
  Text,
  UnstyledButton,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { useAuthState } from 'react-firebase-hooks/auth';
import MainLinks from '../../components/MainLinks/MainLinks';
import { ReactComponent as TitleIcon } from './title.svg';
import { auth } from '../../util/firebase';

const paths = [
  'problem',
  'design',
  'evaluation',
  'implementation',
  'test-cases',
];

const MainPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [currentPathIndex, setCurrentPathIndex] = useState(0);

  useEffect(() => {
    navigate('problem');
  }, []);

  useEffect(() => {
    navigate(paths[currentPathIndex]);
  }, [currentPathIndex]);

  const handleClickNext = () => {
    if (currentPathIndex !== 4) {
      setCurrentPathIndex(currentPathIndex + 1);
    }
  };

  const handleClickPrev = () => {
    if (currentPathIndex !== 0) {
      setCurrentPathIndex(currentPathIndex - 1);
    }
  };

  return (
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
        <Navbar className='p-1 w-fit'>
          <Navbar.Section>
            <MainLinks />
          </Navbar.Section>
          <Navbar.Section className='justify-self-end mt-auto pb-4'>
            <Group className='justify-center'>
              <UnstyledButton onClick={handleClickPrev}>
                <HiArrowLeft
                  size='36px'
                  className=' bg-emerald-500 fill-emerald-50 rounded-full p-1'
                />
              </UnstyledButton>
              <UnstyledButton onClick={handleClickNext}>
                <HiArrowRight
                  size='36px'
                  className=' bg-emerald-500 fill-emerald-50 rounded-full p-1'
                />
              </UnstyledButton>
            </Group>
          </Navbar.Section>
        </Navbar>
      }
      classNames={{
        root: 'h-screen w-screen flex flex-col overflow-hidden',
        body: 'min-h-0 w-screen flex flex-row flex-shrink',
        main: 'flex-auto p-0 w-48',
      }}
    >
      <Outlet />
    </AppShell>
  );
};
export default MainPage;
