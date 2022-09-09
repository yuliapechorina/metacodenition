import React from 'react';
import { List, Stack, Title } from '@mantine/core';
import useParsons from '../../hooks/useParsons';

const ActionPlan = () => {
  const { getUsedParsonsFragments } = useParsons();

  return (
    <Stack>
      <Title order={4}>My Action Plan:</Title>
      <List type='ordered' listStyleType='disc'>
        {getUsedParsonsFragments().map((fragment) => (
          <List.Item key={fragment.listItem.id}>
            {fragment.listItem.action}
          </List.Item>
        ))}
      </List>
    </Stack>
  );
};

export default ActionPlan;
