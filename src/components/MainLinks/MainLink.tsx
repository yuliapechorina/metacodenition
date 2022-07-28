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
    <Link to={`/assignment/${pathName}`}>
      <UnstyledButton
        className={
          location.pathname === `/assignment/${pathName}`
            ? 'bg-emerald-100 w-full h-10 p-2 rounded-md whitespace-nowrap'
            : 'bg-zinc-50 w-full h-10 p-2 rounded-md whitespace-nowrap'
        }
      >
        <Group className='justify-start flex-nowrap'>
          {icon}
          <Text size='sm'>{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
};

export default MainLink;
