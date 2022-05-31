import { Stack } from '@mantine/core';
import CodeEditor from '../../components/CodeEditor';
import InputArea from '../../components/InputArea';
import OutputArea from '../../components/OutputArea';

const ImplementationPage = () => (
  <Stack className='h-full'>
    <CodeEditor className='h-48 flex-auto' />
    <Stack className='p-4 pb-12 fit-content bg-slate-300'>
      <InputArea />
      <OutputArea />
    </Stack>
  </Stack>
);

export default ImplementationPage;
