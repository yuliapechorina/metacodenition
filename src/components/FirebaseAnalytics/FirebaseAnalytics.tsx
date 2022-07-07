import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAnalytics, logEvent } from 'firebase/analytics';

const pageNames = new Map([
  ['/assignment/step-1', 'Understanding the problem'],
  ['/assignment/step-2', 'Searching for similar problems'],
  ['/assignment/step-3', 'Designing a solution'],
  ['/assignment/step-4', 'Evaluating a solution'],
  ['/assignment/step-5', 'Implementing a solution'],
  ['/assignment/step-6', 'Evaluating a potential solution'],
]);

const FirebaseAnalytics = () => {
  const location = useLocation();
  const analytics = getAnalytics();

  useEffect(() => {
    if (
      location.pathname !== '/login' &&
      location.pathname !== '/' &&
      location.pathname !== '/assignment'
    ) {
      logEvent(analytics, 'page_view', {
        page_path: location.pathname,
        page_title: pageNames.get(location.pathname),
      });
    }
  }, [location]);
  return null;
};

export default FirebaseAnalytics;
