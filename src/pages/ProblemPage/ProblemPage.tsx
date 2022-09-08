import { useEffect, useState } from 'react';
import { Divider, ScrollArea, Stack, Text, Title } from '@mantine/core';
import InterventionModal from '../../components/InterventionModal';
import TestCaseSolver from '../../components/TestCaseSolver';
import useAssignment from '../../context/AssignmentContext';
import { getCookie, setCookie } from '../../util/cookie';
import ProblemText from '../../components/ProblemText';

const ProblemPage = () => {
  const { questionNumber } = useAssignment();

  const [interventionModalOpened, setInterventionModalOpened] = useState(false);

  useEffect(() => {
    if (questionNumber === 3) {
      const visitedCookie = getCookie('question3Visited');
      if (visitedCookie !== 'true') {
        setInterventionModalOpened(true);
        setCookie('question3Visited', 'true');
      }
    }
  }, [questionNumber]);

  return (
    <>
      <ScrollArea className='h-full'>
        <Stack className='p-4'>
          <Title order={4}>Problem:</Title>
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
    </>
  );
};

export default ProblemPage;
