import { Code, LoadingOverlay, Stack, Text } from '@mantine/core';
import { useState } from 'react';

type OutputAreaProps = {
  loading: boolean;
};

const OutputArea = (props: OutputAreaProps) => {
  const { loading } = props;
  const sampleText: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere ex eget neque rutrum interdum. Aliquam id erat vel justo rhoncus ultricies vitae at purus. Vivamus dui eros, congue et suscipit ut, semper in diam. Cras in justo odio. Aenean feugiat fermentum nisi et vestibulum. Mauris pulvinar accumsan faucibus. Integer dignissim odio at sapien elementum pharetra. In hac habitasse platea dictumst. Phasellus consectetur ligula mi, dignissim sodales arcu cursus vel. Curabitur posuere, orci at dignissim mollis, neque ipsum volutpat mauris, ut interdum magna dolor a sapien. Nullam ultricies est id odio vulputate, ut vulputate dolor rutrum. Donec eleifend vulputate mi, sit amet faucibus ligula.';
  const [output] = useState(sampleText.repeat(10));
  return (
    <Stack className='h-full pb-12'>
      <LoadingOverlay visible={loading} />
      <Text className='text-lg'>Output</Text>
      <Code className='text-base bg-gray-100 p-4 rounded-md overflow-y-auto overflow-x-hidden fit-content mb-14'>
        {output}
      </Code>
    </Stack>
  );
};

export default OutputArea;
