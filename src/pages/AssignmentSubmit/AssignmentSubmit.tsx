import { Code, ScrollArea, Stack, Title, Text } from '@mantine/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentFeedbackForm from '../../components/AssignmentFeedbackForm';
import useAssignment from '../../context/AssignmentContext';

const AssignmentSubmit = () => {
  const { assignmentName, assignmentSubmitted, getAllCode } = useAssignment();
  const navigate = useNavigate();
  const code = getAllCode!();
  useEffect(() => {
    if (!assignmentName) {
      navigate('/choose-assignment');
    }
  }, [assignmentName]);

  return (
    <ScrollArea className='h-full'>
      <Stack className='p-16 max-w-5xl'>
        <Title order={2}>Submit your assignment!</Title>
        <Title order={4}>
          Well done on completing &quot;{assignmentName}&quot;.
        </Title>
        {!assignmentSubmitted && <AssignmentFeedbackForm />}
        {assignmentSubmitted && (
          <>
            <Title order={6}>
              Thank you for your feedback! Please find your answers to the
              questions below:
            </Title>
            {code?.map((c, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Stack key={i}>
                <Text>Question {i + 1}:</Text>
                <Code block>{c}</Code>
              </Stack>
            ))}
          </>
        )}
      </Stack>
    </ScrollArea>
  );
};

export default AssignmentSubmit;
