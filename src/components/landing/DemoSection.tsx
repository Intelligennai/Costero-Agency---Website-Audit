import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { LoaderIcon } from '../Icons';

interface DemoSectionProps {
  onStartDemo: (url: string) => void;
}

const DemoSection: React.FC<DemoSectionProps> = ({ onStartDemo }) => {
    const t = useTranslations();
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url) {
            setIsLoading(true);
            // Simulate a brief delay for effect before transitioning
            setTimeout(() => {
                onStartDemo(url);
                setIsLoading(false);
            }, 500);
        }
    };

    return (
        <section id="demo" className="py-20 bg-white dark:bg-brand-secondary">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                    {t('landing_demo_section_title') || "Try It Now"}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    {t('landing_demo_section_subtitle') || "See the power of AI audits in action. Enter a URL below."}
                </p>
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative flex items-center">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="example.com"
                        className="w-full py-4 pl-6 pr-40 bg-gray-50 dark:bg-brand-primary border-2 border-gray-200 dark:border-brand-accent rounded-full text-lg focus:outline-none focus:border-brand-cyan transition-colors"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-2 top-2 bottom-2 px-6 bg-brand-cyan text-brand-primary font-bold rounded-full hover:bg-opacity-90 transition-all disabled:opacity-70 flex items-center justify-center"
                    >
                        {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : (t('audit_form_button_analyze') || "Analyze")}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default DemoSection;