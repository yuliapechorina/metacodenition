/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Center, Checkbox, Modal } from '@mantine/core';
import GenericButton from '../generics/GenericButton';
import useInterventions from '../../hooks/useInterventions';

type InterventionModalProps = {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
};

const InterventionModal = ({ opened, setOpened }: InterventionModalProps) => {
  const { interventions, setUserInterventions, loading } = useInterventions();

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
          loading={loading}
        />
      </Center>
    </Modal>
  );
};

export default InterventionModal;
