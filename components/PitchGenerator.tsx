
import React from 'react';
import { SparklesIcon, ClipboardIcon, CheckIcon, LoaderIcon } from './Icons';
import { useState } from 'react';

interface PitchGeneratorProps {
  onGenerate: () => void;
  pitch: string;
  isLoading: boolean;
}

export const PitchGenerator: React.FC<PitchGeneratorProps> = ({ onGenerate, pitch, isLoading }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(pitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 bg-brand-secondary/50 p-6 rounded-lg no-print animate-slide-in" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-brand-light flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-brand-yellow" />
            Auto-Pitch Generator
        </h3>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-brand-primary font-bold rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-yellow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
                <LoaderIcon className="w-5 h-5 animate-spin"/>
                Generating...
            </>
          ) : 'Generate 30s Pitch'}
        </button>
      </div>
      
      {pitch && (
        <div className="bg-brand-primary p-4 rounded-md relative animate-fade-in">
          <p className="text-brand-text whitespace-pre-wrap">{pitch}</p>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-md bg-brand-accent hover:bg-brand-light transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <CheckIcon className="w-5 h-5 text-brand-green" /> : <ClipboardIcon className="w-5 h-5 text-brand-text" />}
          </button>
        </div>
      )}
    </div>
  );
};
