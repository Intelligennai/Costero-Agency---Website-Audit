import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations, TranslationKey } from '../translations';

export const useTranslations = () => {
  const { language } = useContext(LanguageContext);

  const t = (key: TranslationKey, substitutions?: { [key: string]: string }) => {
    let translation = translations[language][key] || translations.en[key] || key;

    if (substitutions) {
        Object.keys(substitutions).forEach(subKey => {
            translation = translation.replace(`{{${subKey}}}`, substitutions[subKey]);
        });
    }

    return translation;
  };

  return t;
};
