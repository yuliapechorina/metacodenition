import { Stack } from '@mantine/core';
import React from 'react';
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineLightBulb,
  HiOutlineClipboardList,
  HiOutlineTerminal,
  HiOutlineClipboardCheck,
} from 'react-icons/hi';
import useInterventions from '../../hooks/useInterventions';
import MainLink from './MainLink';

const data = [
  {
    icon: (
      <HiOutlineQuestionMarkCircle
        size={24}
        className='bg-blue-100 stroke-blue-600 rounded-md p-0.5'
      />
    ),
    label: 'Understanding the problem',
    pathName: 'problem',
  },
  {
    icon: (
      <HiOutlineLightBulb
        size={24}
        className='bg-violet-100 stroke-violet-600 rounded-md p-0.5'
      />
    ),
    label: 'Designing a solution',
    pathName: 'design',
  },
  {
    icon: (
      <HiOutlineClipboardList
        size={24}
        className='bg-pink-100 stroke-pink-600 rounded-md p-0.5'
      />
    ),
    label: 'Evaluating a solution',
    pathName: 'evaluation',
  },
  {
    icon: (
      <HiOutlineTerminal
        size={24}
        className='bg-red-100 stroke-red-600 rounded-md p-0.5'
      />
    ),
    label: 'Implementing a solution',
    pathName: 'implementation',
  },
  {
    icon: (
      <HiOutlineClipboardCheck
        size={24}
        className='bg-orange-100 stroke-orange-600 rounded-md p-0.5'
      />
    ),
    label: 'Evaluating implemented solution',
    pathName: 'test-cases',
  },
];

const MainLinks = () => {
  const { interventions } = useInterventions();

  const links = data.map((link) => {
    if (
      link.label === 'Implementing a solution' ||
      interventions.find((intervention) => intervention.name === link.label)
        ?.enabled
    ) {
      return (
        <MainLink
          key={link.label}
          icon={link.icon}
          label={link.label}
          pathName={link.pathName}
        />
      );
    }
    return undefined;
  });
  return <Stack spacing={5}>{links}</Stack>;
};

export default MainLinks;
