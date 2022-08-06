import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { MantineProvider } from '@mantine/core';
import App from './App';
import theme from './theme';
import { CodeProvider } from './context/CodeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AssignmentProvider } from './context/AssignmentContext';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <AssignmentProvider>
        <CodeProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </CodeProvider>
      </AssignmentProvider>
    </MantineProvider>
  </React.StrictMode>
);
