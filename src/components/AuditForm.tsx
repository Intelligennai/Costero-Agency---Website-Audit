import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { SearchIcon } from './Icons';

interface AuditFormProps {
  onAudit: (url: string) => void;
  isLoading: boolean;
}

const AuditFormComponent: React.FC<AuditFormProps> = ({ onAudit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const t = useTranslations();

  const validateAndCleanUrl = (value: string): string | null => {
    // Remove protocol, www, and any trailing paths for a clean domain.
    const processedUrl = value
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '');
    
    if (!processedUrl) {
      setError(t('audit_form_error_domain_required'));
      return null;
    }

    // This regex validates most common domain formats.
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

    if (!domainRegex.test(processedUrl)) {
      setError(t('audit_form_error_invalid_format'));
      return null;
    }

    return processedUrl;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = validateAndCleanUrl(url);
    if (cleanUrl) {
      setError('');
      onAudit(cleanUrl);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400 dark:text-brand-light" />
        </div>
        <input
          type="text"
          value={url}
          onChange={handleChange}
          placeholder={t('audit_form_placeholder')}
          className={`w-full pl-12 pr-32 py-4 bg-white dark:bg-brand-secondary border-2 rounded-full text-gray-900 dark:text-brand-text placeholder-gray-400 dark:placeholder-brand-light focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-brand-red focus:ring-brand-red'
              : 'border-gray-300 dark:border-brand-accent focus:ring-brand-cyan'
          }`}
          disabled={isLoading}
          aria-invalid={!!error}
          aria-describedby={error ? 'url-error' : undefined}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute inset-y-0 right-0 m-2 px-6 py-2 bg-brand-cyan text-brand-primary font-bold rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-secondary focus:ring-brand-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('audit_form_button_analyzing') : t('audit_form_button_analyze')}
        </button>
      </form>
      {error && (
        <p id="url-error" role="alert" className="text-brand-red text-sm mt-2 text-center animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export const AuditForm = React.memo(AuditFormComponent);