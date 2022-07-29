import { AppShell, Group, Header, Text } from '@mantine/core';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ReactComponent as TitleIcon } from './title.svg';
import { auth } from '../../util/firebase';
import AppNotifications from '../../components/AppNotifications';
import NavBar from '../../components/NavBar';
import LogOutButton from '../../components/LogOutButton';
import useAssignment from '../../context/AssignmentContext';
import ChangeAssignmentButton from '../../components/ChangeAssignmentButton';

const ApplicationShell = () => {
  const location = useLocation();
  const [user] = useAuthState(auth);
  const { assignmentName, questionNumber, questionsLength } = useAssignment();

  return (
    <>
      <AppNotifications />
      <AppShell
        header={
          <Header height={40} className='p-3'>
            <Group position='apart'>
              <TitleIcon />
              <Group>
                {questionNumber && questionsLength && (
                  <Text>
                    Question {questionNumber}/{questionsLength}
                  </Text>
                )}
                {assignmentName && <Text>{assignmentName}</Text>}
                {user && assignmentName && <ChangeAssignmentButton />}
                <Text>{user?.displayName}</Text>
                {user && <LogOutButton />}
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
