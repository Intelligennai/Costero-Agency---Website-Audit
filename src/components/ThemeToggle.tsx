import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useTranslations } from '../hooks/useTranslations';
import { SunIcon, MoonIcon } from './Icons';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 dark:text-brand-light hover:bg-gray-200 dark:hover:bg-brand-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-cyan dark:focus:ring-offset-brand-primary transition-colors"
      aria-label={t(theme === 'light' ? 'theme_toggle_dark' : 'theme_toggle_light')}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <SunIcon className="w-6 h-6" />
      )}
    </button>
  );
};

export default React.memo(ThemeToggle);