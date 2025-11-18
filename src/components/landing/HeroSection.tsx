import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface HeroSectionProps {
  onRegister: () => void;
  onDemo: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onRegister, onDemo }) => {
  const t = useTranslations();
  return (
    <section id="home" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
          {t('landing_hero_title')}
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10">
          {t('landing_hero_subtitle')}
        </p>
        <button
          onClick={onDemo}
          className="px-8 py-4 text-lg font-bold text-brand-primary bg-brand-cyan rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-cyan-500/50"
        >
          {t('landing_hero_cta')}
        </button>
      </div>
    </section>
  );
};

export default HeroSection;