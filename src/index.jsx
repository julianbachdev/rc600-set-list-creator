import AppProviders from './contexts/AppProviders.js';
import { createRoot } from 'react-dom/client';
import * as React from 'react';
import App from './App.jsx';

const root = createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
