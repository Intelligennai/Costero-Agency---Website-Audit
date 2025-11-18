import React, { useState } from 'react';
import { analyzeAgencyWebsite } from '../services/geminiService';
import { useAuth } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { LoaderIcon, SearchIcon } from './Icons';

const AgencySetup: React.FC = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    // Fix: The auth hook returns 'updateAgency', not 'updateUser'.
    const { updateAgency } = useAuth();
    const t = useTranslations();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const processedUrl = url.trim().replace(/^https?:\/\//, '');

        if (!processedUrl || !processedUrl.includes('.')) {
            setError(t('agency_setup_error_url'));
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const profile = await analyzeAgencyWebsite(processedUrl);
            // Fix: Call 'updateAgency' with the correct payload structure: { profile }.
            await updateAgency({ profile });
            // The AuthProvider will detect the user update and redirect to the main app
        } catch (err) {
            console.error(err);
            setError(t('agency_setup_error_analysis'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center animate-fade-in bg-white dark:bg-brand-primary p-4">
            <div className="w-full max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-brand-text mb-4">{t('agency_setup_title')}</h1>
                <p className="text-lg text-gray-500 dark:text-brand-light max-w-2xl mx-auto mb-8">{t('agency_setup_subtitle')}</p>

                <div className="w-full max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400 dark:text-brand-light" />
                        </div>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder={t('agency_setup_placeholder')}
                            className={`w-full pl-12 pr-44 py-4 bg-gray-50 dark:bg-brand-secondary border-2 rounded-full text-gray-900 dark:text-brand-text placeholder-gray-400 dark:placeholder-brand-light focus:outline-none focus:ring-2 transition-all ${
                                error
                                ? 'border-brand-red focus:ring-brand-red'
                                : 'border-gray-300 dark:border-brand-accent focus:ring-brand-cyan'
                            }`}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="absolute inset-y-0 right-0 m-2 px-6 py-2 bg-brand-cyan text-brand-primary font-bold rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-brand-secondary focus:ring-brand-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderIcon className="w-5 h-5 animate-spin mr-2"/>
                                    {t('agency_setup_button_loading')}
                                </>
                            ) : t('agency_setup_button')}
                        </button>
                    </form>
                    {error && (
                        <p role="alert" className="text-brand-red text-sm mt-2 animate-fade-in">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgencySetup;