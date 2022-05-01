import { AppShell, Group, Header, Navbar, UnstyledButton } from '@mantine/core';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import MainLinks from '../../components/MainLinks/MainLinks';
import { ReactComponent as TitleIcon } from './title.svg';
import CodeEditor from '../../components/CodeEditor/CodeEditor';

const MainPage = () => {
  const location = useLocation();

  const files = ['main.c', 'main.h'];

  return (
    <AppShell
      header={
        <Header height={40} className='p-3'>
          <TitleIcon />
        </Header>
      }
      navbar={
        <Navbar className='p-1 w-fit'>
          <Navbar.Section>
            <MainLinks />
          </Navbar.Section>
          <Navbar.Section className='justify-self-end mt-auto pb-4'>
            <Group className='justify-center'>
              <UnstyledButton>
                <HiArrowLeft
                  size='36px'
                  className=' bg-emerald-500 fill-emerald-50 rounded-full p-1'
                />
              </UnstyledButton>
              <UnstyledButton>
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
        root: 'h-screen overflow-clip',
        body: 'w-screen h-full',
      }}
    >
      {location.pathname === '/step-5' ? (
        <CodeEditor tabNames={files} />
      ) : (
        'Hello world!'
      )}
    </AppShell>
  );
};
export default MainPage;
