import React, { useEffect, useState } from 'react';
import {
  Divider,
  ScrollArea,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import HTMLReactParser from 'html-react-parser';
import useQuestion from '../../hooks/useQuestion';
import InterventionModal from '../../components/InterventionModal';
import TestCaseSolver from '../../components/TestCaseSolver';
import useAssignment from '../../context/AssignmentContext';
import { getCookie, setCookie } from '../../util/cookie';

const ProblemPage = () => {
  const { getProblemStatement } = useQuestion();
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
  }, []);

  return (
    <>
      <ScrollArea className='h-full'>
        <Stack className='p-4'>
          <Title order={4}>Problem:</Title>
          <Text className='text-justify'>
            <TypographyStylesProvider>
              {HTMLReactParser(getProblemStatement!())}
            </TypographyStylesProvider>
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
