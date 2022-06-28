import { Button, Card, Group, Stack, Title, Notification } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import useParsons from '../../context/ParsonsContext';

const EvaluationPage = () => {
  const [errorNotificationVisible, setErrorNotificationVisible] =
    useState(false);
  const [errorNotificationDismissed, setErrorNotifcationDismissed] =
    useState(false);

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
    <Stack className='h-full pt-8 pb-16 overflow-auto'>
      <Group className='h-fit overflow-auto'>
        <Stack className='h-full flex-1'>
          <Title className='text-center'>Drag from here</Title>
          <ReactSortable
            list={getUnusedListItems!()}
            setList={setUnusedListItems}
            group='design-parsons'
            animation={100}
            className='flex flex-col space-y-6 h-full p-4 m-4 rounded-md'
          >
            {getUnusedParsonsFragments!().map((fragment) => (
              <div key={fragment.listItem.id}>
                <Card
                  shadow='sm'
                  p='md'
                  className={`bg-gray-100 cursor-grab h-fit${
                    fragment.userGenerated && ' font-bold'
                  }`}
                >
                  {fragment.listItem.action}
                </Card>
              </div>
            ))}
          </ReactSortable>
        </Stack>
        <Stack className='h-full flex-1'>
          <Title className='text-center'>Drop in here</Title>
          <ReactSortable
            list={getUsedListItems!()}
            setList={setUsedListItems}
            group='design-parsons'
            animation={100}
            className='flex flex-col space-y-6 h-full p-4 m-4 rounded-md'
          >
            {getUsedParsonsFragments!().map((fragment) => (
              <div key={fragment.listItem.id}>
                <Card
                  shadow='sm'
                  p='md'
                  className={`bg-gray-100 cursor-grab h-fit${
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
      <Button
        size='md'
        className='bg-emerald-500 fill-emerald-50 hover:bg-emerald-600 m-auto flex-shrink-0'
        onClick={() => submitParsons!()}
        disabled={isLoading}
      >
        Submit
      </Button>
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
