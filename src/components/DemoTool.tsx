import React, { useState, useCallback, Suspense, lazy, useContext } from 'react';
import { generateAuditReport } from '../services/geminiService';
import type { AuditReportData, AgencyProfile } from '../types';
import { ServerCrashIcon } from './Icons';
import { useTranslations } from '../hooks/useTranslations';
import { LanguageContext } from '../context/LanguageContext';
import type { TranslationKey } from '../translations';
import AuditForm from './AuditForm';
import DemoHeader from './DemoHeader';
import DemoUpsellBanner from './DemoUpsellBanner';

// Lazy load components
const Report = lazy(() => import('./Report').then(module => ({ default: module.Report })));
const PitchGenerator = lazy(() => import('./PitchGenerator').then(module => ({ default: module.PitchGenerator })));
const CallNotes = lazy(() => import('./CallNotes').then(module => ({ default: module.CallNotes })));
const ReportSkeleton = lazy(() => import('./ReportSkeleton'));

interface DemoToolProps {
  onShowLanding: () => void;
  onLogin: () => void;
  onRegister: () => void;
  initialUrl?: string | null;
}

const DemoTool: React.FC<DemoToolProps> = ({ onShowLanding, onLogin, onRegister, initialUrl }) => {
  const t = useTranslations();
  const { language } = useContext(LanguageContext);
  
  const [url, setUrl] = useState<string>(initialUrl || '');
  const [reportData, setReportData] = useState<AuditReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const demoAgencyProfile: AgencyProfile = {
    name: t('demo_agency_name'),
    services: ["SEO", "Web Design", "AI Solutions", "Digital Advertising", "Content Marketing"]
  };

  const handleAudit = useCallback(async (domain: string) => {
    setIsLoading(true);
    setError('');
    setReportData(null);
    setUrl(domain);

    try {
      const data = await generateAuditReport(domain, demoAgencyProfile, language);
      setReportData(data);
    } catch (e) {
      console.error(e);
      setError((e as Error).message || 'error_message_default');
    } finally {
      setIsLoading(false);
    }
  }, [language, t]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-primary font-sans">
      <DemoHeader onShowLanding={onShowLanding} onLogin={onLogin} onRegister={onRegister} />
      <main className="container mx-auto p-4 md:p-8">
        {!reportData && (
          <header className="text-center mb-8 no-print max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-brand-text mb-2">{t('header_title', { agencyName: demoAgencyProfile.name })}</h1>
            <p className="text-lg text-gray-600 dark:text-brand-light">{t('header_subtitle')}</p>
          </header>
        )}

        <div className="max-w-4xl mx-auto no-print">
            <AuditForm onAudit={handleAudit} isLoading={isLoading} />
        </div>

        {isLoading && (
          <Suspense fallback={null}>
            <ReportSkeleton />
          </Suspense>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center mt-12 bg-red-50 dark:bg-red-900/20 p-8 rounded-lg animate-fade-in border border-red-200 dark:border-red-500/30">
            <ServerCrashIcon className="w-16 h-16 text-brand-red mb-4" />
            <p className="text-xl font-semibold text-red-700 dark:text-red-400">{t('error_title')}</p>
            <p className="text-red-600 dark:text-red-300 max-w-md">{t(error as TranslationKey)}</p>
          </div>
        )}

        <Suspense fallback={isLoading ? null : <ReportSkeleton />}>
          {reportData && !isLoading && (
            <div className="mt-8 animate-fade-in">
              <DemoUpsellBanner onRegister={onRegister} />
              <div id="report-content" className="print-container">
                <Report 
                  data={reportData} 
                  url={url} 
                  onPrintRequest={() => window.print()} // Simple print for demo
                />
              </div>
              <PitchGenerator 
                  onGenerate={() => {}} 
                  pitches={[]} 
                  isLoading={false}
                  mode="demo"
              />
              <CallNotes url={url} mode="demo" />
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
};

export default DemoTool;