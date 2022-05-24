import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { MantineProvider } from '@mantine/core';
import App from './App';
import theme from './theme';
import { ProblemProvider } from './context/ProblemContext';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <ProblemProvider>
        <App />
      </ProblemProvider>
    </MantineProvider>
  </React.StrictMode>
);
