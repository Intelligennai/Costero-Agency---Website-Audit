import React from 'react';
import LandingHeader from './LandingHeader';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import ContactSection from './ContactSection';
import LandingFooter from './LandingFooter';
import DemoSection from './DemoSection';
import AboutSection from './AboutSection';
import FaqSection from './FaqSection';
import LandingChatbot from './LandingChatbot';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onDemo: (url?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister, onDemo }) => {
  return (
    <div className="bg-white dark:bg-brand-primary text-gray-800 dark:text-gray-200 font-sans">
      <LandingHeader onLogin={onLogin} onRegister={onRegister} />
      <main>
        <HeroSection onRegister={onRegister} onDemo={() => onDemo()} />
        <AboutSection />
        <DemoSection onStartDemo={onDemo} />
        <FeaturesSection />
        <PricingSection onRegister={onRegister} onDemo={() => onDemo()} />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <LandingFooter />
      <LandingChatbot />
    </div>
  );
};

export default LandingPage;