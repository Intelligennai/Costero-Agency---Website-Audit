
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(e);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-5 w-full max-w-sm h-[60vh] flex flex-col bg-brand-secondary rounded-xl shadow-2xl z-50 animate-fade-in">
      <header className="flex items-center justify-between p-4 border-b border-brand-accent">
        <div className="flex items-center gap-3">
            <BotIcon className="w-6 h-6 text-brand-cyan" />
            <h2 className="font-bold text-lg text-brand-text">AI Assistant</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-full text-brand-light hover:bg-brand-accent transition-colors" aria-label="Close chat">
          <CloseIcon className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center"><BotIcon className="w-5 h-5 text-brand-cyan"/></div>}
            <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-cyan text-brand-primary' : 'bg-brand-primary'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center"><UserIcon className="w-5 h-5 text-brand-light"/></div>}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center"><BotIcon className="w-5 h-5 text-brand-cyan"/></div>
                <div className="max-w-[80%] p-3 rounded-lg bg-brand-primary">
                    <div className="flex items-center justify-center space-x-1">
                        <span className="w-2 h-2 bg-brand-light rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                        <span className="w-2 h-2 bg-brand-light rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-brand-light rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-brand-accent">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className="flex-1 bg-brand-primary border-2 border-brand-accent rounded-lg p-2 text-sm text-brand-text placeholder-brand-light resize-none focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all"
            rows={1}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="p-2 bg-brand-cyan text-brand-primary rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export const Chatbot = React.memo(ChatbotComponent);
