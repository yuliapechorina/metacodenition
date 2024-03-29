import { Stack, Text } from '@mantine/core';
import { logEvent } from 'firebase/analytics';
import { useState } from 'react';
import { submitRun } from '../../api/codeRunner.api';
import useAssignment from '../../context/AssignmentContext';
import useCode from '../../context/CodeContext';
import useNotifications from '../../context/NotificationContext';
import useUser from '../../hooks/useUser';
import { analytics } from '../../util/firebase';
import { IArgument } from '../../util/testcase';
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
  const { questionNumber } = useAssignment();
  const { upi, userGroup } = useUser();

  const run = (args: IArgument[]) => {
    logEvent(analytics, 'run_code', {
      question_number: questionNumber,
      user_upi: upi,
      user_testing_group: userGroup,
      my_timestamp: new Date(Date.now()).toISOString(),
    });

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
      <InputArea loading={loading} runCallback={run} />
      <OutputArea loading={loading} text={output} />
    </Stack>
  );
};

CodeRunArea.defaultProps = { className: '' };

export default CodeRunArea;
