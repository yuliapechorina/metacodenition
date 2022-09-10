import {
  Card,
  Group,
  TextInput,
  UnstyledButton,
  Center,
  Button,
} from '@mantine/core';
import { HiTrash, HiCheck, HiX } from 'react-icons/hi';
import { ItemInterface } from 'react-sortablejs';

const EditFragmentCard = ({
  editAction,
  setEditAction,
  handleDeleteAction,
  handleUpdateAction,
  handleCancelAction,
}: {
  editAction: ItemInterface;
  setEditAction: (action: ItemInterface) => void;
  handleDeleteAction: () => void;
  handleUpdateAction: () => void;
  handleCancelAction: () => void;
}) => (
  <>
    <Card
      shadow='sm'
      radius='md'
      p='md'
      className='bg-white cursor-grab h-fit min-w-0'
    >
      <Group position='apart'>
        <TextInput
          value={editAction.action}
          onChange={(e) =>
            setEditAction({
              ...editAction,
              action: e.currentTarget.value,
            })
          }
          placeholder='Describe your action'
          className='grow'
        />
        <UnstyledButton
          onClick={() => handleDeleteAction()}
          className='hover:bg-gray-100 p-2 rounded-md'
        >
          <HiTrash />
        </UnstyledButton>
      </Group>
    </Card>
    <Center className='space-x-4 mt-4'>
      <Button
        size='sm'
        className='bg-emerald-500 fill-green-50 hover:bg-emerald-600'
        onClick={handleUpdateAction}
      >
        <HiCheck />
      </Button>
      <Button
        size='sm'
        className='bg-rose-500 fill-red-50 hover:bg-rose-600'
        onClick={handleCancelAction}
      >
        <HiX />
      </Button>
    </Center>
  </>
);

export default EditFragmentCard;
