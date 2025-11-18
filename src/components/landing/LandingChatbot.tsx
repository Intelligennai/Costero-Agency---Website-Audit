import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { ChatMessage } from '../../types';
import type { Chat } from '@google/genai';
import { createChatSession } from '../../services/geminiService';
import { useTranslations } from '../../hooks/useTranslations';
import { Chatbot } from '../Chatbot';
import { ChatbotTrigger } from '../ChatbotTrigger';

const LandingChatbot: React.FC = () => {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const chatSession = useRef<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const systemInstruction = t('landing_chatbot_system_instruction');
        chatSession.current = createChatSession(systemInstruction);
        setMessages([{ role: 'model', text: t('landing_chatbot_initial_greeting') }]);
    }, [t]);

    const handleSendMessage = useCallback(async (message: string) => {
        if (!chatSession.current) return;

        setMessages(prev => [...prev, { role: 'user', text: message }]);
        setIsLoading(true);

        try {
            // FIX: sendMessage takes an object { message: string }
            const response = await chatSession.current.sendMessage({ message });
            const text = response.text;
            setMessages(prev => [...prev, { role: 'model', text }]);
        } catch (e) {
            console.error("Landing Chatbot error:", e);
            setMessages(prev => [...prev, { role: 'model', text: t('chatbot_error') }]);
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    return (
        <>
            <ChatbotTrigger onClick={() => setIsOpen(true)} />
            <Chatbot
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
            />
        </>
    );
};

export default LandingChatbot;