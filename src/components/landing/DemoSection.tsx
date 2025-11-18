import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface DemoSectionProps {
  onDemo?: () => void;
}

const DemoSection: React.FC<DemoSectionProps> = ({ onDemo }) => {
  const t = useTranslations();

  return (
    <section id="demo" className="py-20 md:py-28 bg-white dark:bg-brand-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            {t('landing_demo_title') || 'See It in Action'}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            {t('landing_demo_subtitle') || 'Experience our AI-powered audit tools firsthand'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-100 dark:bg-brand-primary rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-video bg-gradient-to-br from-brand-cyan/10 to-brand-accent/10 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('landing_demo_placeholder') || 'Interactive demo preview'}
                </p>
                {onDemo && (
                  <button
                    onClick={onDemo}
                    className="px-6 py-2 bg-brand-cyan text-brand-primary font-bold rounded-lg hover:bg-opacity-90 transition-all"
                  >
                    {t('landing_try_demo') || 'Try Demo'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-cyan mb-2">10K+</div>
              <p className="text-gray-600 dark:text-gray-300">{t('landing_demo_stat_1') || 'Websites Audited'}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-cyan mb-2">98%</div>
              <p className="text-gray-600 dark:text-gray-300">{t('landing_demo_stat_2') || 'Accuracy Rate'}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-cyan mb-2">24/7</div>
              <p className="text-gray-600 dark:text-gray-300">{t('landing_demo_stat_3') || 'Always Available'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
