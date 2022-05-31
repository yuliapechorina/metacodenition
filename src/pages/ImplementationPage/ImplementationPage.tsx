import Split from 'react-split';
import CodeEditor from '../../components/CodeEditor';
import CodeRunArea from '../../components/CodeRunArea';

const ImplementationPage = () => (
  <Split className='split h-full' direction='vertical'>
    <CodeEditor className='h-full' />
    <CodeRunArea className='p-4 pb-12 bg-slate-300' />
  </Split>
);

export default ImplementationPage;
