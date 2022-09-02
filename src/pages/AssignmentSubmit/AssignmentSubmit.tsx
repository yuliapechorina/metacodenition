import {
  ScrollArea,
  Stack,
  Title,
  Space,
  Container,
  Center,
} from '@mantine/core';
import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import { useNavigate } from 'react-router-dom';
import AssignmentFeedbackForm from '../../components/AssignmentFeedbackForm';
import CodeCopyBox from '../../components/CodeCopyBox/CodeCopyBox';
import GenericButton from '../../components/generics/GenericButton';
import useAssignment from '../../context/AssignmentContext';

const AssignmentSubmit = () => {
  const { assignmentName, assignmentSubmitted, getAllCode } = useAssignment();
  const navigate = useNavigate();
  const [codeStackRef, { entry: codeStackEntry }] = useIntersectionObserver();
  const codeTitleRef = useRef<HTMLHeadingElement>(null);
  const scrollToCodeTitle = () => codeTitleRef.current?.scrollIntoView();
  const codeStackIsVisible = codeStackEntry && codeStackEntry.isIntersecting;
  const code = getAllCode!();

  useEffect(() => {
    if (!assignmentName) {
      navigate('/entry');
    }
  }, [assignmentName]);

  return (
    <ScrollArea className='h-full' classNames={{ viewport: ' scroll-smooth' }}>
      <Center>
        <Stack className='p-8 max-w-3xl gap-y-0'>
          <Title order={2}>Thanks for using our IDE!</Title>
          {!assignmentSubmitted && <AssignmentFeedbackForm />}
          {assignmentSubmitted && (
            <Title order={4}>Thank you for your feedback!</Title>
          )}
          <Space h={68} />
          <Stack ref={codeStackRef}>
            <Title order={2} ref={codeTitleRef}>
              Please find your answers to the questions below:
            </Title>
            {code?.map((c, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Stack key={i}>
                <Title order={4}>Question {i + 1}:</Title>
                <CodeCopyBox code={c} />
              </Stack>
            ))}
          </Stack>
        </Stack>
        {!codeStackIsVisible && (
          <Container className='absolute right-0 bottom-0' px={16} py={16}>
            <GenericButton
              size='lg'
              text='Skip to answers'
              onClick={scrollToCodeTitle}
            />
          </Container>
        )}
      </Center>
    </ScrollArea>
  );
};

export default AssignmentSubmit;
