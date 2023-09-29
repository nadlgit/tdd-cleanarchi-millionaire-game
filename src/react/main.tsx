import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { AppStoreProvider } from './store/app-store-provider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppStoreProvider>
      <App />
    </AppStoreProvider>
  </React.StrictMode>
);
