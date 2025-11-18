import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { DataIcon, ZapIcon, ShieldCheckIcon } from '../Icons';

const ValueCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="text-center md:text-left">
    <div className="flex justify-center md:justify-start">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-brand-cyan/20 text-brand-cyan mb-4">
          {icon}
        </div>
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const AboutSection: React.FC = () => {
  const t = useTranslations();

  const values = [
    {
      icon: <DataIcon className="w-6 h-6" />,
      title: t('about_value_1_title'),
      description: t('about_value_1_desc'),
    },
    {
      icon: <ZapIcon className="w-6 h-6" />,
      title: t('about_value_2_title'),
      description: t('about_value_2_desc'),
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: t('about_value_3_title'),
      description: t('about_value_3_desc'),
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-gray-50 dark:bg-brand-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            {t('about_title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            {t('about_subtitle')}
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>{t('about_paragraph_1')}</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{t('about_paragraph_2')}</p>
            </div>
            <div className="grid grid-cols-1 gap-8">
                {values.map((value, index) => (
                    <ValueCard key={index} {...value} />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
