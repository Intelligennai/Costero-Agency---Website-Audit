import React, { Suspense, lazy } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { LoaderIcon } from './components/Icons';

const Login = lazy(() => import('./components/Login').then(module => ({ default: module.Login })));
const AgencySetup = lazy(() => import('./components/AgencySetup').then(module => ({ default: module.default })));
const AuditTool = lazy(() => import('./components/AuditTool').then(module => ({ default: module.AuditTool })));

const FullScreenLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="min-h-screen bg-white dark:bg-brand-primary font-sans flex flex-col items-center justify-center text-center p-4">
    <LoaderIcon className="w-16 h-16 animate-spin text-brand-cyan" />
    {message && <p className="mt-4 text-xl font-semibold text-gray-700 dark:text-brand-text">{message}</p>}
  </div>
);

const App: React.FC = () => {
  useTheme(); // Initialize and manage theme
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader message="Loading session..." />;
  }

  return (
    <Suspense fallback={<FullScreenLoader />}>
      {!user ? (
        <Login />
      ) : !user.agencyProfile ? (
        <AgencySetup />
      ) : (
        <AuditTool />
      )}
    </Suspense>
  );
};

export default App;