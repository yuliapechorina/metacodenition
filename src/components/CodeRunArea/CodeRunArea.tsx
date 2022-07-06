import { Notification, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { submitRun } from '../../api/codeRunner.api';
import useCode from '../../context/CodeContext';
import InputArea from './InputArea';
import OutputArea from './OutputArea';

type CodeRunAreaProps = {
  className?: string;
};

const CodeRunArea = (props: CodeRunAreaProps) => {
  const { className } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const { file } = useCode();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorNotificationVisible, setErrorNotificationVisible] =
    useState(false);
  const [errorNotificationDismissed, setErrorNotifcationDismissed] =
    useState(false);
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    if (isError) {
      setErrorNotificationVisible(true);
    }
    if (errorNotificationDismissed) {
      setErrorNotificationVisible(false);
    }
  }, [isError, errorNotificationDismissed]);

  const run = () => {
    setLoading(true);
    const runCode = async () => {
      try {
        const result = await submitRun({
          run_spec: {
            language_id: 'c',
            sourcefilename: 'test.c',
            sourcecode: file!.content,
          },
        });
        setOutput(result.stdout);
        setIsError(false);
      } catch (error: any) {
        setIsError(true);
        setErrorNotifcationDismissed(false);
      }
    };
    runCode();
    setLoading(false);
  };
  return (
    <Stack className={className}>
      <InputArea loading={loading} runCallback={run} />
      <OutputArea loading={loading} text={output} />
      {errorNotificationVisible && (
        <Notification
          title='Failed to run code'
          color='red'
          className='fixed top-0 right-0 m-4 max-w-md'
          onClose={() => setErrorNotifcationDismissed(true)}
        >
          Please try again.
        </Notification>
      )}
    </Stack>
  );
};

CodeRunArea.defaultProps = { className: '' };

export default CodeRunArea;
