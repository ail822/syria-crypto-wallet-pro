
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import { ThemeProvider } from './context/ThemeContext';
import { PlatformProvider } from './context/PlatformContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <PlatformProvider>
        <AuthProvider>
          <TransactionProvider>
            <App />
          </TransactionProvider>
        </AuthProvider>
      </PlatformProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
