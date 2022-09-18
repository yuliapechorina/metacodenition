import {
  ScrollArea,
  Stack,
  Title,
  UnstyledButton,
  Group,
  Space,
  LoadingOverlay,
  Divider,
  Text,
} from '@mantine/core';
import { DocumentData } from 'firebase/firestore';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  HiCheck,
  HiChevronDoubleRight,
  HiMail,
  HiOutlineMail,
  HiOutlineMailOpen,
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
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

  const { isLoading } = useUser();

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
    <ScrollArea className='h-full relative'>
      <Stack className='p-16'>
        <Title order={2} className='font-black'>
          Kia Ora, {user?.displayName}!
        </Title>
        <Space h={8} />
        <LoadingOverlay visible={isLoading} overlayOpacity={100} />
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
        <Space h={8} />
        <Divider />
        <Space h={8} />
        <Title order={4}>How to use:</Title>
        <iframe
          className='w-1/3 aspect-video'
          src='https://www.youtube-nocookie.com/embed/9CSfaRW8IhQ'
          title='Metacodenition Intro Video'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
        <Space h={8} />
        <Divider />
        <Space h={8} />
        <Title order={4}>Contact info:</Title>
        <Text>
          <a href='mailto:metacodenition@gmail.com'>
            <HiOutlineMail size={32} className='text-gray-600 inline pr-2' />
            metacodenition@gmail.com
          </a>
        </Text>
      </Stack>
    </ScrollArea>
  );
};

export default EntryPage;
