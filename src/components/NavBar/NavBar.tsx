import { Group, Navbar, UnstyledButton } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import MainLinks from '../MainLinks';

const paths = [
  'problem',
  'design',
  'evaluation',
  'implementation',
  'test-cases',
];

const NavBar = () => {
  const navigate = useNavigate();
  const [currentPathIndex, setCurrentPathIndex] = useState(0);

  useEffect(() => {
    navigate(`assignment/${paths[currentPathIndex]}`);
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
  );
};

export default NavBar;
