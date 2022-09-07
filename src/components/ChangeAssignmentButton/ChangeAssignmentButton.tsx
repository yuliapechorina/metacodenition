import { Tooltip, UnstyledButton } from '@mantine/core';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import useAssignment from '../../context/AssignmentContext';

const ChangeAssignmentButton = () => {
  const navigate = useNavigate();
  const { setAssignmentName } = useAssignment();
  const handleClick = () => {
    setAssignmentName!(undefined);
    navigate('assignment');
  };
  return (
    <Tooltip label='Change assignment' position='bottom'>
      <UnstyledButton
        className='flex items-center'
        onClick={() => handleClick()}
      >
        <HiOutlinePencilAlt
          size='24px'
          className='stroke-black hover:scale-110'
        />
      </UnstyledButton>
    </Tooltip>
  );
};

export default ChangeAssignmentButton;
