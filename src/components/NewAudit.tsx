import React, { useState, useCallback, useContext, Suspense, lazy } from 'react';
import { generateAuditReport } from '../services/geminiService';
import { useAuthContext } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { LanguageContext } from '../context/LanguageContext';
import AuditForm from './AuditForm';
import { ServerCrashIcon, GithubIcon, ChevronLeftIcon } from './Icons';
import type { TranslationKey } from '../translations';
import type { AuditReportData } from '../types';

const ReportSkeleton = lazy(() => import('./ReportSkeleton'));

interface NewAuditProps {
    onAuditComplete: (url: string, reportData: AuditReportData) => void;
    onReturnToDashboard: () => void;
}

const NewAudit: React.FC<NewAuditProps> = ({ onAuditComplete, onReturnToDashboard }) => {
    const { agency } = useAuthContext();
    const t = useTranslations();
    const { language } = useContext(LanguageContext);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const agencyProfile = agency?.profile;

    const handleAudit = useCallback(async (domain: string) => {
        if (!agencyProfile) {
            setError('error_message_default');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const data = await generateAuditReport(domain, agencyProfile, language);
            onAuditComplete(domain, data);
        } catch (e) {
            console.error(e);
            setError((e as Error).message || 'error_message_default');
        } finally {
            setIsLoading(false);
        }
    }, [agencyProfile, language, onAuditComplete]);

    if (!agencyProfile) {
        return null; // Should be handled by App router
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-brand-primary font-sans">
             <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto mb-8">
                    <button onClick={onReturnToDashboard} className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-brand-light hover:text-brand-cyan dark:hover:text-brand-cyan transition-colors mb-4 no-print">
                        <ChevronLeftIcon className="w-5 h-5" />
                        {t('back_to_dashboard')}
                    </button>
                    <header className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-brand-text mb-2">{t('header_title', { agencyName: agencyProfile.name })}</h1>
                        <p className="text-lg text-gray-600 dark:text-brand-light">{t('header_subtitle')}</p>
                    </header>
                </div>

                <div className="max-w-4xl mx-auto no-print">
                    <AuditForm onAudit={handleAudit} isLoading={isLoading} />
                </div>

                {isLoading && (
                    <Suspense fallback={null}>
                        <ReportSkeleton />
                    </Suspense>
                )}

                {error && !isLoading && (
                    <div className="flex flex-col items-center justify-center text-center mt-12 bg-red-50 dark:bg-red-900/20 p-8 rounded-lg animate-fade-in border border-red-200 dark:border-red-500/30 max-w-4xl mx-auto">
                        <ServerCrashIcon className="w-16 h-16 text-brand-red mb-4" />
                        <p className="text-xl font-semibold text-red-700 dark:text-red-400">{t('error_title')}</p>
                        <p className="text-red-600 dark:text-red-300 max-w-md">{t(error as TranslationKey)}</p>
                    </div>
                )}
            </main>
             <footer className="text-center p-4 mt-8 text-gray-500 dark:text-brand-light border-t border-gray-200 dark:border-brand-accent no-print">
                <a href="https://github.com/google-gemini-v2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-brand-cyan transition-colors">
                    <GithubIcon className="w-5 h-5" />
                    Powered by Gemini
                </a>
            </footer>
        </div>
    );
};

export default NewAudit;