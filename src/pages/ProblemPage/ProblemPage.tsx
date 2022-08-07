import React, { useState } from 'react';
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

const ProblemPage = () => {
  const { getProblemStatement } = useQuestion();

  const [interventionModalOpened, setInterventionModalOpened] = useState(true);

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
