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
import AssignmentPage from './pages/AssignmentPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<ApplicationShell />}>
        <Route index element={<HomePage />} />
        <Route path='choose-assignment' element={<AssignmentPage />} />
        <Route path='/assignment' element={<AuthRoute />}>
          <Route index element={<Navigate to='problem' />} />
          <Route path='problem' element={<ProblemPage />} />
          <Route path='design' element={<DesignPage />} />
          <Route path='evaluation' element={<EvaluationPage />} />
          <Route path='implementation' element={<ImplementationPage />} />
          <Route path='test-cases' element={<TestCasePage />} />
        </Route>
        <Route path='/invalid-email' element={<InvalidEmailPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
