import React, { createContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'da' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'da',
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedLang = window.localStorage.getItem('language') as Language;
        if (['da', 'en', 'es'].includes(storedLang)) {
            return storedLang;
        }
    }
    // Default to Danish if nothing is set
    return 'da';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
