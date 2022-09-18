/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Center, Checkbox, Modal } from '@mantine/core';
import { logEvent } from 'firebase/analytics';
import GenericButton from '../generics/GenericButton';
import useInterventions from '../../hooks/useInterventions';
import { analytics } from '../../util/firebase';
import useAssignment from '../../context/AssignmentContext';

type InterventionModalProps = {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
};

const InterventionModal = ({ opened, setOpened }: InterventionModalProps) => {
  const { interventions, setUserInterventions, isLoading } = useInterventions();
  const { questionNumber } = useAssignment();
  const [checkedStates, setCheckedStates] = useState<boolean[]>(
    new Array(interventions.length).fill(false)
  );

  useEffect(() => {
    setCheckedStates(interventions.map((intervention) => intervention.enabled));
  }, [interventions]);

  const handleOnChange = (name: string, position: number) => {
    const newCheckedStates = checkedStates.map((checkedState, index) =>
      index === position ? !checkedState : checkedState
    );
    setCheckedStates(newCheckedStates);
  };

  const handleClick = () => {
    setUserInterventions(
      interventions.map((intervention, index) => ({
        ...intervention,
        enabled: checkedStates[index],
      }))
    );

    logEvent(analytics, 'select_interventions', {
      understanding_the_problem: checkedStates[0],
      designing_a_solution: checkedStates[1],
      evaluating_a_solution: checkedStates[2],
      evaluating_implemented_solution: checkedStates[3],
      question_number: questionNumber,
    });
    setOpened(false);
  };

  return (
    <Modal
      centered
      opened={opened}
      withCloseButton={false}
      onClose={() => setOpened(false)}
      title='Which problem-solving assistance would you like enabled?'
      classNames={{
        title: 'font-bold',
        body: 'space-y-4',
      }}
    >
      {interventions.map((intervention, index) => (
        <Checkbox
          key={intervention.name}
          checked={checkedStates[index] || false}
          label={intervention.name}
          onChange={() => handleOnChange(intervention.name, index)}
        />
      ))}
      <Center>
        <GenericButton
          text='Continue'
          onClick={handleClick}
          loading={isLoading}
        />
      </Center>
    </Modal>
  );
};

export default InterventionModal;
