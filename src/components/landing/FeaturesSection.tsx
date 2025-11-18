import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { 
    FeatureAuditIconComponent as FeatureAuditIcon, 
    FeatureBrandingIconComponent as FeatureBrandingIcon, 
    FeatureCompetitorIconComponent as FeatureCompetitorIcon,
    FeaturePitchIconComponent as FeaturePitchIcon,
    FeatureDataIconComponent as FeatureDataIcon,
    FeatureDashboardIconComponent as FeatureDashboardIcon
} from '../Icons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-brand-secondary p-6 rounded-xl border border-gray-200 dark:border-brand-accent transition-all hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-brand-cyan/20 text-brand-cyan mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  const t = useTranslations();

  const features = [
    {
      icon: <FeatureAuditIcon className="w-6 h-6" />,
      title: t('landing_feature_1_title'),
      description: t('landing_feature_1_desc'),
    },
    {
      icon: <FeatureBrandingIcon className="w-6 h-6" />,
      title: t('landing_feature_2_title'),
      description: t('landing_feature_2_desc'),
    },
    {
      icon: <FeatureCompetitorIcon className="w-6 h-6" />,
      title: t('landing_feature_3_title'),
      description: t('landing_feature_3_desc'),
    },
    {
      icon: <FeaturePitchIcon className="w-6 h-6" />,
      title: t('landing_feature_4_title'),
      description: t('landing_feature_4_desc'),
    },
    {
      icon: <FeatureDataIcon className="w-6 h-6" />,
      title: t('landing_feature_5_title'),
      description: t('landing_feature_5_desc'),
    },
    {
      icon: <FeatureDashboardIcon className="w-6 h-6" />,
      title: t('landing_feature_6_title'),
      description: t('landing_feature_6_desc'),
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-gray-50 dark:bg-brand-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            {t('landing_features_title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            {t('landing_features_subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
