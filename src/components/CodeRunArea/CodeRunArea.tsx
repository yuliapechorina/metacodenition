import { Stack, Text } from '@mantine/core';
import { logEvent } from 'firebase/analytics';
import { ChangeEvent, useState } from 'react';
import { submitRun } from '../../api/codeRunner.api';
import useCode from '../../context/CodeContext';
import useNotifications from '../../context/NotificationContext';
import { analytics } from '../../util/firebase';
import InputArea from './InputArea';
import OutputArea from './OutputArea';

type CodeRunAreaProps = {
  className?: string;
};

const CodeRunArea = (props: CodeRunAreaProps) => {
  const { className } = props;
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const { getRunFile } = useCode();
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const run = () => {
    logEvent(analytics, 'run_code');

    const runCode = async () => {
      setLoading(true);
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
      } catch (error: any) {
        addNotification!({
          type: 'failure',
          content: (
            <Text>
              Encountered error when running code.
              <br />
              Please try again.
            </Text>
          ),
        });
      }
      setLoading(false);
    };
    runCode();
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
    </Stack>
  );
};

CodeRunArea.defaultProps = { className: '' };

export default CodeRunArea;
