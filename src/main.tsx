import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SystemDataProvider } from './context/SystemDataContext';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SystemDataProvider>
        <App />
      </SystemDataProvider>
    </AuthProvider>
  </React.StrictMode>
);
