import { Button, Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';

const OutputArea = () => {
  const sampleText: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere ex eget neque rutrum interdum. Aliquam id erat vel justo rhoncus ultricies vitae at purus. Vivamus dui eros, congue et suscipit ut, semper in diam. Cras in justo odio. Aenean feugiat fermentum nisi et vestibulum. Mauris pulvinar accumsan faucibus. Integer dignissim odio at sapien elementum pharetra. In hac habitasse platea dictumst. Phasellus consectetur ligula mi, dignissim sodales arcu cursus vel. Curabitur posuere, orci at dignissim mollis, neque ipsum volutpat mauris, ut interdum magna dolor a sapien. Nullam ultricies est id odio vulputate, ut vulputate dolor rutrum. Donec eleifend vulputate mi, sit amet faucibus ligula.';
  const [output] = useState(sampleText.repeat(10));
  const [expanded, setExpanded] = useState(false);
  return (
    <Stack className='h-full pb-4'>
      <Group>
        <Text className='grow text-lg'>Output</Text>
        <Button
          className='hover:bg-transparent text-3xl hover:scale-150'
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '⬆️' : '⬇️'}
        </Button>
      </Group>
      <Text
        className={`text-base bg-slate-100 p-4 rounded-md ${
          expanded ? 'overflow-y-scroll h-full min-h-[50px] mb-28' : 'truncate'
        }`}
      >
        {output}
      </Text>
    </Stack>
  );
};

export default OutputArea;
