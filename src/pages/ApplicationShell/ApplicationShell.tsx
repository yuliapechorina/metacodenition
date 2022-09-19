import { AppShell, Group, Header, Text } from '@mantine/core';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ReactComponent as TitleIcon } from './title.svg';
import { auth } from '../../util/firebase';
import AppNotifications from '../../components/AppNotifications';
import NavBar from '../../components/NavBar';
import LogOutButton from '../../components/LogOutButton';
import useAssignment from '../../context/AssignmentContext';
import ChangeAssignmentButton from '../../components/ChangeAssignmentButton';
import SettingsButton from '../../components/SettingsButton';
import useInterventions from '../../hooks/useInterventions';
import useUser from '../../hooks/useUser';

const ApplicationShell = () => {
  const {
    assignmentComplete,
    assignmentName,
    questionNumber,
    questionsLength,
  } = useAssignment();
  const location = useLocation();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { interventions } = useInterventions();
  const { userData } = useUser();

  useEffect(() => {
    if (assignmentComplete && assignmentName) navigate('/submit');
  }, [assignmentComplete, assignmentName]);

  useEffect(() => {
    if (
      !(questionNumber === questionsLength) &&
      location.pathname.startsWith('/assignment/')
    )
      navigate('/assignment');
  }, [interventions]);

  return (
    <>
      <AppNotifications />
      <AppShell
        header={
          <Header height={40} className='p-3 flex'>
            <Group position='apart' className='self-center w-full'>
              <TitleIcon />
              <Group className='space-x-8'>
                {questionNumber && questionsLength && !assignmentComplete && (
                  <Text size='lg'>
                    Question {questionNumber}/{questionsLength}
                  </Text>
                )}
                <Group>
                  {assignmentName && <Text size='lg'>{assignmentName}</Text>}
                  {user && assignmentName && <ChangeAssignmentButton />}
                </Group>
                <Group>
                  <Text size='lg'>{userData?.name}</Text>
                  {user && <LogOutButton />}
                  {questionNumber === 3 && !assignmentComplete && (
                    <SettingsButton />
                  )}
                </Group>
              </Group>
            </Group>
          </Header>
        }
        navbar={
          location.pathname.startsWith('/assignment') ? <NavBar /> : undefined
        }
        classNames={{
          root: 'h-screen w-screen flex flex-col overflow-hidden',
          body: 'h-[calc(100%-40px)] min-h-0 w-screen flex flex-row flex-shrink',
          main: 'flex-auto p-0 w-48',
        }}
      >
        <Outlet />
      </AppShell>
    </>
  );
};
export default ApplicationShell;
