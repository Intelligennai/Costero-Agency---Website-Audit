import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { LoaderIcon } from './components/Icons';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const FullScreenLoader = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-brand-primary flex items-center justify-center">
    <LoaderIcon className="w-12 h-12 animate-spin text-brand-cyan" />
  </div>
);

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<FullScreenLoader />}>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);