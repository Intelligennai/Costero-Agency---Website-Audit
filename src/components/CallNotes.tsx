import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NotesIcon, CheckIcon, LoaderIcon, TrashIcon, ClipboardIcon, LockIcon } from './Icons';
import { useTranslations } from '../hooks/useTranslations';

interface CallNotesProps {
  url: string;
  mode?: 'full' | 'demo';
}

const CallNotesComponent: React.FC<CallNotesProps> = ({ url, mode = 'full' }) => {
  const [notes, setNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isCopied, setIsCopied] = useState(false);
  const isInitialMount = useRef(true);
  const t = useTranslations();

  const storageKey = `call_notes_${url}`;

  // Load initial notes from localStorage when the URL changes
  useEffect(() => {
    if (mode === 'full') {
      try {
        const savedNotes = localStorage.getItem(storageKey) || '';
        setNotes(savedNotes);
      } catch (error) {
        console.error("Failed to read from localStorage", error);
        setNotes('');
      }
    }
    // Reset state for the new URL
    isInitialMount.current = true;
    setSaveStatus('idle');
  }, [storageKey, mode]);

  // Auto-save notes with debounce, skipping the initial load
  useEffect(() => {
    // Only save if in full mode
    if (mode === 'demo' || isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, notes);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000); 
      } catch (error) {
        console.error("Failed to save to localStorage", error);
        setSaveStatus('idle');
      }
    }, 1000); // 1-second debounce

    return () => clearTimeout(timer);
  }, [notes, storageKey, mode]);

  const handleClear = useCallback(() => {
    if (window.confirm(t('call_notes_clear_confirm'))) {
      try {
        localStorage.removeItem(storageKey);
        setNotes('');
        setSaveStatus('idle');
      } catch (error) {
        console.error("Failed to clear from localStorage", error);
      }
    }
  }, [storageKey, t]);

  const handleCopy = useCallback(() => {
    if (!notes || isCopied) return;
    navigator.clipboard.writeText(notes);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [notes, isCopied]);
  
  const getSaveStatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className="text-gray-500 dark:text-brand-light flex items-center gap-2 text-sm animate-fade-in">
            <LoaderIcon className="w-4 h-4 animate-spin" />
            {t('call_notes_saving')}
          </span>
        );
      case 'saved':
        return (
          <span className="text-brand-green flex items-center gap-2 text-sm animate-fade-in">
            <CheckIcon className="w-4 h-4" />
            {t('call_notes_saved')}
          </span>
        );
      case 'idle':
        if (notes.length > 0) {
            return (
                <span className="text-gray-400 dark:text-brand-light/70 flex items-center gap-2 text-sm">
                    <CheckIcon className="w-4 h-4" />
                    {t('call_notes_all_changes_saved')}
                </span>
            );
        }
        return <div className="h-5"></div>; 
      default:
        return <div className="h-5"></div>;
    }
  };

  if (mode === 'demo') {
    return (
      <div data-section-id="callNotes" className="mt-8 bg-white dark:bg-brand-secondary p-6 rounded-lg no-print animate-slide-in border border-gray-200 dark:border-brand-accent" style={{ animationDelay: '300ms' }}>
         <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-50 dark:bg-brand-primary rounded-lg border-2 border-dashed border-gray-300 dark:border-brand-accent">
          <LockIcon className="w-12 h-12 text-gray-400 dark:text-brand-accent mb-4"/>
          <h4 className="text-lg font-bold text-gray-800 dark:text-brand-text">{t('demo_notes_locked_title')}</h4>
          <p className="text-sm text-gray-600 dark:text-brand-light max-w-sm">{t('demo_notes_locked_text')}</p>
        </div>
      </div>
    );
  }

  return (
    <div data-section-id="callNotes" className="mt-8 bg-white dark:bg-brand-secondary p-6 rounded-lg no-print animate-slide-in border border-gray-200 dark:border-brand-accent" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-brand-text flex items-center gap-2">
          <NotesIcon className="w-6 h-6 text-brand-cyan" />
          {t('call_notes_title')}
        </h3>
        <div className="flex items-center justify-end h-6 min-w-[120px] text-right">
            {getSaveStatusIndicator()}
        </div>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t('call_notes_placeholder')}
        className="w-full h-48 p-3 bg-gray-50 dark:bg-brand-primary border-2 border-gray-300 dark:border-brand-accent rounded-md text-gray-900 dark:text-brand-text placeholder-gray-400 dark:placeholder-brand-light focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all"
        aria-label="Call Notes"
      />
      <div className="flex items-center justify-end mt-4 gap-2">
         <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-brand-light rounded-md hover:bg-gray-200 dark:hover:bg-brand-accent hover:text-gray-900 dark:hover:text-brand-text transition-colors disabled:opacity-50"
          disabled={!notes || isCopied}
          title={t('copy_tooltip')}
        >
          {isCopied ? (
            <>
              <CheckIcon className="w-4 h-4 text-brand-green" />
              <span>{t('copied')}</span>
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4" />
              <span>{t('copy')}</span>
            </>
          )}
        </button>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-brand-light rounded-md hover:bg-brand-red hover:text-white dark:hover:text-white transition-colors disabled:opacity-50"
          disabled={notes.length === 0}
          title={t('call_notes_clear_tooltip')}
        >
          <TrashIcon className="w-4 h-4" />
          {t('call_notes_clear')}
        </button>
      </div>
    </div>
  );
};

export const CallNotes = React.memo(CallNotesComponent);