import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  Notification,
  ScrollArea,
  Center,
  Text,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import ProblemPopover from '../../components/ProblemPopover';
import useParsons from '../../hooks/useParsons';

const EvaluationPage = () => {
  const [errorNotificationVisible, setErrorNotificationVisible] =
    useState(false);
  const [errorNotificationDismissed, setErrorNotifcationDismissed] =
    useState(false);
  const [isProblemOpened, setProblemOpened] = useState(false);

  const {
    submitParsons,
    isError,
    isLoading,
    getUnusedListItems,
    setUnusedListItems,
    getUnusedParsonsFragments,
    getUsedListItems,
    setUsedListItems,
    getUsedParsonsFragments,
  } = useParsons();

  useEffect(() => {
    if (isError) {
      setErrorNotificationVisible(true);
    }

    if (errorNotificationDismissed) {
      setErrorNotificationVisible(false);
    }
  }, [isError, errorNotificationDismissed]);

  return (
    <Stack className='h-full p-0 bg-gray-100 z-10 relative'>
      <ScrollArea>
        <Group className='justify-between p-2'>
          <Text className='p-2'>
            Task: Design your program by dragging and dropping lines to the
            right.
          </Text>
          <ProblemPopover
            className='pr-4'
            opened={isProblemOpened}
            setOpened={setProblemOpened}
          />
        </Group>
        <Group className='items-start pb-32'>
          <Stack spacing={0} className='h-full flex-1'>
            <Title order={2} className='text-center my-2'>
              Drag from here
            </Title>
            <ReactSortable
              list={getUnusedListItems!()}
              setList={setUnusedListItems}
              group='design-parsons'
              animation={100}
              className='flex flex-col space-y-4 h-full px-4 mx-4'
            >
              {getUnusedParsonsFragments!().map((fragment) => (
                <div key={fragment.listItem.id}>
                  <Card
                    shadow='sm'
                    radius='md'
                    p='md'
                    className={`bg-white cursor-grab h-fit ${
                      fragment.userGenerated && ' font-bold'
                    }`}
                  >
                    {fragment.listItem.action}
                  </Card>
                </div>
              ))}
            </ReactSortable>
          </Stack>
          <Stack spacing={0} className='h-full flex-1 space-y-0'>
            <Title order={2} className='my-2 text-center'>
              Drop in here
            </Title>
            <ReactSortable
              list={getUsedListItems!()}
              setList={setUsedListItems}
              group='design-parsons'
              animation={100}
              className='flex flex-col space-y-4 h-full px-4 mx-4'
            >
              {getUsedParsonsFragments!().map((fragment) => (
                <div key={fragment.listItem.id}>
                  <Card
                    shadow='sm'
                    radius='md'
                    p='md'
                    className={`bg-white cursor-grab h-fit${
                      fragment.userGenerated && ' font-bold'
                    }`}
                  >
                    {fragment.listItem.action}
                  </Card>
                </div>
              ))}
            </ReactSortable>
          </Stack>
        </Group>
      </ScrollArea>
      <Center className='absolute bottom-0 w-full p-4 -translate-y-1/2 backdrop-blur-sm bg-white/60 border-t-gray-200 border-t-[1px]'>
        <Button
          size='md'
          className='bg-emerald-500 fill-emerald-50 hover:bg-emerald-600 drop-shadow-md'
          onClick={() => submitParsons!()}
          disabled={isLoading}
        >
          Submit
        </Button>
      </Center>
      {errorNotificationVisible && (
        <Notification
          title='Failed to submit action'
          color='red'
          onClose={() => setErrorNotifcationDismissed(true)}
        >
          Please try again.
        </Notification>
      )}
    </Stack>
  );
};

export default EvaluationPage;
