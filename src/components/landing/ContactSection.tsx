import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';

const ContactSection: React.FC = () => {
  const t = useTranslations();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission here (e.g., API call)
    alert("Thank you for your message! We'll be in touch soon.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            {t('landing_contact_title')}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {t('landing_contact_subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 max-w-xl mx-auto">
          <div className="grid grid-cols-1 gap-y-6">
            <div>
              <label htmlFor="name" className="sr-only">{t('landing_contact_name_label')}</label>
              <input type="text" name="name" id="name" required placeholder={t('landing_contact_name_label')}
                className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-cyan focus:border-brand-cyan border-gray-300 rounded-md dark:bg-brand-secondary dark:border-brand-accent dark:text-white" />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">{t('landing_contact_email_label')}</label>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder={t('landing_contact_email_label')}
                className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-cyan focus:border-brand-cyan border-gray-300 rounded-md dark:bg-brand-secondary dark:border-brand-accent dark:text-white" />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">{t('landing_contact_message_label')}</label>
              <textarea id="message" name="message" rows={4} required placeholder={t('landing_contact_message_label')}
                className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-cyan focus:border-brand-cyan border-gray-300 rounded-md dark:bg-brand-secondary dark:border-brand-accent dark:text-white" />
            </div>
            <div className="text-center">
              <button type="submit"
                className="inline-block w-full sm:w-auto px-8 py-3 text-lg font-bold text-brand-primary bg-brand-cyan rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-cyan-500/50">
                {t('landing_contact_send_button')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
