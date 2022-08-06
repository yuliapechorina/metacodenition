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
import { useAuthState } from 'react-firebase-hooks/auth';
import { HiCheck, HiChevronDoubleRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import useAssignment from '../../context/AssignmentContext';
import { auth } from '../../util/firebase';

const AssignmentPage = () => {
  const {
    assignmentName,
    setAssignmentName,
    setQuestionId,
    assignmentsData,
    userAssignmentCompletion,
  } = useAssignment();
  const navigate = useNavigate();

  const [user] = useAuthState(auth);

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
          Kia Ora, {user?.displayName}!
        </Title>
        <Space h={8} />
        <Title order={4}>Choose an assignment to continue:</Title>
        {assignmentsData?.map((d: DocumentData, i) => (
          <UnstyledButton
            key={d.name}
            className='bg-gray-100 w-96 h-12 rounded-xl'
            onClick={() => handleAssignmentSelect(d.name)}
          >
            <Group className='justify-between px-4'>
              {d.name}
              {userAssignmentCompletion?.[i] ? (
                <HiCheck size={32} className='text-green-600' />
              ) : (
                <HiChevronDoubleRight size={32} className='text-gray-600' />
              )}
            </Group>
          </UnstyledButton>
        ))}
      </Stack>
    </ScrollArea>
  );
};

export default AssignmentPage;
