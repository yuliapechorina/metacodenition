import { useEffect, useState } from 'react';
import { Divider, Group, ScrollArea, Stack, Text, Title } from '@mantine/core';
import { logEvent } from 'firebase/analytics';
import InterventionModal from '../../components/InterventionModal';
import TestCaseSolver from '../../components/TestCaseSolver';
import useAssignment from '../../context/AssignmentContext';
import { getCookie, setCookie } from '../../util/cookie';
import ProblemText from '../../components/ProblemText';
import HelpButton from '../../components/HelpButton';
import { analytics } from '../../util/firebase';
import HelpModal from '../../components/HelpModal';
import useUser from '../../hooks/useUser';

const ProblemPage = () => {
  const { questionNumber } = useAssignment();
  const { upi, userGroup } = useUser();

  const [interventionModalOpened, setInterventionModalOpened] = useState(false);

  const [isHelpModalOpened, setHelpModalOpened] = useState(false);

  useEffect(() => {
    if (questionNumber === 3) {
      const visitedCookie = getCookie('question3Visited');
      if (visitedCookie !== 'true') {
        setInterventionModalOpened(true);
        setCookie('question3Visited', 'true');
      }
    }
  }, [questionNumber]);

  const handleClickOpenHelpModal = () => {
    logEvent(analytics, 'open_help_modal', {
      question_number: questionNumber,
      user_upi: upi,
      user_testing_group: userGroup,
    });
    setHelpModalOpened(true);
  };

  return (
    <>
      <ScrollArea className='h-full'>
        <Stack className='p-4'>
          <Group className='justify-between items-start flex-nowrap'>
            <Title order={4}>Problem:</Title>
            <HelpButton onClick={handleClickOpenHelpModal} />
          </Group>
          <Text className='text-justify'>
            <ProblemText />
          </Text>
          <Divider />
          <TestCaseSolver />
        </Stack>
      </ScrollArea>
      <InterventionModal
        opened={interventionModalOpened}
        setOpened={setInterventionModalOpened}
      />
      <HelpModal opened={isHelpModalOpened} setOpened={setHelpModalOpened} />
    </>
  );
};

export default ProblemPage;
