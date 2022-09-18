import { logEvent } from 'firebase/analytics';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAssignment from '../../context/AssignmentContext';
import { analytics } from '../../util/firebase';

const pageNames = new Map([
  ['/', 'Home page'],
  ['/entry', 'Entry page'],
  ['/assignment/problem', 'Understanding the problem'],
  ['/assignment/design', 'Designing a solution'],
  ['/assignment/evaluation', 'Evaluating a solution'],
  ['/assignment/implementation', 'Implementing a solution'],
  ['/assignment/test-cases', 'Evaluating a potential solution'],
  ['/submit', 'Submission page'],
  ['/invalid-email', 'Invalid email page'],
]);

const FirebaseAnalytics = () => {
  const location = useLocation();
  const { questionNumber } = useAssignment();
  useEffect(() => {
    if (
      location.pathname !== '/login' &&
      location.pathname !== '/' &&
      location.pathname !== '/assignment'
    ) {
      logEvent(analytics, 'page_view', {
        page_path: location.pathname,
        page_title: pageNames.get(location.pathname),
        question_number: questionNumber,
      });
    }
  }, [location]);
  return null;
};

export default FirebaseAnalytics;
