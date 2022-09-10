import { Center, UnstyledButton, Text } from '@mantine/core';
import { HiPlus } from 'react-icons/hi';

const AddActionButton = ({
  handleAddAction,
}: {
  handleAddAction: () => void;
}) => (
  <Center>
    <UnstyledButton
      onClick={() => handleAddAction()}
      className='hover:bg-gray-200 inline-flex items-center p-3 text-sm space-x-1 rounded-md'
    >
      <Text size='sm'>Add a new action</Text>
      <HiPlus />
    </UnstyledButton>
  </Center>
);

export default AddActionButton;
