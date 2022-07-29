import { ScrollArea, Stack, Title, Text } from '@mantine/core';
import { DocumentData } from 'firebase/firestore';
import useAssignment from '../../context/AssignmentContext';

const AssignmentPage = () => {
  const { assignmentsData, userDocData } = useAssignment();

  return (
    <ScrollArea className='h-full'>
      <Stack className='p-4'>
        <Title order={2} className='font-black'>
          Kia Ora, {userDocData?.name}!
        </Title>
        <Title order={4}>Choose an assignment to continue:</Title>
        {assignmentsData?.map((doc: DocumentData) => (
          <Text key={doc.name}>{doc.name}</Text>
        ))}
      </Stack>
    </ScrollArea>
  );
};

export default AssignmentPage;
