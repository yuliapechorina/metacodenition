import { Card, TextInput, Center, Button } from '@mantine/core';
import { HiCheck, HiX } from 'react-icons/hi';
import { ItemInterface } from 'react-sortablejs';

const NewFragmentCard = ({
  editAction,
  setEditAction,
  handleSaveAction,
  handleCancelAction,
}: {
  editAction: ItemInterface;
  setEditAction: (action: ItemInterface) => void;
  handleSaveAction: () => void;
  handleCancelAction: () => void;
}) => (
  <>
    <Card
      shadow='sm'
      radius='md'
      p='md'
      className='bg-white cursor-grab h-fit min-w-0'
    >
      <TextInput
        value={editAction.action}
        onChange={(e) =>
          setEditAction({
            ...editAction,
            action: e.currentTarget.value,
          })
        }
        placeholder='Describe your action'
      />
    </Card>
    <Center className='space-x-4 mt-4'>
      <Button
        size='sm'
        className='bg-emerald-500 fill-green-50 hover:bg-emerald-600'
        onClick={handleSaveAction}
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

export default NewFragmentCard;
