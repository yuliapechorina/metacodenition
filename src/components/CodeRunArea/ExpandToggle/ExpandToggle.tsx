import { Button } from '@mantine/core';

const ExpandToggle = (props: { isExpanded: boolean; callback: () => void }) => {
  const { isExpanded, callback } = props;

  return (
    <Button
      className='hover:bg-transparent text-3xl hover:scale-150'
      onClick={callback}
    >
      {isExpanded ? '⬇️' : '⬆️'}
    </Button>
  );
};

export default ExpandToggle;
