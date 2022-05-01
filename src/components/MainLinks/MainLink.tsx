import { Group, Text, UnstyledButton } from '@mantine/core';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LinkProps {
  icon: React.ReactNode;
  label: string;
  pathName: string;
}

const MainLink = ({ icon, label, pathName }: LinkProps) => {
  const location = useLocation();

  return (
    <Link to={pathName}>
      <UnstyledButton
        className={
          location.pathname === pathName
            ? 'bg-emerald-100 w-full h-10 p-2 rounded-md'
            : 'bg-zinc-50 w-full h-10 p-2 rounded-md'
        }
      >
        <Group className='justify-start '>
          {icon}
          <Text size='sm'>{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
};

export default MainLink;
