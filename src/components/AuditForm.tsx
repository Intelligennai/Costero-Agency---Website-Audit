import React, { useState } from 'react';
import { SearchIcon } from './Icons';

interface AuditFormProps {
  onAudit: (url: string) => void;
  isLoading: boolean;
}

const AuditFormComponent: React.FC<AuditFormProps> = ({ onAudit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAudit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-brand-light" />
      </div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="e.g., example.com"
        className="w-full pl-12 pr-32 py-4 bg-brand-secondary border-2 border-brand-accent rounded-full text-brand-text placeholder-brand-light focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="absolute inset-y-0 right-0 m-2 px-6 py-2 bg-brand-cyan text-brand-primary font-bold rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
};

export const AuditForm = React.memo(AuditFormComponent);
