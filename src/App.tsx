import React, { Suspense, lazy, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { LoaderIcon } from './components/Icons';

const MainPlatform = lazy(() => import('./components/MainPlatform'));
const Login = lazy(() => import('./components/Login'));
const LandingPage = lazy(() => import('./components/landing/LandingPage'));

const FullScreenLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="min-h-screen bg-white dark:bg-brand-primary font-sans flex flex-col items-center justify-center text-center p-4">
    <LoaderIcon className="w-12 h-12 animate-spin text-brand-cyan" />
    {message && <p className="mt-4 text-lg font-medium text-gray-600 dark:text-brand-light">{message}</p>}
  </div>
);

type UnauthenticatedView = 'landing' | 'login' | 'register';

const App: React.FC = () => {
  useTheme(); // Initialize and manage theme
  const { user, isLoading } = useAuth();
  const [unauthenticatedView, setUnauthenticatedView] = useState<UnauthenticatedView>('landing');

  const showLogin = () => setUnauthenticatedView('login');
  const showRegister = () => setUnauthenticatedView('register');
  const showLanding = () => setUnauthenticatedView('landing');

  if (isLoading) {
    return <FullScreenLoader message="Loading session..." />;
  }

  return (
    <Suspense fallback={<FullScreenLoader />}>
      {user ? (
        <MainPlatform />
      ) : (
        <>
          {unauthenticatedView === 'landing' && <LandingPage onLogin={showLogin} onRegister={showRegister} />}
          {unauthenticatedView === 'login' && <Login onShowLanding={showLanding} onToggleMode={showRegister} mode="login" />}
          {unauthenticatedView === 'register' && <Login onShowLanding={showLanding} onToggleMode={showLogin} mode="register" />}
        </>
      )}
    </Suspense>
  );
};

export default App;