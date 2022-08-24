import { Navbar, Tooltip } from '@mantine/core';
import { useState } from 'react';
import useAssignment from '../../context/AssignmentContext';
import useQuestion from '../../hooks/useQuestion';
import GenericButton from '../generics/GenericButton';
import MainLinks from '../MainLinks';
import NavigationModal from '../NavigationModal';
import SubmissionModal from '../SubmissionModal';

const NavBar = () => {
  const { unsavedChanges } = useAssignment();
  const { isLoading } = useQuestion();
  const [submissionModalOpened, setSubmissionModalOpened] = useState(false);
  const [navigationModalOpened, setNavigationModalOpened] = useState(false);

  const handleQuestionSubmission = () =>
    unsavedChanges
      ? setNavigationModalOpened(true)
      : setSubmissionModalOpened(true);

  return (
    <>
      <Navbar className='p-1 w-fit'>
        <Navbar.Section>
          <MainLinks />
        </Navbar.Section>
        <Navbar.Section className='justify-self-end mt-auto pb-4 mx-auto'>
          <Tooltip label='Submit current question and proceed'>
            <GenericButton
              text='Submit'
              onClick={handleQuestionSubmission}
              disabled={isLoading}
              loading={isLoading}
            />
          </Tooltip>
        </Navbar.Section>
      </Navbar>
      <SubmissionModal
        opened={submissionModalOpened}
        setOpened={setSubmissionModalOpened}
      />
      <NavigationModal
        opened={navigationModalOpened}
        setOpened={setNavigationModalOpened}
        path=''
      />
    </>
  );
};

export default NavBar;
