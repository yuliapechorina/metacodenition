import { Code, LoadingOverlay, Stack, Text } from '@mantine/core';

type OutputAreaProps = {
  loading: boolean;
  text: string;
};

const OutputArea = (props: OutputAreaProps) => {
  const { loading, text } = props;

  return (
    <Stack className='h-full pb-12'>
      <LoadingOverlay visible={loading} />
      <Text className='text-lg'>Output</Text>
      <Code className='text-base bg-gray-100 p-4 rounded-md overflow-y-auto overflow-x-hidden fit-content mb-14'>
        {text}
      </Code>
    </Stack>
  );
};

export default OutputArea;
