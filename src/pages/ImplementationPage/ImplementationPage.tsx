import Split from 'react-split';
import CodeEditor from '../../components/CodeEditor';
import CodeRunArea from '../../components/CodeRunArea';

const ImplementationPage = () => (
  <Split className='split h-full' direction='vertical' sizes={[75, 25]}>
    <CodeEditor className='h-full' />
    <CodeRunArea className='p-4 bg-gray-300 relative' />
  </Split>
);

export default ImplementationPage;
