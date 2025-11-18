import React from 'react';
import { ChatIcon } from './Icons';
import { useTranslations } from '../hooks/useTranslations';

interface ChatbotTriggerProps {
  onClick: () => void;
}

const ChatbotTriggerComponent: React.FC<ChatbotTriggerProps> = ({ onClick }) => {
  const t = useTranslations();
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 w-16 h-16 bg-brand-cyan rounded-full text-brand-primary flex items-center justify-center shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-primary focus:ring-brand-cyan transition-transform z-40 no-print"
      aria-label={t('chatbot_trigger_aria')}
    >
      <ChatIcon className="w-8 h-8" />
    </button>
  );
};

export const ChatbotTrigger = React.memo(ChatbotTriggerComponent);
