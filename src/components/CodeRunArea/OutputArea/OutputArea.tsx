import {
  Button,
  Code,
  Group,
  LoadingOverlay,
  Stack,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import {
  HiOutlineArrowCircleDown,
  HiOutlineArrowCircleUp,
} from 'react-icons/hi';

type OutputAreaProps = {
  loading: boolean;
};

const OutputArea = (props: OutputAreaProps) => {
  const { loading } = props;
  const sampleText: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere ex eget neque rutrum interdum. Aliquam id erat vel justo rhoncus ultricies vitae at purus. Vivamus dui eros, congue et suscipit ut, semper in diam. Cras in justo odio. Aenean feugiat fermentum nisi et vestibulum. Mauris pulvinar accumsan faucibus. Integer dignissim odio at sapien elementum pharetra. In hac habitasse platea dictumst. Phasellus consectetur ligula mi, dignissim sodales arcu cursus vel. Curabitur posuere, orci at dignissim mollis, neque ipsum volutpat mauris, ut interdum magna dolor a sapien. Nullam ultricies est id odio vulputate, ut vulputate dolor rutrum. Donec eleifend vulputate mi, sit amet faucibus ligula.';
  const [output] = useState(sampleText.repeat(10));
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);
  return (
    <Stack className='h-full pb-12'>
      <LoadingOverlay visible={loading} />
      <Group>
        <Text className='grow text-lg'>Output</Text>
        <Button
          className='hover:bg-transparent hover:scale-150'
          size='lg'
          onClick={toggleExpand}
        >
          {expanded ? (
            <HiOutlineArrowCircleUp
              size={24}
              className='bg-emerald-400 stroke-emerald-800 h-full w-full rounded-md p-0.5'
            />
          ) : (
            <HiOutlineArrowCircleDown
              size={24}
              className='bg-emerald-400 stroke-emerald-800 h-full w-full rounded-md p-0.5'
            />
          )}
        </Button>
      </Group>
      <Code
        className={`text-base bg-slate-100 p-4 rounded-md ${
          expanded
            ? 'overflow-y-auto overflow-x-hidden fit-content min-h-[50px] mb-28'
            : 'truncate'
        }`}
      >
        {output}
      </Code>
    </Stack>
  );
};

export default OutputArea;
