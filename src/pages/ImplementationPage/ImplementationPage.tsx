import { Stack } from '@mantine/core';
import CodeEditor from '../../components/CodeEditor';
import CodeRunArea from '../../components/CodeRunArea';

const ImplementationPage = () => (
  <Stack className='h-full'>
    <CodeEditor className='h-48 flex-auto' />
    <CodeRunArea className='p-4 pb-12 fit-content bg-slate-300' />
  </Stack>
);

export default ImplementationPage;
