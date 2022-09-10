import Split from 'react-split';
import BottomPanel from '../../components/BottomPanel';
import CodeEditor from '../../components/CodeEditor';

const ImplementationPage = () => (
  <Split className='split h-full' direction='vertical' sizes={[50, 50]}>
    <CodeEditor className='h-full' />
    <BottomPanel />
  </Split>
);

export default ImplementationPage;
