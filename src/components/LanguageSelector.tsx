import React, { useState, useContext, useRef, useEffect } from 'react';
import { LanguageContext, Language } from '../context/LanguageContext';
import { GlobeIcon } from './Icons';

const languages: { [key in Language]: string } = {
  da: 'Dansk',
  en: 'English',
  es: 'Español',
};

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 flex items-center gap-1 rounded-full text-gray-500 dark:text-brand-light hover:bg-gray-200 dark:hover:bg-brand-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-cyan dark:focus:ring-offset-brand-primary transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <GlobeIcon className="w-6 h-6" />
        <span className="text-sm font-semibold">{language.toUpperCase()}</span>
      </button>
      
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-36 origin-top-right bg-white dark:bg-brand-secondary divide-y divide-gray-100 dark:divide-brand-accent rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in"
          style={{ animationDuration: '150ms' }}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {Object.entries(languages).map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleSelect(code as Language)}
                className={`w-full text-left block px-4 py-2 text-sm ${
                  language === code
                    ? 'font-bold bg-gray-100 dark:bg-brand-accent text-gray-900 dark:text-brand-cyan'
                    : 'text-gray-700 dark:text-brand-light'
                } hover:bg-gray-100 dark:hover:bg-brand-accent`}
                role="menuitem"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;