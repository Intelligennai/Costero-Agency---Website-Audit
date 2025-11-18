import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { SparklesIcon } from '../Icons';

interface LandingHeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ onLogin, onRegister }) => {
  const t = useTranslations();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: t('landing_nav_features') },
    { href: '#pricing', label: t('landing_nav_pricing') },
    { href: '#testimonials', label: t('landing_nav_testimonials') },
    { href: '#contact', label: t('landing_nav_contact') },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-brand-primary/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-8 h-8 text-brand-cyan" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">AuditPro</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-cyan dark:hover:text-brand-cyan transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={onLogin} className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-cyan dark:hover:text-brand-cyan transition-colors">
              {t('landing_nav_login')}
            </button>
            <button onClick={onRegister} className="px-4 py-2 text-sm font-semibold text-brand-primary bg-brand-cyan rounded-full hover:bg-opacity-90 transition-all">
              {t('landing_nav_register')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
