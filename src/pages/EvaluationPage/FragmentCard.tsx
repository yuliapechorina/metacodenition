import { Card, Group, Tooltip, UnstyledButton } from '@mantine/core';
import { HiLink, HiPencil } from 'react-icons/hi';
import { ItemInterface } from 'react-sortablejs';
import { ParsonsFragment } from '../../hooks/useParsons';

const FragmentCard = ({
  fragment,
  edit,
}: {
  fragment: ParsonsFragment;
  edit: (listItem: ItemInterface) => void;
}) => (
  <Card
    shadow='sm'
    radius='md'
    p='md'
    className='bg-white cursor-grab h-fit min-w-0'
  >
    <Group position='apart'>
      {fragment.userGenerated ? (
        <Group className=' space-x-0 gap-2'>
          <Tooltip label='This action is linked to a highlight'>
            <HiLink />
          </Tooltip>
          {fragment.listItem.action}
        </Group>
      ) : (
        fragment.listItem.action
      )}

      <UnstyledButton
        onClick={() => edit(fragment.listItem)}
        className='hover:bg-gray-100 p-2 rounded-md'
      >
        <HiPencil />
      </UnstyledButton>
    </Group>
  </Card>
);

export default FragmentCard;
