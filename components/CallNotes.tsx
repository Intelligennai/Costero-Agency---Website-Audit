
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NotesIcon, CheckIcon, LoaderIcon, TrashIcon } from './Icons';

interface CallNotesProps {
  url: string;
}

const CallNotesComponent: React.FC<CallNotesProps> = ({ url }) => {
  const [notes, setNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const isInitialMount = useRef(true);

  const storageKey = `call_notes_${url}`;

  // Load initial notes from localStorage
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(storageKey) || '';
      setNotes(savedNotes);
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      setNotes('');
    }
    isInitialMount.current = true;
    setSaveStatus('idle');
  }, [storageKey]);

  // Auto-save notes with debounce
  useEffect(() => {
    if (isInitialMount.current) {
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
  }, [notes, storageKey]);

  const handleClear = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all notes for this URL? This cannot be undone.')) {
      try {
        localStorage.removeItem(storageKey);
        setNotes('');
      } catch (error) {
        console.error("Failed to clear from localStorage", error);
      }
    }
  }, [storageKey]);
  
  const getSaveStatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className="text-brand-light flex items-center gap-2 text-sm animate-fade-in">
            <LoaderIcon className="w-4 h-4 animate-spin" />
            Saving...
          </span>
        );
      case 'saved':
        return (
          <span className="text-brand-green flex items-center gap-2 text-sm animate-fade-in">
            <CheckIcon className="w-4 h-4" />
            Saved!
          </span>
        );
      case 'idle':
        if (!isInitialMount.current && notes.length > 0) {
            return (
                <span className="text-brand-light/70 flex items-center gap-2 text-sm">
                    <CheckIcon className="w-4 h-4" />
                    All changes saved
                </span>
            );
        }
        return <div className="h-5"></div>; // Placeholder to prevent layout shift
      default:
        return <div className="h-5"></div>;
    }
  };

  return (
    <div className="mt-8 bg-brand-secondary/50 p-6 rounded-lg no-print animate-slide-in" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-brand-light flex items-center gap-2">
          <NotesIcon className="w-6 h-6 text-brand-cyan" />
          Call Notes
        </h3>
        <div className="flex items-center justify-end h-6 min-w-[120px] text-right">
            {getSaveStatusIndicator()}
        </div>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type your notes here... they will be saved automatically for this specific URL."
        className="w-full h-48 p-3 bg-brand-primary border-2 border-brand-accent rounded-md text-brand-text placeholder-brand-light focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all"
        aria-label="Call Notes"
      />
      <div className="flex items-center justify-end mt-4">
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-light rounded-md hover:bg-brand-red hover:text-brand-text transition-colors disabled:opacity-50"
          disabled={notes.length === 0}
          title="Clear all notes for this URL"
        >
          <TrashIcon className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
};

export const CallNotes = React.memo(CallNotesComponent);
