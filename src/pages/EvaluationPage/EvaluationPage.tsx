import {
  Card,
  Group,
  Stack,
  Title,
  ScrollArea,
  Center,
  Text,
  UnstyledButton,
  TextInput,
  Button,
  Tooltip,
} from '@mantine/core';
import { useState } from 'react';
import { ItemInterface, ReactSortable } from 'react-sortablejs';
import {
  HiCheck,
  HiLink,
  HiPencil,
  HiPlus,
  HiTrash,
  HiX,
} from 'react-icons/hi';
import { logEvent } from 'firebase/analytics';
import { v4 as uuidv4 } from 'uuid';
import GenericButton from '../../components/generics/GenericButton';
import useParsons, { ParsonsFragment } from '../../hooks/useParsons';
import useAssignment from '../../context/AssignmentContext';
import { analytics } from '../../util/firebase';
import ProblemModal from '../../components/ProblemModal';
import HelpButton from '../../components/HelpButton';

const EvaluationPage = () => {
  const { unsavedChanges } = useAssignment();

  const [isProblemOpened, setProblemOpened] = useState(false);
  const [editAction, setEditAction] = useState<ItemInterface | null>(null);
  const [isNewAction, setIsNewAction] = useState(false);

  const {
    submitParsons,
    isLoading,
    getUnusedListItems,
    setUnusedListItems,
    getUnusedParsonsFragments,
    getUsedListItems,
    setUsedListItems,
    getUsedParsonsFragments,
    addAction,
    editFragment,
    deleteFragment,
  } = useParsons();

  const handleClickSave = () => {
    submitParsons();
    logEvent(analytics, 'save_parsons');
  };

  const handleRearrange = () => {
    logEvent(analytics, 'rearrange_parsons');
  };

  const handleClickOpenProblem = () => {
    logEvent(analytics, 'open_problem_modal');
    setProblemOpened(!isProblemOpened);
  };

  const handleAddAction = () => {
    setEditAction({ id: uuidv4(), action: '' });
    setIsNewAction(true);
  };

  const handleSaveAction = () => {
    if (editAction) {
      addAction(editAction);
      setEditAction(null);
      setIsNewAction(false);
    }
  };

  const handleCancelAction = () => {
    setEditAction(null);
    setIsNewAction(false);
  };

  const handleStartEditAction = (action: ItemInterface) => {
    setEditAction(action);
    setIsNewAction(false);
  };

  const handleUpdateAction = () => {
    if (editAction && editAction.action) {
      editFragment({ listItem: editAction });
      setEditAction(null);
      setIsNewAction(false);
    }
  };

  const handleDeleteAction = () => {
    if (editAction) {
      deleteFragment({ listItem: editAction });
      setEditAction(null);
      setIsNewAction(false);
    }
  };

  const renderFragment = (fragment: ParsonsFragment) => (
    <div key={fragment.listItem.id}>
      {editAction && !isNewAction && editAction.id === fragment.listItem.id ? (
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
      ) : (
        <Card
          shadow='sm'
          radius='md'
          p='md'
          className='bg-white cursor-grab h-fit min-w-0'
        >
          <Group position='apart'>
            {fragment.userGenerated ? (
              <Tooltip label='This action is linked to a highlight'>
                <Group className=' space-x-0 gap-2'>
                  <HiLink /> {fragment.listItem.action}
                </Group>
              </Tooltip>
            ) : (
              fragment.listItem.action
            )}

            <UnstyledButton
              onClick={() => handleStartEditAction(fragment.listItem)}
              className='hover:bg-gray-100 p-2 rounded-md'
            >
              <HiPencil />
            </UnstyledButton>
          </Group>
        </Card>
      )}
    </div>
  );

  return (
    <>
      <Stack className='h-full p-0 z-10 relative'>
        <ScrollArea>
          <Group className='justify-between p-2 flex-nowrap items-start'>
            <Text className='p-2'>
              <Text inherit component='span' className='font-bold'>
                Task:{' '}
              </Text>
              Create an action plan by dragging and dropping actions to &quot;My
              Action Plan&quot; on the right.
              <br />
              You do not have to use all your actions to form your plan, and you
              can add new actions on the left.
            </Text>
            <HelpButton onClick={handleClickOpenProblem} className='m-2' />
          </Group>
          <Group className='items-start pb-32 flex-nowrap bg-gray-100 shadow-inner mx-4 rounded-lg'>
            <Stack spacing={0} className='grow min-h-[32rem] w-1/2'>
              <Title order={4} className='text-center py-4 '>
                My Actions
              </Title>
              <ReactSortable
                list={getUnusedListItems!()}
                setList={setUnusedListItems}
                group='design-parsons'
                animation={100}
                className='flex flex-col space-y-4 grow pl-8 pr-2'
              >
                {getUnusedParsonsFragments!().map((fragment) =>
                  renderFragment(fragment)
                )}
                {editAction && isNewAction ? (
                  <div key={editAction.id}>
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
                  </div>
                ) : (
                  <Center>
                    <UnstyledButton
                      onClick={() => handleAddAction()}
                      className='hover:bg-gray-100 inline-flex items-center p-3 text-sm space-x-1 rounded-md'
                    >
                      <Text size='sm'>Add a new action</Text>
                      <HiPlus />
                    </UnstyledButton>
                  </Center>
                )}
              </ReactSortable>
            </Stack>
            <Stack spacing={0} className='grow min-h-[32rem] w-1/2'>
              <Title order={4} className='py-4 text-center'>
                My Action Plan
              </Title>
              <ReactSortable
                list={getUsedListItems!()}
                setList={setUsedListItems}
                group='design-parsons'
                animation={100}
                className='flex flex-col space-y-4 grow pl-2 pr-8'
                onAdd={handleRearrange}
                onEnd={handleRearrange}
              >
                {getUsedParsonsFragments!().map((fragment) =>
                  renderFragment(fragment)
                )}
              </ReactSortable>
            </Stack>
          </Group>
        </ScrollArea>
        <Center className='absolute bottom-0 w-full p-4 backdrop-blur-sm bg-white/60 border-t-gray-200 border-t-[1px]'>
          <GenericButton
            text={`Save${unsavedChanges ? '' : 'd'}`}
            className='drop-shadow-md'
            onClick={handleClickSave}
            loading={isLoading}
            disabled={isLoading || !unsavedChanges}
            leftIcon={!unsavedChanges && !isLoading && <HiCheck size={20} />}
          />
        </Center>
      </Stack>
      <ProblemModal opened={isProblemOpened} setOpened={setProblemOpened} />
    </>
  );
};

export default EvaluationPage;
