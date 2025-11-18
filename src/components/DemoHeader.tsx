import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { SparklesIcon } from './Icons';

interface DemoHeaderProps {
  onShowLanding: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const DemoHeader: React.FC<DemoHeaderProps> = ({ onShowLanding, onLogin, onRegister }) => {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-brand-primary/80 backdrop-blur-sm border-b border-gray-200 dark:border-brand-accent no-print">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button onClick={onShowLanding} className="flex items-center gap-2">
            <SparklesIcon className="w-8 h-8 text-brand-cyan" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">AuditPro</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button onClick={onShowLanding} className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-cyan dark:hover:text-brand-cyan transition-colors">
              {t('demo_header_back_button')}
            </button>
            <button onClick={onLogin} className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-cyan dark:hover:text-brand-cyan transition-colors">
              {t('landing_nav_login')}
            </button>
            <button onClick={onRegister} className="px-4 py-2 text-sm font-semibold text-brand-primary bg-brand-cyan rounded-full hover:bg-opacity-90 transition-all">
              {t('landing_nav_register')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DemoHeader;