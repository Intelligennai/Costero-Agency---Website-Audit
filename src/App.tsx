import React, { Suspense, lazy, useState, useContext } from 'react';
import { useAuthContext } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { LoaderIcon } from './components/Icons';
import { LanguageContext } from './context/LanguageContext';

const MainPlatform = lazy(() => import('./components/MainPlatform'));
const Login = lazy(() => import('./components/Login'));
const LandingPage = lazy(() => import('./components/landing/LandingPage'));
const DemoTool = lazy(() => import('./components/DemoTool'));
const AgencySetup = lazy(() => import('./components/AgencySetup'));


const FullScreenLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-brand-primary font-sans flex flex-col items-center justify-center text-center p-4">
    <LoaderIcon className="w-12 h-12 animate-spin text-brand-cyan" />
    {message && <p className="mt-4 text-lg font-medium text-gray-600 dark:text-brand-light">{message}</p>}
  </div>
);

type UnauthenticatedView = 'landing' | 'login' | 'register' | 'demo';

const App: React.FC = () => {
  useTheme();
  const { language } = useContext(LanguageContext);
  const { agency, user, isLoading } = useAuthContext();
  const [unauthenticatedView, setUnauthenticatedView] = useState<UnauthenticatedView>('landing');
  const [demoUrl, setDemoUrl] = useState<string | null>(null);

  const showLogin = () => setUnauthenticatedView('login');
  const showRegister = () => setUnauthenticatedView('register');
  const showLanding = () => setUnauthenticatedView('landing');
  
  const showDemo = (url?: string) => {
    setDemoUrl(url || null);
    setUnauthenticatedView('demo');
  };

  if (isLoading) {
    return <FullScreenLoader message="Loading session..." />;
  }
  
  if (user && agency && !agency.profile) {
     return (
      <Suspense fallback={<FullScreenLoader />}>
        <AgencySetup />
      </Suspense>
    );
  }

  if (user && agency) {
     return (
      <Suspense fallback={<FullScreenLoader />}>
        <MainPlatform />
      </Suspense>
    );
  }

  // Unauthenticated views
  switch (unauthenticatedView) {
    case 'login':
      return <Suspense fallback={<FullScreenLoader />}><Login onShowLanding={showLanding} onToggleMode={showRegister} mode="login" /></Suspense>;
    case 'register':
      return <Suspense fallback={<FullScreenLoader />}><Login onShowLanding={showLanding} onToggleMode={showLogin} mode="register" /></Suspense>;
    case 'demo':
      return <Suspense fallback={<FullScreenLoader />}><DemoTool key={language} initialUrl={demoUrl} onShowLanding={showLanding} onLogin={showLogin} onRegister={showRegister} /></Suspense>;
    case 'landing':
    default:
      return <Suspense fallback={<FullScreenLoader />}><LandingPage onLogin={showLogin} onRegister={showRegister} onDemo={showDemo} /></Suspense>;
  }
};

export default App;