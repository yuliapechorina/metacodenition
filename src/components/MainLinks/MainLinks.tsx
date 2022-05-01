import { Stack } from '@mantine/core';
import React from 'react';
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineDocumentDuplicate,
  HiOutlineLightBulb,
  HiOutlineClipboardList,
  HiOutlineTerminal,
  HiOutlineClipboardCheck,
} from 'react-icons/hi';
import MainLink from './MainLink';

const data = [
  {
    icon: (
      <HiOutlineQuestionMarkCircle
        size={24}
        className='bg-violet-100 stroke-violet-600 rounded-md p-0.5'
      />
    ),
    label: 'Understanding the problem',
    pathName: '/step-1',
  },
  {
    icon: (
      <HiOutlineDocumentDuplicate
        size={24}
        className='bg-pink-100 stroke-pink-600 rounded-md p-0.5'
      />
    ),
    label: 'Searching for similar problems',
    pathName: '/step-2',
  },
  {
    icon: (
      <HiOutlineLightBulb
        size={24}
        className='bg-orange-100 stroke-orange-600 rounded-md p-0.5'
      />
    ),
    label: 'Designing a solution',
    pathName: '/step-3',
  },
  {
    icon: (
      <HiOutlineClipboardList
        size={24}
        className='bg-cyan-100 stroke-cyan-600 rounded-md p-0.5'
      />
    ),
    label: 'Evaluating a solution',
    pathName: '/step-4',
  },
  {
    icon: (
      <HiOutlineTerminal
        size={24}
        className='bg-fuchsia-100 stroke-fuchsia-600 rounded-md p-0.5'
      />
    ),
    label: 'Implementing a solution',
    pathName: '/step-5',
  },
  {
    icon: (
      <HiOutlineClipboardCheck
        size={24}
        className='bg-red-100 stroke-red-600 rounded-md p-0.5'
      />
    ),
    label: 'Evaluating implemented solution',
    pathName: '/step-6',
  },
];

const MainLinks = () => {
  const links = data.map((link) => (
    <MainLink
      key={link.label}
      icon={link.icon}
      label={link.label}
      pathName={link.pathName}
    />
  ));
  return <Stack spacing={5}>{links}</Stack>;
};

export default MainLinks;
