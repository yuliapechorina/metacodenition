import { useCallback, useMemo } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ApplicationShell from './pages/ApplicationShell';
import AuthRoute from './components/AuthRoute';
import ProblemPage from './pages/ProblemPage';
import ImplementationPage from './pages/ImplementationPage';
import DesignPage from './pages/DesignPage';
import EvaluationPage from './pages/EvaluationPage';
import TestCasePage from './pages/TestCasePage';
import HomePage from './pages/HomePage';
import InvalidEmailPage from './pages/InvalidEmailPage';
import EntryPage from './pages/EntryPage';
import AssignmentSubmit from './pages/AssignmentSubmit';
import useInterventions from './hooks/useInterventions';
import PageNotFound from './pages/PageNotFound';
import FirebaseAnalytics from './components/FirebaseAnalytics';

const App = () => {
  const { interventions } = useInterventions();

  const isInterventionEnabled = useCallback(
    (name: string) =>
      interventions.find((intervention) => intervention.name === name)?.enabled,
    [interventions]
  );

  const problemRouteEnabled = useMemo(
    () => isInterventionEnabled('Understanding the problem'),
    [isInterventionEnabled]
  );
  const designRouteEnabled = useMemo(
    () => isInterventionEnabled('Designing a solution'),
    [isInterventionEnabled]
  );
  const evaluationRouteEnabled = useMemo(
    () => isInterventionEnabled('Evaluating a solution'),
    [isInterventionEnabled]
  );
  const testCaseRouteEnabled = useMemo(
    () => isInterventionEnabled('Evaluating implemented solution'),
    [isInterventionEnabled]
  );

  const assignmentRedirectRoute = useMemo(() => {
    if (isInterventionEnabled('Understanding the problem')) return 'problem';
    if (isInterventionEnabled('Designing a solution')) return 'design';
    if (isInterventionEnabled('Evaluating a solution')) return 'evaluation';
    if (isInterventionEnabled('Evaluating implemented solution'))
      return 'test-cases';
    return 'implementation';
  }, [isInterventionEnabled]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ApplicationShell />}>
          <Route index element={<HomePage />} />
          <Route path='entry' element={<EntryPage />} />
          <Route path='submit' element={<AssignmentSubmit />} />
          <Route path='/assignment' element={<AuthRoute />}>
            <Route index element={<Navigate to={assignmentRedirectRoute} />} />
            {problemRouteEnabled && (
              <Route path='problem' element={<ProblemPage />} />
            )}
            {designRouteEnabled && (
              <Route path='design' element={<DesignPage />} />
            )}
            {evaluationRouteEnabled && (
              <Route path='evaluation' element={<EvaluationPage />} />
            )}
            <Route path='implementation' element={<ImplementationPage />} />
            {testCaseRouteEnabled && (
              <Route path='test-cases' element={<TestCasePage />} />
            )}
            <Route
              path='*'
              element={<Navigate to={assignmentRedirectRoute} />}
            />
          </Route>
          <Route path='/invalid-email' element={<InvalidEmailPage />} />
          <Route path='*' element={<PageNotFound />} />
        </Route>
      </Routes>
      <FirebaseAnalytics />
    </BrowserRouter>
  );
};

export default App;
