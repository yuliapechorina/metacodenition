import { Navbar } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import useAssignment from '../../context/AssignmentContext';
import useCode from '../../context/CodeContext';
import useQuestion from '../../hooks/useQuestion';
import GenericButton from '../generics/GenericButton';
import MainLinks from '../MainLinks';

const NavBar = () => {
  const { setNextQuestion } = useAssignment();
  const { isLoading, updateUserQuestionDocument } = useQuestion();
  const navigate = useNavigate();
  const { file } = useCode();

  const handleSubmitButtonPress = async () => {
    updateUserQuestionDocument({ submitted: true, userCode: file });
    setNextQuestion!();
    navigate('/assignment');
  };

  return (
    <Navbar className='p-1 w-fit'>
      <Navbar.Section>
        <MainLinks />
      </Navbar.Section>
      <Navbar.Section className='justify-self-end mt-auto pb-4 mx-auto'>
        <GenericButton
          text='Submit'
          onClick={handleSubmitButtonPress}
          disabled={isLoading}
          loading={isLoading}
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default NavBar;
