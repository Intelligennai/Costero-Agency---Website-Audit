import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { CogIcon, LogoutIcon } from './Icons';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import SettingsModal from './SettingsModal';

interface HeaderProps {
  onNavigateToDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToDashboard }) => {
  // FIX: Destructure 'agency' from the context to access its properties.
  const { agency, logout } = useAuthContext();
  const t = useTranslations();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // FIX: Access 'profile' from the 'agency' object.
  const agencyName = agency?.profile?.name || 'My Agency';
  // FIX: Access 'branding' from the 'agency' object.
  const logo = agency?.branding.logo;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-brand-primary/80 backdrop-blur-sm border-b border-gray-200 dark:border-brand-accent no-print">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Agency Branding */}
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={onNavigateToDashboard}
              title="Back to Dashboard"
            >
              {logo ? (
                <img src={logo} alt={`${agencyName} Logo`} className="h-10 w-auto max-w-[150px] object-contain" />
              ) : (
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{agencyName}</h1>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 md:gap-4">
              <LanguageSelector />
              <ThemeToggle />
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full text-gray-500 dark:text-brand-light hover:bg-gray-200 dark:hover:bg-brand-accent transition-colors"
                title={t('header_settings_button')}
              >
                <CogIcon className="w-6 h-6" />
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-full text-gray-500 dark:text-brand-light hover:bg-gray-200 dark:hover:bg-brand-accent transition-colors"
                title={t('header_logout_button')}
              >
                <LogoutIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      {isSettingsOpen && (
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      )}
    </>
  );
};

export default Header;