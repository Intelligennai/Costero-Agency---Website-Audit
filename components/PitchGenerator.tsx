import React, { useState, useEffect } from 'react';
import { SparklesIcon, ClipboardIcon, CheckIcon, LoaderIcon } from './Icons';

interface PitchGeneratorProps {
  onGenerate: () => void;
  pitches: string[];
  isLoading: boolean;
}

const PitchGeneratorComponent: React.FC<PitchGeneratorProps> = ({ onGenerate, pitches, isLoading }) => {
  const [selectedPitchIndex, setSelectedPitchIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedPitchIndex(0);
    setCopiedIndex(null);
  }, [pitches]);
  
  const handleCopy = (index: number) => {
    if (!pitches[index]) return;
    navigator.clipboard.writeText(pitches[index]);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const hasPitches = pitches && pitches.length > 0;

  return (
    <div className="mt-8 bg-brand-secondary/50 p-6 rounded-lg no-print animate-slide-in" style={{ animationDelay: '200ms' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h3 className="text-2xl font-bold text-brand-light flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-brand-yellow" />
            Auto-Pitch Generator
        </h3>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-brand-yellow text-brand-primary font-bold rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-yellow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
                <LoaderIcon className="w-5 h-5 animate-spin"/>
                Generating...
            </>
          ) : 'Generate Pitches'}
        </button>
      </div>
      
      {hasPitches && (
        <div className="animate-fade-in">
          <div className="flex space-x-2 p-1 bg-brand-accent/20 rounded-lg mb-4">
             {pitches.map((_, index) => (
              <div key={index} className="flex-1">
                <input
                  type="radio"
                  id={`pitch-var-${index}`}
                  name="pitchVariation"
                  value={index}
                  checked={selectedPitchIndex === index}
                  onChange={(e) => setSelectedPitchIndex(Number(e.target.value))}
                  className="sr-only"
                />
                <label
                  htmlFor={`pitch-var-${index}`}
                  className={`w-full block text-center px-4 py-2 text-sm font-semibold rounded-md cursor-pointer transition-colors ${
                    selectedPitchIndex === index
                      ? 'bg-brand-cyan text-brand-primary shadow'
                      : 'text-brand-light hover:bg-brand-accent/50'
                  }`}
                >
                  Variation {index + 1}
                </label>
              </div>
            ))}
          </div>
          
          <div className="relative bg-brand-primary p-4 rounded-md">
             <button
                onClick={() => handleCopy(selectedPitchIndex)}
                className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-brand-accent hover:bg-brand-light transition-colors disabled:opacity-50"
                disabled={copiedIndex === selectedPitchIndex}
                title="Copy to clipboard"
            >
                {copiedIndex === selectedPitchIndex ? (
                    <>
                        <CheckIcon className="w-4 h-4 text-brand-green" />
                        <span>Copied!</span>
                    </>
                ) : (
                    <>
                        <ClipboardIcon className="w-4 h-4 text-brand-text" />
                        <span>Copy</span>
                    </>
                )}
            </button>
            <p className="text-brand-text whitespace-pre-wrap min-h-[120px] pr-20">{pitches[selectedPitchIndex]}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const PitchGenerator = React.memo(PitchGeneratorComponent);
