import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import AuthRoute from './components/AuthRoute';
import ProblemPage from './pages/ProblemPage';
import ImplementationPage from './pages/ImplementationPage';
import DesignPage from './pages/DesignPage';
import EvaluationPage from './pages/EvaluationPage';
import TestCasePage from './pages/TestCasePage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={<Login />} />
      <Route element={<AuthRoute />}>
        <Route path='/assignment' element={<MainPage />}>
          <Route path='problem' element={<ProblemPage />} />
          <Route path='design' element={<DesignPage />} />
          <Route path='evaluation' element={<EvaluationPage />} />
          <Route path='implementation' element={<ImplementationPage />} />
          <Route path='test-cases' element={<TestCasePage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
