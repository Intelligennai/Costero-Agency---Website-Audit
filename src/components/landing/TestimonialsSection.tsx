import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { SparklesIcon } from '../Icons';

const TestimonialCard: React.FC<{ text: string; name: string; title: string; }> = ({ text, name, title }) => (
    <div className="bg-white dark:bg-brand-secondary p-8 rounded-xl border border-gray-200 dark:border-brand-accent">
        <SparklesIcon className="w-6 h-6 text-brand-yellow mb-4"/>
        <p className="text-gray-700 dark:text-gray-200 mb-6">"{text}"</p>
        <div className="flex items-center">
            {/* Placeholder for avatar image */}
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-brand-accent mr-4"></div>
            <div>
                <p className="font-bold text-gray-900 dark:text-white">{name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            </div>
        </div>
    </div>
);

const TestimonialsSection: React.FC = () => {
    const t = useTranslations();

    const testimonials = [
        {
            text: t('landing_testimonial_1_text'),
            name: t('landing_testimonial_1_name'),
            title: t('landing_testimonial_1_title'),
        },
        {
            text: t('landing_testimonial_2_text'),
            name: t('landing_testimonial_2_name'),
            title: t('landing_testimonial_2_title'),
        },
    ];

    return (
        <section id="testimonials" className="py-20 md:py-28 bg-gray-50 dark:bg-brand-primary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                        {t('landing_testimonials_title')}
                    </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
