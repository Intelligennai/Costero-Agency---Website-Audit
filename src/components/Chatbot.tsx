
import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { CloseIcon, SendIcon, BotIcon, UserIcon } from './Icons';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatbotComponent: React.FC<ChatbotProps> = ({ isOpen, onClose, messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100); 
    }
  }, [isOpen, messages, isLoading]);


  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(e);
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-end p-4 bg-black/60 animate-fade-in"
      onClick={onClose}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="chatbot-heading"
    >
      <div 
        className="w-full max-w-sm h-[70vh] flex flex-col bg-white dark:bg-brand-secondary rounded-xl shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-brand-accent flex-shrink-0">
          <div className="flex items-center gap-3">
              <BotIcon className="w-6 h-6 text-brand-cyan" />
              <h2 id="chatbot-heading" className="font-bold text-lg text-gray-900 dark:text-brand-text">AI Assistant</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-brand-light hover:bg-gray-200 dark:hover:bg-brand-accent transition-colors" aria-label="Close chat">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-brand-accent flex items-center justify-center" aria-hidden="true"><BotIcon className="w-5 h-5 text-brand-cyan"/></div>}
              <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-cyan text-brand-primary' : 'bg-gray-100 text-gray-800 dark:bg-brand-primary dark:text-brand-text'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
              {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-brand-accent flex items-center justify-center" aria-hidden="true"><UserIcon className="w-5 h-5 text-gray-600 dark:text-brand-light"/></div>}
            </div>
          ))}
          {isLoading && (
              <div className="flex items-start gap-3" aria-label="AI is typing">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-brand-accent flex items-center justify-center" aria-hidden="true"><BotIcon className="w-5 h-5 text-brand-cyan"/></div>
                  <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-brand-primary">
                      <div className="flex items-center justify-center space-x-1">
                          <span className="w-2 h-2 bg-gray-400 dark:bg-brand-light rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                          <span className="w-2 h-2 bg-gray-400 dark:bg-brand-light rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                          <span className="w-2 h-2 bg-gray-400 dark:bg-brand-light rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                  </div>
              </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-brand-accent flex-shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1 bg-gray-100 dark:bg-brand-primary border-2 border-gray-300 dark:border-brand-accent rounded-lg p-2 text-sm text-gray-900 dark:text-brand-text placeholder-gray-400 dark:placeholder-brand-light resize-none focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all"
              rows={1}
              disabled={isLoading}
              aria-label="Chat message input"
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="p-2 bg-brand-cyan text-brand-primary rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-secondary focus:ring-brand-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Send message">
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const Chatbot = React.memo(ChatbotComponent);
