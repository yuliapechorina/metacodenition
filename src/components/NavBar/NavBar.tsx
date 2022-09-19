import { Navbar, Tooltip } from '@mantine/core';
import { logEvent } from 'firebase/analytics';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAssignment from '../../context/AssignmentContext';
import useInterventions from '../../hooks/useInterventions';
import useQuestion from '../../hooks/useQuestion';
import useUser from '../../hooks/useUser';
import { analytics } from '../../util/firebase';
import GenericButton from '../generics/GenericButton';
import MainLinks from '../MainLinks';
import NavigationModal from '../NavigationModal';
import SubmissionModal from '../SubmissionModal';

const NavBar = () => {
  const { interventions } = useInterventions();
  const location = useLocation();
  const { unsavedChanges } = useAssignment();
  const { isLoading } = useQuestion();
  const [submissionModalOpened, setSubmissionModalOpened] = useState(false);
  const [navigationModalOpened, setNavigationModalOpened] = useState(false);
  const { questionNumber } = useAssignment();
  const { upi, userGroup } = useUser();

  const isLastPage = useMemo(() => {
    const stage = location.pathname.split('/')[2];
    const finalIntervention = interventions[interventions.length - 1]?.enabled
      ? 'test-cases'
      : 'implementation';
    return stage === finalIntervention;
  }, [interventions, location]);

  const handleQuestionSubmission = () => {
    if (unsavedChanges) {
      setNavigationModalOpened(true);
    } else {
      setSubmissionModalOpened(true);
    }

    logEvent(analytics, 'submit_question', {
      question_number: questionNumber,
      user_upi: upi,
      user_testing_group: userGroup,
    });
  };

  return (
    <>
      <Navbar className='p-1 w-fit'>
        <Navbar.Section>
          <MainLinks />
        </Navbar.Section>
        <Navbar.Section className='justify-self-end mt-auto pb-4 mx-auto'>
          {isLastPage ? (
            <Tooltip label='Submit current question and proceed'>
              <GenericButton
                text='Submit'
                onClick={handleQuestionSubmission}
                disabled={isLoading}
                loading={isLoading}
              />
            </Tooltip>
          ) : (
            <Tooltip label='You must be on the last stage to submit your solution!'>
              <GenericButton text='Submit' disabled />
            </Tooltip>
          )}
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
