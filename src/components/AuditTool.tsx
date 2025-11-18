import React, { useState, useCallback, useEffect, lazy, Suspense, useRef, useContext } from 'react';
import { generateAuditReport, generateSalesPitch, createChatSession } from '../services/geminiService';
import type { AuditReportData, ChatMessage, PdfExportOptions, SavedAudit } from '../types';
import { GithubIcon, ServerCrashIcon } from './Icons';
import type { Chat } from '@google/genai';
import { useAuthContext } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { LanguageContext } from '../context/LanguageContext';
import type { TranslationKey } from '../translations';
import AuditForm from '../components/AuditForm';

// Lazy load components
const Report = lazy(() => import('./Report').then(module => ({ default: module.Report })));
const PitchGenerator = lazy(() => import('./PitchGenerator').then(module => ({ default: module.PitchGenerator })));
const CallNotes = lazy(() => import('./CallNotes').then(module => ({ default: module.CallNotes })));
const ChatbotTrigger = lazy(() => import('./ChatbotTrigger').then(module => ({ default: module.ChatbotTrigger })));
const Chatbot = lazy(() => import('./Chatbot').then(module => ({ default: module.Chatbot })));
const ReportSkeleton = lazy(() => import('./ReportSkeleton'));
const PdfExportModal = lazy(() => import('./PdfExportModal').then(module => ({ default: module.PdfExportModal })));

interface AuditToolProps {
  initialAudit?: SavedAudit;
  onNewAudit: () => void;
  onAuditSaved: (audit: SavedAudit) => void;
}


const AuditTool: React.FC<AuditToolProps> = ({ initialAudit, onNewAudit, onAuditSaved }) => {
  const { user } = useAuthContext();
  const t = useTranslations();
  const { language } = useContext(LanguageContext);
  
  const [url, setUrl] = useState<string>(initialAudit?.url || '');
  const [reportData, setReportData] = useState<AuditReportData | null>(initialAudit?.reportData || null);
  const [pitches, setPitches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPitchLoading, setIsPitchLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // Chatbot state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatbotLoading, setIsChatbotLoading] = useState(false);

  const agencyProfile = user?.agencyProfile;

  const handleAudit = useCallback(async (domain: string) => {
    if (!domain) {
      setError('audit_form_error_domain_required');
      return;
    }
    if (!agencyProfile) {
      setError('error_message_default'); // Should not happen if user flow is correct
      return;
    }
    setIsLoading(true);
    setError('');
    setReportData(null);
    setPitches([]);
    setUrl(domain);

    try {
      const data = await generateAuditReport(domain, agencyProfile, language);
      setReportData(data);
      const newAudit: SavedAudit = {
        id: Date.now().toString(),
        url: domain,
        reportData: data,
        createdAt: new Date().toISOString(),
      };
      onAuditSaved(newAudit);
    } catch (e) {
      console.error(e);
      setError((e as Error).message || 'error_message_default');
    } finally {
      setIsLoading(false);
    }
  }, [agencyProfile, language, onAuditSaved]);
  
  const handleGeneratePitch = useCallback(async () => {
    if (!reportData || !agencyProfile) return;
    setIsPitchLoading(true);
    setPitches([]);
    try {
      const generatedPitches = await generateSalesPitch(reportData, agencyProfile, language);
      setPitches(generatedPitches);
    } catch (e) {
      console.error(e);
      setError((e as Error).message || 'error_failed_pitch');
    } finally {
      setIsPitchLoading(false);
    }
  }, [reportData, agencyProfile, language]);
  
  useEffect(() => {
    if (reportData && agencyProfile && !chatSession.current) {
      const systemInstruction = t('chatbot_system_instruction', {
        agencyName: agencyProfile.name,
        services: agencyProfile.services.join(', ')
      });
      chatSession.current = createChatSession(systemInstruction);
      setChatMessages([
        { role: 'model', text: t('chatbot_initial_greeting', { url }) }
      ]);
    } else if (!reportData) {
        chatSession.current = null;
        setChatMessages([]);
        setIsChatbotOpen(false);
    }
  }, [reportData, url, agencyProfile, t]);
  
  const handleSendMessage = useCallback(async (message: string) => {
    if (!chatSession.current) return;

    setChatMessages(prev => [...prev, { role: 'user', text: message }]);
    setIsChatbotLoading(true);

    try {
        const response = await chatSession.current.sendMessage(message);
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

        const canvas = await html2canvas(reportElement, {
            scale: 2,
            useCORS: true,
            onclone: (clonedDoc) => {
                const content = clonedDoc.getElementById('report-content')!;
                // Ensure dark mode styles are applied for capture
                if (document.documentElement.classList.contains('dark')) {
                    content.style.backgroundColor = '#111827'; // brand-secondary
                } else {
                    content.style.backgroundColor = '#ffffff';
                }

                // Hide unchecked sections
                clonedDoc.querySelectorAll('[data-section-id]').forEach((el) => {
                    const sectionId = el.getAttribute('data-section-id');
                    if (sectionId && !options.selectedSections.includes(sectionId)) {
                        (el as HTMLElement).style.display = 'none';
                    }
                });

                clonedDoc.querySelectorAll('.no-print').forEach((node) => {
                    if (node instanceof HTMLElement) {
                        node.style.display = 'none';
                    }
                });
            },
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        
        // Add Header
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
            position -= (pageHeight - margin);
            pdf.addPage();
            pageCount++;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Add Footer to all pages
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(150);
            pdf.text(options.footerText, margin, pageHeight - 10);
            pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }


        const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        pdf.save(`Website-Audit-${cleanUrl}.pdf`);

    } catch (error) {
        console.error("Error generating PDF:", error);
        setError('error_pdf');
    } finally {
        setIsPdfGenerating(false);
        setIsPdfModalOpen(false);
    }
}, [url]);


  if (!agencyProfile) {
      return null; // Should be handled by App.tsx router
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-primary font-sans">
      <main className="container mx-auto p-4 md:p-8">
        {!reportData && (
          <header className="text-center mb-8 no-print max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-brand-text mb-2">{t('header_title', { agencyName: agencyProfile.name })}</h1>
            <p className="text-lg text-gray-600 dark:text-brand-light">{t('header_subtitle')}</p>
          </header>
        )}

        <div className="max-w-4xl mx-auto no-print">
            <AuditForm onAudit={handleAudit} isLoading={isLoading} />
        </div>

        {isLoading && (
          <Suspense fallback={null}>
            <ReportSkeleton />
          </Suspense>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center mt-12 bg-red-50 dark:bg-red-900/20 p-8 rounded-lg animate-fade-in border border-red-200 dark:border-red-500/30">
            <ServerCrashIcon className="w-16 h-16 text-brand-red mb-4" />
            <p className="text-xl font-semibold text-red-700 dark:text-red-400">{t('error_title')}</p>
            <p className="text-red-600 dark:text-red-300 max-w-md">{t(error as TranslationKey)}</p>
          </div>
        )}

        <Suspense fallback={isLoading ? null : <ReportSkeleton />}>
          {reportData && !isLoading && (
            <>
              <div id="report-content" className="mt-8 animate-fade-in print-container">
                <Report 
                  data={reportData} 
                  url={url} 
                  onPrintRequest={() => setIsPdfModalOpen(true)}
                />
                <PitchGenerator 
                  onGenerate={handleGeneratePitch} 
                  pitches={pitches} 
                  isLoading={isPitchLoading}
                />
                <CallNotes url={url} />
              </div>

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
            </>
          )}
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

export default AuditTool;