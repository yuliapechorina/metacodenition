import {
  ScrollArea,
  Stack,
  Title,
  UnstyledButton,
  Group,
  Space,
  LoadingOverlay,
} from '@mantine/core';
import { DocumentData } from 'firebase/firestore';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { HiCheck, HiChevronDoubleRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import PreSurveyForm from '../../components/PreSurveyForm';
import useAssignment from '../../context/AssignmentContext';
import useUser from '../../hooks/useUser';
import { auth } from '../../util/firebase';

const EntryPage = () => {
  const {
    assignmentName,
    setAssignmentName,
    assignmentsData,
    userAssignmentCompletion,
    assignmentComplete,
    assignmentSubmitted,
  } = useAssignment();
  const navigate = useNavigate();

  const [user] = useAuthState(auth);

  const { userData, isLoading } = useUser();

  const handleAssignmentSelect = (s: string) => {
    if (assignmentsData?.map((a) => a.name).includes(s)) {
      setAssignmentName!(s);
    }
  };

  useEffect(() => {
    if (assignmentName) {
      if (assignmentComplete || assignmentSubmitted) {
        navigate('/submit');
      } else {
        navigate('/assignment');
      }
    }
  }, [assignmentName]);

  return (
    <ScrollArea className='h-full'>
      <Stack className='p-16'>
        <Title order={2} className='font-black'>
          Kia Ora, {user?.displayName}!
        </Title>
        <Space h={8} />
        <LoadingOverlay visible={isLoading} overlayOpacity={100} />
        {userData?.preSurveySubmitted ? (
          <>
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
          </>
        ) : (
          <PreSurveyForm />
        )}
      </Stack>
    </ScrollArea>
  );
};

export default EntryPage;
