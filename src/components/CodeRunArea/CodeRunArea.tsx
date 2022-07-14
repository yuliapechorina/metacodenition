import { Notification, Stack } from '@mantine/core';
import { ChangeEvent, useEffect, useState } from 'react';
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
  const { getRunFile } = useCode();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorNotificationVisible, setErrorNotificationVisible] =
    useState(false);
  const [errorNotificationDismissed, setErrorNotifcationDismissed] =
    useState(false);
  const [output, setOutput] = useState<string>('');
  const [input, setInput] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

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
            sourcecode: getRunFile!(),
            input,
          },
        });
        setOutput(result.stdout || result.stderr || result.cmpinfo);
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
      <InputArea
        loading={loading}
        value={input}
        onChange={handleInputChange}
        runCallback={run}
      />
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
