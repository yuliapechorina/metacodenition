import { UnstyledButton } from '@mantine/core';
import { HiOutlinePencil } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import useAssignment from '../../context/AssignmentContext';

const ChangeAssignmentButton = () => {
  const navigate = useNavigate();
  const { setAssignmentName } = useAssignment();
  const handleClick = () => {
    setAssignmentName!(undefined);
    navigate('choose-assignment');
  };
  return (
    <UnstyledButton className='flex items-center' onClick={() => handleClick()}>
      <HiOutlinePencil size='24px' className='stroke-black hover:scale-110' />
    </UnstyledButton>
  );
};

export default ChangeAssignmentButton;
