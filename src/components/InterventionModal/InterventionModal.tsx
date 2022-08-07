/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { Center, Checkbox, CheckboxGroup, Modal } from '@mantine/core';
import GenericButton from '../generics/GenericButton';

type InterventionModalProps = {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
};

const InterventionModal = ({ opened, setOpened }: InterventionModalProps) => {
  const options = [
    'Understanding the problem',
    'Designing a solution',
    'Evaluating a solution',
    'Evaluating implemented solution',
  ];
  const [value, setValue] = useState(options);

  return (
    <Modal
      centered
      opened={opened}
      withCloseButton={false}
      onClose={() => setOpened(false)}
      title='Which problem-solving assistance would you like enabled?'
      classNames={{
        title: 'font-bold',
        body: 'space-y-8',
      }}
    >
      <CheckboxGroup value={value} onChange={setValue} orientation='vertical'>
        {options.map((option, index) => (
          <Checkbox key={index} value={option} label={option} />
        ))}
      </CheckboxGroup>
      <Center>
        <GenericButton text='Continue' onClick={() => setOpened(false)} />
      </Center>
    </Modal>
  );
};

export default InterventionModal;
