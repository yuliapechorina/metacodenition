import React from 'react';
import { Group, Modal, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { getAnalytics, logEvent } from 'firebase/analytics';
import useAssignment from '../../context/AssignmentContext';
import GenericButton from '../generics/GenericButton';
import useQuestion from '../../hooks/useQuestion';
import useCode from '../../context/CodeContext';

type SubmissionModalProps = {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
};
const SubmissionModal = ({ opened, setOpened }: SubmissionModalProps) => {
  const { questionNumber, setNextQuestion } = useAssignment();
  const { isLoading, updateUserQuestionDocument } = useQuestion();
  const { file } = useCode();
  const navigate = useNavigate();

  const analytics = getAnalytics();

  const handleClickYes = () => {
    updateUserQuestionDocument({ submitted: true, userCode: file });
    setNextQuestion!();
    navigate('/assignment');
    setOpened(false);
    logEvent(analytics, 'confirm_submit_question');
  };

  const handleClickNo = () => {
    setOpened(false);
  };

  return (
    <Modal
      centered
      opened={opened}
      withCloseButton={false}
      onClose={() => setOpened(false)}
      title={`You're about to submit Question ${questionNumber}. Are you sure?`}
      classNames={{
        title: 'font-bold',
        body: 'space-y-8',
      }}
    >
      <Text className='text-sm'>
        You won&apos;t be able to go back and edit your answer once you submit.
      </Text>
      <Group className='space-x-1 justify-center'>
        <GenericButton
          text='Yes'
          onClick={handleClickYes}
          disabled={isLoading}
          loading={isLoading}
        />
        <GenericButton
          text='No'
          red
          onClick={handleClickNo}
          disabled={isLoading}
          loading={isLoading}
        />
      </Group>
    </Modal>
  );
};

export default SubmissionModal;
