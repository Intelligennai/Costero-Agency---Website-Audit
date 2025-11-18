import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { SparklesIcon } from './Icons';

interface DemoUpsellBannerProps {
  onRegister: () => void;
}

const DemoUpsellBanner: React.FC<DemoUpsellBannerProps> = ({ onRegister }) => {
  const t = useTranslations();
  
  return (
    <div className="p-6 mb-8 bg-brand-cyan/20 dark:bg-brand-cyan/10 border-2 border-dashed border-brand-cyan rounded-xl text-center no-print">
      <div className="flex justify-center mb-4">
        <SparklesIcon className="w-8 h-8 text-brand-cyan" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {t('demo_upsell_title')}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-6">
        {t('demo_upsell_subtitle')}
      </p>
      <button
        onClick={onRegister}
        className="px-6 py-3 text-base font-bold text-brand-primary bg-brand-cyan rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-cyan-500/50"
      >
        {t('demo_upsell_cta')}
      </button>
    </div>
  );
};

export default DemoUpsellBanner;