import React, { useState, useCallback, useEffect, lazy, Suspense, useRef, useContext } from 'react';
import { generateSalesPitch, createChatSession } from '../services/geminiService';
import type { ChatMessage, PdfExportOptions, SavedAudit } from '../types';
import { GithubIcon, ChevronLeftIcon } from './Icons';
import type { Chat } from '@google/genai';
import { useAuthContext } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { LanguageContext } from '../context/LanguageContext';

const Report = lazy(() => import('./Report').then(module => ({ default: module.Report })));
const PitchGenerator = lazy(() => import('./PitchGenerator').then(module => ({ default: module.PitchGenerator })));
const CallNotes = lazy(() => import('./CallNotes').then(module => ({ default: module.CallNotes })));
const ChatbotTrigger = lazy(() => import('./ChatbotTrigger').then(module => ({ default: module.ChatbotTrigger })));
const Chatbot = lazy(() => import('./Chatbot').then(module => ({ default: module.Chatbot })));
const PdfExportModal = lazy(() => import('./PdfExportModal').then(module => ({ default: module.PdfExportModal })));

interface AuditViewerProps {
  audit: SavedAudit;
  onReturnToDashboard: () => void;
}

const AuditViewer: React.FC<AuditViewerProps> = ({ audit, onReturnToDashboard }) => {
  const { agency } = useAuthContext();
  const t = useTranslations();
  const { language } = useContext(LanguageContext);
  
  const [pitches, setPitches] = useState<string[]>([]);
  const [isPitchLoading, setIsPitchLoading] = useState<boolean>(false);
  
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(audit.chatMessages || []);
  const [isChatbotLoading, setIsChatbotLoading] = useState(false);

  const agencyProfile = agency?.profile;
  const { url, reportData } = audit;

  const handleGeneratePitch = useCallback(async () => {
    if (!reportData || !agencyProfile) return;
    setIsPitchLoading(true);
    setPitches([]);
    try {
      const generatedPitches = await generateSalesPitch(reportData, agencyProfile, language);
      setPitches(generatedPitches);
    } catch (e) {
      console.error(e);
      alert(t('error_failed_pitch'));
    } finally {
      setIsPitchLoading(false);
    }
  }, [reportData, agencyProfile, language, t]);
  
  useEffect(() => {
    if (reportData && agencyProfile) {
        if (!chatSession.current) {
            const systemInstruction = t('chatbot_system_instruction', {
                agencyName: agencyProfile.name,
                services: agencyProfile.services.join(', ')
            });
            chatSession.current = createChatSession(systemInstruction);
            if (!chatMessages.length) {
                setChatMessages([
                    { role: 'model', text: t('chatbot_initial_greeting', { url }) }
                ]);
            }
        }
    }
  }, [reportData, url, agencyProfile, t, chatMessages.length]);
  
  const handleSendMessage = useCallback(async (message: string) => {
    if (!chatSession.current) return;

    setChatMessages(prev => [...prev, { role: 'user', text: message }]);
    setIsChatbotLoading(true);

    try {
        // FIX: sendMessage takes an object { message: string }
        const response = await chatSession.current.sendMessage({ message });
        const text = response.text;
        setChatMessages(prev => [...prev, { role: 'model', text }]);
    } catch (e) {
        console.error("Chatbot error:", e);
        setChatMessages(prev => [...prev, { role: 'model', text: t('chatbot_error') }]);
    } finally {
        setIsChatbotLoading(false);
    }
  }, [t]);

  const handleGeneratePdf = useCallback(async (options: PdfExportOptions) => {
    const reportElement = document.getElementById('report-content');
    if (!reportElement || !url) return;
    
    setIsPdfGenerating(true);

    try {
        const { default: html2canvas } = await import('html2canvas');
        const { default: jsPDF } = await import('jspdf');

        const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true,
            onclone: (clonedDoc) => {
                const content = clonedDoc.getElementById('report-content')!;
                if (document.documentElement.classList.contains('dark')) {
                    content.style.backgroundColor = '#111827';
                } else {
                    content.style.backgroundColor = '#ffffff';
                }
                clonedDoc.querySelectorAll('[data-section-id]').forEach((el) => {
                    const sectionId = el.getAttribute('data-section-id');
                    if (sectionId && !options.selectedSections.includes(sectionId)) {
                        (el as HTMLElement).style.display = 'none';
                    }
                });
            },
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        
        if (options.logo) {
            pdf.addImage(options.logo, 'PNG', margin, margin, 20, 20);
        }
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text(options.headerText, options.logo ? margin + 25 : margin, margin + 12);
        
        const contentStartY = margin + 30;

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, contentStartY, imgWidth, imgHeight);
        heightLeft -= (pageHeight - contentStartY);
        
        let pageCount = 1;
        while (heightLeft > 0) {
            position -= (pageHeight - margin * 2);
            pdf.addPage();
            pageCount++;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(150);
            pdf.text(options.footerText, margin, pageHeight - 10);
            pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }

        pdf.save(`Website-Audit-${url.replace(/^https?:\/\//, '')}.pdf`);

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert(t('error_pdf'));
    } finally {
        setIsPdfGenerating(false);
        setIsPdfModalOpen(false);
    }
}, [url, t]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-brand-primary font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto mb-4">
            <button onClick={onReturnToDashboard} className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-brand-light hover:text-brand-cyan dark:hover:text-brand-cyan transition-colors mb-4 no-print">
                <ChevronLeftIcon className="w-5 h-5" />
                {t('back_to_dashboard')}
            </button>
        </div>
        <Suspense fallback={<div>Loading Report...</div>}>
            <div className="max-w-4xl mx-auto">
                <div id="report-content" className="animate-fade-in print-container">
                    <Report 
                        data={reportData} 
                        url={url} 
                        onPrintRequest={() => setIsPdfModalOpen(true)}
                    />
                </div>
                <PitchGenerator 
                    onGenerate={handleGeneratePitch} 
                    pitches={pitches} 
                    isLoading={isPitchLoading}
                />
                <CallNotes url={url} />
                
                <ChatbotTrigger onClick={() => setIsChatbotOpen(true)} />
                
                <Chatbot
                    isOpen={isChatbotOpen}
                    onClose={() => setIsChatbotOpen(false)}
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    isLoading={isChatbotLoading}
                />

                <PdfExportModal 
                    isOpen={isPdfModalOpen}
                    onClose={() => setIsPdfModalOpen(false)}
                    onGenerate={handleGeneratePdf}
                    isGenerating={isPdfGenerating}
                    url={url}
                />
            </div>
        </Suspense>
      </main>
      <footer className="text-center p-4 mt-8 text-gray-500 dark:text-brand-light border-t border-gray-200 dark:border-brand-accent no-print">
        <a href="https://github.com/google-gemini-v2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-brand-cyan transition-colors">
          <GithubIcon className="w-5 h-5" />
          Powered by Gemini
        </a>
      </footer>
    </div>
  );
};

export default AuditViewer;