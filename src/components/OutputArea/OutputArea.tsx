import { Button, Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';

const OutputArea = () => {
  const sampleText: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere ex eget neque rutrum interdum. Aliquam id erat vel justo rhoncus ultricies vitae at purus. Vivamus dui eros, congue et suscipit ut, semper in diam. Cras in justo odio. Aenean feugiat fermentum nisi et vestibulum. Mauris pulvinar accumsan faucibus. Integer dignissim odio at sapien elementum pharetra. In hac habitasse platea dictumst. Phasellus consectetur ligula mi, dignissim sodales arcu cursus vel. Curabitur posuere, orci at dignissim mollis, neque ipsum volutpat mauris, ut interdum magna dolor a sapien. Nullam ultricies est id odio vulputate, ut vulputate dolor rutrum. Donec eleifend vulputate mi, sit amet faucibus ligula.';
  const [output] = useState(sampleText);
  const [expanded, setExpanded] = useState(false);
  return (
    <Stack>
      <Group>
        <Text className='grow'>Output</Text>
        <Button
          className='bg-emerald-500 hover:bg-emerald-800 fill-emerald-50'
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide' : 'Show'}
        </Button>
      </Group>
      <Text className={`${expanded ? 'h-100% min-h-24' : 'truncate'}`}>
        {output}
      </Text>
    </Stack>
  );
};

export default OutputArea;
