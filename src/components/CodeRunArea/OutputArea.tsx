import { Code, LoadingOverlay, Stack, Text } from '@mantine/core';

type OutputAreaProps = {
  loading: boolean;
  text: string;
};

const OutputArea = (props: OutputAreaProps) => {
  const { loading, text } = props;

  return (
    <Stack className='h-full'>
      <LoadingOverlay visible={loading} />
      <Text className='text-lg font-bold'>Output</Text>
      <Code className='text-base min-h-20 bg-gray-100 p-4 rounded-md fit-content whitespace-pre'>
        {text}
      </Code>
    </Stack>
  );
};

export default OutputArea;
