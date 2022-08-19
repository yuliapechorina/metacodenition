import {
  Card,
  Group,
  Stack,
  Title,
  ScrollArea,
  Center,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { HiCheck } from 'react-icons/hi';
import GenericButton from '../../components/generics/GenericButton';
import ProblemPopover from '../../components/ProblemPopover';
import useParsons from '../../hooks/useParsons';

const EvaluationPage = () => {
  const [isProblemOpened, setProblemOpened] = useState(false);

  const {
    submitParsons,
    isLoading,
    getUnusedListItems,
    setUnusedListItems,
    getUnusedParsonsFragments,
    getUsedListItems,
    setUsedListItems,
    getUsedParsonsFragments,
  } = useParsons();

  const [submitted, setSubmitted] = useState(false);

  const handleClickSubmit = () => {
    submitParsons();
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Stack className='h-full p-0 z-10 relative'>
      <ScrollArea>
        <Group className='justify-between p-2 align-top flex-nowrap'>
          <Text className='p-2'>
            <Text inherit component='span' className='font-bold'>
              Task:{' '}
            </Text>
            Design your solution by dragging and dropping blocks to the design
            area on the right. <br />
            You can add your own blocks on the previous page.
          </Text>
          <ProblemPopover
            className='pr-4'
            opened={isProblemOpened}
            setOpened={setProblemOpened}
          />
        </Group>
        <Group className='items-start pb-32 bg-gray-100 shadow-inner mx-4 rounded-lg'>
          <Stack spacing={0} className='grow min-h-[32rem]'>
            <Title order={4} className='text-center py-4 '>
              Drag from here
            </Title>
            <ReactSortable
              list={getUnusedListItems!()}
              setList={setUnusedListItems}
              group='design-parsons'
              animation={100}
              className='flex flex-col space-y-4 grow pl-8 pr-2'
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
          <Stack spacing={0} className='grow min-h-[32rem]'>
            <Title order={4} className='py-4 text-center'>
              Design your solution here
            </Title>
            <ReactSortable
              list={getUsedListItems!()}
              setList={setUsedListItems}
              group='design-parsons'
              animation={100}
              className='flex flex-col space-y-4 grow pl-2 pr-8'
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
      <Center className='absolute bottom-0 w-full p-4 backdrop-blur-sm bg-white/60 border-t-gray-200 border-t-[1px]'>
        <GenericButton
          text='Submit'
          className='drop-shadow-md'
          onClick={handleClickSubmit}
          loading={isLoading}
          leftIcon={submitted && !isLoading && <HiCheck size={20} />}
        />
      </Center>
    </Stack>
  );
};

export default EvaluationPage;
