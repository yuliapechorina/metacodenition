import { Button, Card, Group, Stack, Title } from '@mantine/core';
import { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

type ActionItem = {
  id: number;
  name: string;
};

export const EvaluationPage = () => {
  const [unused, setUnused] = useState<ActionItem[]>([
    { id: 1, name: 'Count Values' },
    { id: 2, name: 'Parse Input' },
    { id: 3, name: 'Map Values' },
    { id: 4, name: 'Call a Function on Each' },
    { id: 5, name: 'Create a Struct' },
    { id: 6, name: 'Filter Values' },
    { id: 7, name: 'Create a Helper Function' },
    { id: 8, name: 'Perform a Calculation' },
    { id: 9, name: 'Print an Output' },
  ]);

  const [used, setUsed] = useState<ActionItem[]>([]);

  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
    console.log(used);
  };

  return (
    <Stack className='h-full pt-8 pb-20'>
      <Group className='h-fit'>
        <Stack className='h-full flex-1'>
          <Title className='text-center'>Drag from here</Title>
          <ReactSortable
            list={unused}
            setList={setUnused}
            group='design-parsons'
            animation={100}
            className='flex flex-col space-y-8 h-full p-4 m-4 rounded-md'
          >
            {unused.map((item) => (
              <div key={item.id}>
                <Card
                  shadow='sm'
                  p='lg'
                  className='bg-gray-100 cursor-grab h-fit'
                >
                  {item.name}
                </Card>
              </div>
            ))}
          </ReactSortable>
        </Stack>
        <Stack className='h-full flex-1'>
          <Title className='text-center'>Drop in here</Title>
          <ReactSortable
            list={used}
            setList={setUsed}
            group='design-parsons'
            animation={100}
            className='flex flex-col space-y-8 h-full p-4 m-4 rounded-md'
          >
            {used.map((item) => (
              <div key={item.id}>
                <Card
                  shadow='sm'
                  p='lg'
                  className='bg-gray-100 cursor-grab h-fit'
                >
                  {item.name}
                </Card>
              </div>
            ))}
          </ReactSortable>
        </Stack>
      </Group>
      <Button
        className='hover:scale-110 w-fit mx-auto bg-green-400 hover:bg-green-300'
        onClick={onSubmit}
        disabled={loading}
      >
        Submit
      </Button>
    </Stack>
  );
};

export default EvaluationPage;
