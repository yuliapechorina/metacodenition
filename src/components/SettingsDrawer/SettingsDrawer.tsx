/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Checkbox, Drawer, Text } from '@mantine/core';
import { logEvent } from 'firebase/analytics';
import useInterventions from '../../hooks/useInterventions';
import { analytics } from '../../util/firebase';

type SettingsDrawerProps = {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
};

const SettingsDrawer = ({ opened, setOpened }: SettingsDrawerProps) => {
  const { interventions, toggleInterventionEnabled } = useInterventions();

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
    toggleInterventionEnabled(name);

    logEvent(analytics, 'select_interventions', {
      understanding_the_problem: newCheckedStates[0],
      designing_a_solution: newCheckedStates[1],
      evaluating_a_solution: newCheckedStates[2],
      evaluating_implemented_solution: newCheckedStates[3],
    });
  };

  return (
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      title='Settings'
      position='right'
      className='p-4'
      classNames={{
        title: 'font-bold',
        drawer: 'space-y-4',
      }}
    >
      <Text className='font-bold text-sm'>Problem-solving assistance</Text>
      {interventions.map((intervention, index) => (
        <Checkbox
          key={intervention.name}
          checked={checkedStates[index] || false}
          label={intervention.name}
          onChange={() => handleOnChange(intervention.name, index)}
        />
      ))}
    </Drawer>
  );
};

export default SettingsDrawer;
