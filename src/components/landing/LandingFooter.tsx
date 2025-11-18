import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { GithubIcon, TwitterIcon, LinkedInIcon } from '../Icons';

const LandingFooter: React.FC = () => {
  const t = useTranslations();
  
  return (
    <footer className="bg-gray-50 dark:bg-brand-primary border-t border-gray-200 dark:border-brand-accent">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <TwitterIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <LinkedInIcon className="h-6 w-6" />
            </a>
            <a href="https://github.com/google-gemini-v2" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <GithubIcon className="h-6 w-6" />
            </a>
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} AuditPro. {t('landing_footer_rights')}
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
