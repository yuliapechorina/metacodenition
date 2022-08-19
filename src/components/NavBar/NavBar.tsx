import { Navbar, Tooltip } from '@mantine/core';
import { useState } from 'react';
import useQuestion from '../../hooks/useQuestion';
import GenericButton from '../generics/GenericButton';
import MainLinks from '../MainLinks';
import SubmissionModal from '../SubmissionModal';

const NavBar = () => {
  const { isLoading } = useQuestion();
  const [submissionModalOpened, setSubmissionModalOpened] = useState(false);

  const openSubmissionModal = () => {
    setSubmissionModalOpened(true);
  };

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
              onClick={openSubmissionModal}
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
    </>
  );
};

export default NavBar;
