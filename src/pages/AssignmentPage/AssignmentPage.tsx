import {
  ScrollArea,
  Stack,
  Title,
  UnstyledButton,
  Group,
  Space,
} from '@mantine/core';
import { DocumentData } from 'firebase/firestore';
import { useEffect } from 'react';
import { HiChevronDoubleRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import useAssignment from '../../context/AssignmentContext';

const AssignmentPage = () => {
  const {
    assignmentName,
    setAssignmentName,
    setQuestionId,
    assignmentsData,
    userDocData,
  } = useAssignment();
  const navigate = useNavigate();

  const handleAssignmentSelect = (s: string) => {
    if (assignmentsData?.map((a) => a.name).includes(s)) {
      setAssignmentName!(s);
    }
  };

  useEffect(() => {
    if (assignmentName) {
      const assignmentData = assignmentsData?.find(
        (a) => a.name === assignmentName
      );
      setQuestionId!(assignmentData?.questions?.[0]);
      navigate('/assignment');
    }
  }, [assignmentName]);

  return (
    <ScrollArea className='h-full'>
      <Stack className='p-16'>
        <Title order={2} className='font-black'>
          Kia Ora, {userDocData?.name}!
        </Title>
        <Space h={8} />
        <Title order={4}>Choose an assignment to continue:</Title>
        {assignmentsData?.map((d: DocumentData) => (
          <UnstyledButton
            key={d.name}
            className='bg-gray-100 max-w-md rounded-md p-4'
            onClick={() => handleAssignmentSelect(d.name)}
          >
            <Group className=' justify-between'>
              {d.name}
              <HiChevronDoubleRight size={32} className='text-gray-600' />
            </Group>
          </UnstyledButton>
        ))}
      </Stack>
    </ScrollArea>
  );
};

export default AssignmentPage;
