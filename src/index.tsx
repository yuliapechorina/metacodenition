import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { MantineProvider } from '@mantine/core';
import App from './App';
import theme from './theme';
import { CodeProvider } from './context/CodeContext';
import { NotificationProvider } from './context/NotificationContext';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <CodeProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </CodeProvider>
    </MantineProvider>
  </React.StrictMode>
);
