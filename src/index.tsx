import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { MantineProvider } from '@mantine/core';
import App from './App';
import theme from './theme';
import { ProblemProvider } from './context/ProblemContext';
import { CodeProvider } from './context/CodeContext';
import { ParsonsProvider } from './context/ParsonsContext';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <ProblemProvider>
        <ParsonsProvider>
          <CodeProvider>
            <App />
          </CodeProvider>
        </ParsonsProvider>
      </ProblemProvider>
    </MantineProvider>
  </React.StrictMode>
);
