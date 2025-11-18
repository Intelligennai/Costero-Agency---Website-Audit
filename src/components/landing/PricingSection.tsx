import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { CheckIcon } from '../Icons';

interface PricingSectionProps {
  onRegister: () => void;
  onDemo: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onRegister, onDemo }) => {
  const t = useTranslations();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      title: t('landing_pricing_starter_title'),
      price: t('landing_pricing_starter_price'),
      description: t('landing_pricing_starter_desc'),
      features: [
        t('landing_pricing_starter_feature_1'),
        t('landing_pricing_starter_feature_2'),
        t('landing_pricing_starter_feature_3'),
      ],
      cta: t('landing_pricing_starter_cta'),
      isFeatured: false,
      action: onDemo,
    },
    {
      title: t('landing_pricing_pro_title'),
      price: t('landing_pricing_pro_price'),
      description: t('landing_pricing_pro_desc'),
      features: [
        t('landing_pricing_pro_feature_1'),
        t('landing_pricing_pro_feature_2'),
        t('landing_pricing_pro_feature_3'),
        t('landing_pricing_pro_feature_4'),
      ],
      cta: t('landing_pricing_pro_cta'),
      isFeatured: true,
      action: onRegister,
    },
    {
      title: t('landing_pricing_enterprise_title'),
      price: t('landing_pricing_enterprise_price'),
      description: t('landing_pricing_enterprise_desc'),
      features: [
        t('landing_pricing_enterprise_feature_1'),
        t('landing_pricing_enterprise_feature_2'),
        t('landing_pricing_enterprise_feature_3'),
        t('landing_pricing_enterprise_feature_4'),
      ],
      cta: t('landing_pricing_enterprise_cta'),
      isFeatured: false,
      action: onRegister,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">{t('landing_pricing_title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">{t('landing_pricing_subtitle')}</p>
        </div>

        <div className="flex justify-center items-center gap-4 mb-10">
          <span className={`text-sm font-semibold ${!isYearly ? 'text-brand-cyan' : 'text-gray-500'}`}>{t('landing_pricing_monthly')}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isYearly} onChange={() => setIsYearly(!isYearly)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 dark:bg-brand-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-cyan"></div>
          </label>
          <span className={`text-sm font-semibold ${isYearly ? 'text-brand-cyan' : 'text-gray-500'}`}>
            {t('landing_pricing_yearly')} <span className="text-brand-green">({t('landing_pricing_save')})</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`rounded-xl p-8 border ${plan.isFeatured ? 'bg-white dark:bg-brand-secondary border-brand-cyan shadow-2xl' : 'bg-gray-50 dark:bg-brand-primary border-gray-200 dark:border-brand-accent'}`}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.title}</h3>
              <p className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</p>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{plan.description}</p>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-brand-green flex-shrink-0 mt-1" />
                    <span className="text-sm text-gray-700 dark:text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={plan.action}
                className={`w-full mt-8 py-3 text-sm font-bold rounded-full transition-all ${plan.isFeatured ? 'bg-brand-cyan text-brand-primary hover:bg-opacity-90' : 'bg-gray-200 dark:bg-brand-accent text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;