import React from 'react';
import LandingHeader from './LandingHeader';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import DemoSection from './DemoSection';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import ContactSection from './ContactSection';
import LandingFooter from './LandingFooter';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onDemo?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister, onDemo }) => {
  return (
    <div className="bg-white dark:bg-brand-primary text-gray-800 dark:text-gray-200 font-sans">
      <LandingHeader onLogin={onLogin} onRegister={onRegister} />
      <main>
        <HeroSection onRegister={onRegister} />
        <FeaturesSection />
        <DemoSection onDemo={onDemo} />
        <PricingSection onRegister={onRegister} />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
