
import React, { useState, useCallback, useEffect } from 'react';
import { AuditForm } from './components/AuditForm';
import { Report } from './components/Report';
import { PitchGenerator } from './components/PitchGenerator';
import { generateAuditReport, generateSalesPitch } from './services/geminiService';
import type { AuditReportData } from './types';
import { GithubIcon, LoaderIcon, ServerCrashIcon } from './components/Icons';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [reportData, setReportData] = useState<AuditReportData | null>(null);
  const [pitch, setPitch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPitchLoading, setIsPitchLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const loadingMessages = [
    "Connecting to the AI model...",
    "Analyzing website design and user experience...",
    "Performing technical SEO audit...",
    "Evaluating digital marketing presence...",
    "Assessing content and communication strategy...",
    "Scanning for AI & Automation opportunities...",
    "Compiling the final audit report...",
  ];

  const handleAudit = useCallback(async (domain: string) => {
    if (!domain) {
      setError('Please enter a website URL.');
      return;
    }
    setIsLoading(true);
    setError('');
    setReportData(null);
    setPitch('');
    setUrl(domain);

    try {
      const data = await generateAuditReport(domain);
      setReportData(data);
    } catch (e) {
      console.error(e);
      setError('Failed to generate audit report. The AI model may be overloaded. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleGeneratePitch = useCallback(async () => {
    if (!reportData) return;
    setIsPitchLoading(true);
    setPitch('');
    try {
      const generatedPitch = await generateSalesPitch(reportData);
      setPitch(generatedPitch);
    } catch (e) {
      console.error(e);
      setError('Failed to generate sales pitch. Please try again.');
    } finally {
      setIsPitchLoading(false);
    }
  }, [reportData]);

  useEffect(() => {
    let interval: number | undefined;
    if (isLoading) {
      let i = 0;
      setLoadingMessage(loadingMessages[0]);
      interval = window.setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[i]);
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, loadingMessages]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 no-print">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-text mb-2">Website Audit for Outsource.dk</h1>
          <p className="text-lg text-brand-light">Enter a domain to generate a comprehensive, data-driven analysis for your sales pitch.</p>
        </header>

        <div className="max-w-4xl mx-auto no-print">
          <AuditForm onAudit={handleAudit} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center mt-12 animate-fade-in">
            <LoaderIcon className="w-16 h-16 animate-spin text-brand-cyan" />
            <p className="mt-4 text-xl font-semibold">Analyzing {url}...</p>
            <p className="text-brand-light w-full max-w-md h-6 transition-all duration-300">{loadingMessage}</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center mt-12 bg-brand-secondary p-8 rounded-lg animate-fade-in">
            <ServerCrashIcon className="w-16 h-16 text-brand-red mb-4" />
            <p className="text-xl font-semibold text-red-400">An Error Occurred</p>
            <p className="text-brand-light max-w-md">{error}</p>
          </div>
        )}

        {reportData && !isLoading && (
          <div id="report-content" className="mt-8 animate-fade-in print-container">
            <Report data={reportData} url={url} onPrint={handlePrint} />
            <PitchGenerator 
              onGenerate={handleGeneratePitch} 
              pitch={pitch} 
              isLoading={isPitchLoading}
            />
          </div>
        )}
      </main>
      <footer className="text-center p-4 mt-8 text-brand-accent border-t border-brand-accent/20 no-print">
        <a href="https://github.com/google-gemini-v2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-brand-cyan transition-colors">
          <GithubIcon className="w-5 h-5" />
          Powered by Gemini
        </a>
      </footer>
    </div>
  );
};

export default App;