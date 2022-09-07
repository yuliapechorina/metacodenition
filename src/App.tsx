import { useEffect, useState } from 'react';
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
  const [problemRouteEnabled, setProblemRouteEnabled] = useState(true);
  const [designRouteEnabled, setDesignRouteEnabled] = useState(true);
  const [evaluationRouteEnabled, setEvaluationRouteEnabled] = useState(true);
  const [testCaseRouteEnabled, setTestCaseRouteEnabled] = useState(true);
  const [assignmentRedirectRoute, setAssignmentRedirectRoute] =
    useState('problem');

  const isInterventionEnabled = (name: string) =>
    interventions.find((intervention) => intervention.name === name)?.enabled;

  useEffect(() => {
    setProblemRouteEnabled(
      isInterventionEnabled('Understanding the problem') ?? true
    );
    setDesignRouteEnabled(
      isInterventionEnabled('Designing a solution') ?? true
    );
    setEvaluationRouteEnabled(
      isInterventionEnabled('Evaluating a solution') ?? true
    );
    setTestCaseRouteEnabled(
      isInterventionEnabled('Evaluating implemented solution') ?? true
    );
  }, [interventions]);

  useEffect(() => {
    let newRedirectRoute = 'implementation';
    if (problemRouteEnabled) {
      newRedirectRoute = 'problem';
    } else if (designRouteEnabled) {
      newRedirectRoute = 'design';
    } else if (evaluationRouteEnabled) {
      newRedirectRoute = 'evaluation';
    }
    setAssignmentRedirectRoute(newRedirectRoute);
  }, [
    problemRouteEnabled,
    designRouteEnabled,
    evaluationRouteEnabled,
    testCaseRouteEnabled,
  ]);

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
