import { Notification, Stack } from '@mantine/core';
import { logEvent } from 'firebase/analytics';
import { useEffect, useState } from 'react';
import { submitRun } from '../../api/codeRunner.api';
import useCode from '../../context/CodeContext';
import { analytics } from '../../util/firebase';
import { IArgument } from '../../util/testcase';
import InputArea from './InputArea';
import OutputArea from './OutputArea';

type CodeRunAreaProps = {
  className?: string;
};

const CodeRunArea = (props: CodeRunAreaProps) => {
  const { className } = props;
  const [loading, setLoading] = useState(false);
  const { getRunFile } = useCode();
  const [isError, setIsError] = useState(false);
  const [errorNotificationVisible, setErrorNotificationVisible] =
    useState(false);
  const [errorNotificationDismissed, setErrorNotifcationDismissed] =
    useState(false);
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (isError) {
      setErrorNotificationVisible(true);
    }
    if (errorNotificationDismissed) {
      setErrorNotificationVisible(false);
    }
  }, [isError, errorNotificationDismissed]);

  const run = (args: IArgument[]) => {
    logEvent(analytics, 'run_code');

    const runCode = async () => {
      setLoading(true);
      try {
        const result = await submitRun({
          run_spec: {
            language_id: 'c',
            sourcefilename: 'test.c',
            sourcecode: getRunFile!(args),
            input: '',
          },
        });
        setOutput(result.stdout || result.stderr || result.cmpinfo);
        setIsError(false);
      } catch (error: any) {
        setIsError(true);
        setErrorNotifcationDismissed(false);
      }
      setLoading(false);
    };
    runCode();
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
