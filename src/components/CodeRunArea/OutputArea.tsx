import { Code, LoadingOverlay, Stack, Text } from '@mantine/core';

type OutputAreaProps = {
  loading: boolean;
  text: string;
};

const OutputArea = (props: OutputAreaProps) => {
  const { loading, text } = props;

  return (
    <Stack className='h-full pb-10'>
      <LoadingOverlay visible={loading} />
      <Text className='text-lg font-bold'>Output</Text>
      <Code className='min-h-20 bg-gray-100 p-4 rounded-md w-full whitespace-pre-wrap text-sm'>
        {text}
      </Code>
    </Stack>
  );
};

export default OutputArea;
