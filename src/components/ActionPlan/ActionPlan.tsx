import React from 'react';
import { List, Stack, Text, Title } from '@mantine/core';
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
        {getUsedParsonsFragments().length === 0 && (
          <Text>You haven&apos;t created an action plan yet!</Text>
        )}
      </List>
    </Stack>
  );
};

export default ActionPlan;
