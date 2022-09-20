import React from 'react';
import { Group, Modal, Text } from '@mantine/core';
import { logEvent } from 'firebase/analytics';
import useAssignment from '../../context/AssignmentContext';
import GenericButton from '../generics/GenericButton';
import useQuestion from '../../hooks/useQuestion';
import useCode from '../../context/CodeContext';
import { analytics } from '../../util/firebase';
import useUser from '../../hooks/useUser';

type SubmissionModalProps = {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
};
const SubmissionModal = ({ opened, setOpened }: SubmissionModalProps) => {
  const { questionNumber, setNextQuestion } = useAssignment();
  const { isLoading, updateUserQuestionDocument } = useQuestion();
  const { file } = useCode();
  const { upi, userGroup } = useUser();

  const handleClickYes = () => {
    updateUserQuestionDocument({ submitted: true, userCode: file });
    setNextQuestion!();
    setOpened(false);
    logEvent(analytics, 'confirm_submit_question', {
      question_number: questionNumber,
      user_upi: upi,
      user_testing_group: userGroup,
    });
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
