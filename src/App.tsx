
import React, { useState, useCallback, useEffect, lazy, Suspense, useRef } from 'react';
import { AuditForm } from './components/AuditForm';
import { generateAuditReport, generateSalesPitch, createChatSession } from './services/geminiService';
import type { AuditReportData, PdfExportOptions, ChatMessage } from './types';
import { GithubIcon, LoaderIcon, ServerCrashIcon } from './components/Icons';
import type { Chat } from '@google/genai';

const Report = lazy(() => import('./components/Report').then(module => ({ default: module.Report })));
const PitchGenerator = lazy(() => import('./components/PitchGenerator').then(module => ({ default: module.PitchGenerator })));
const CallNotes = lazy(() => import('./components/CallNotes').then(module => ({ default: module.CallNotes })));
const PdfExportModal = lazy(() => import('./components/PdfExportModal').then(module => ({ default: module.PdfExportModal })));
const ChatbotTrigger = lazy(() => import('./components/ChatbotTrigger').then(module => ({ default: module.ChatbotTrigger })));
const Chatbot = lazy(() => import('./components/Chatbot').then(module => ({ default: module.Chatbot })));


const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [reportData, setReportData] = useState<AuditReportData | null>(null);
  const [pitches, setPitches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPitchLoading, setIsPitchLoading] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Chatbot state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatbotLoading, setIsChatbotLoading] = useState(false);

  const loadingMessages = [
    "Connecting to the AI model...",
    "Analyzing website design and user experience...",
    "Performing technical SEO audit...",
    "Evaluating digital marketing presence...",
    "Assessing content and communication strategy...",
    "Scanning for AI & Automation opportunities...",
    "Compiling the final audit report...",
  ];

  const handleAudit = useCallback(async (domain: string) => {
    if (!domain) {
      setError('Please enter a website URL.');
      return;
    }
    setIsLoading(true);
    setError('');
    setReportData(null);
    setPitches([]);
    setUrl(domain);

    try {
      const data = await generateAuditReport(domain);
      setReportData(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to generate audit report. The AI model may be overloaded. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleGeneratePitch = useCallback(async () => {
    if (!reportData) return;
    setIsPitchLoading(true);
    setPitches([]);
    try {
      const generatedPitches = await generateSalesPitch(reportData);
      setPitches(generatedPitches);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to generate sales pitch. Please try again.');
    } finally {
      setIsPitchLoading(false);
    }
  }, [reportData]);

  useEffect(() => {
    let interval: number | undefined;
    if (isLoading) {
      let i = 0;
      setLoadingMessage(loadingMessages[0]);
      interval = window.setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[i]);
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // Effect to initialize or reset chat session based on report data
  useEffect(() => {
    if (reportData && !chatSession.current) {
      chatSession.current = createChatSession();
      setChatMessages([
        { role: 'model', text: `Hi! I'm your AI assistant. How can I help you with the audit report for ${url}?` }
      ]);
    } else if (!reportData) {
        chatSession.current = null;
        setChatMessages([]);
    }
  }, [reportData, url]);
  
  const handleSendMessage = useCallback(async (message: string) => {
    if (!chatSession.current) return;

    setChatMessages(prev => [...prev, { role: 'user', text: message }]);
    setIsChatbotLoading(true);

    try {
        // FIX: The `sendMessage` method expects a string, not an object.
        const response = await chatSession.current.sendMessage(message);
        const text = response.text;
        setChatMessages(prev => [...prev, { role: 'model', text }]);
    } catch (e) {
        console.error("Chatbot error:", e);
        setChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
        setIsChatbotLoading(false);
    }
  }, []);

 const handleGeneratePdf = useCallback(async (options: PdfExportOptions) => {
    const reportElement = document.getElementById('report-content');
    if (!reportElement || !url) return;

    setIsPdfModalOpen(false);
    setIsPrinting(true);

    const allSections = Array.from(reportElement.querySelectorAll('[data-section-id]')) as HTMLElement[];
    const sectionsToHide: HTMLElement[] = [];
    
    allSections.forEach(el => {
        const sectionId = el.dataset.sectionId;
        if (sectionId && !options.selectedSections.includes(sectionId)) {
            sectionsToHide.push(el);
            el.style.display = 'none';
        }
    });

    try {
        const { default: html2canvas } = await import('html2canvas');
        const { default: jsPDF } = await import('jspdf');

        const canvas = await html2canvas(reportElement, {
            scale: 2,
            backgroundColor: '#0D1B2A',
            useCORS: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        const totalPages = Math.ceil(imgHeight / pdfHeight);

        const addHeaderAndFooter = (pageNumber: number) => {
            const margin = 15;
            if (options.logo) {
                try {
                    pdf.addImage(options.logo, 'PNG', margin, margin - 10, 20, 20, undefined, 'FAST');
                } catch (e) { console.error("Error adding logo to PDF:", e); }
            }
            pdf.setFontSize(14);
            pdf.setTextColor('#E0E1DD');
            pdf.text(options.headerText, options.logo ? margin + 25 : margin, margin);

            pdf.setFontSize(8);
            pdf.text(options.footerText, margin, pdfHeight - margin + 5);
            const pageStr = `Page ${pageNumber} of ${totalPages}`;
            const pageStrWidth = pdf.getStringUnitWidth(pageStr) * pdf.getFontSize() / pdf.internal.scaleFactor;
            pdf.text(pageStr, pdfWidth - margin - pageStrWidth, pdfHeight - margin + 5);
        };

        for (let i = 0; i < totalPages; i++) {
            if (i > 0) pdf.addPage();
            addHeaderAndFooter(i + 1);
            position = -(pdfHeight * i);
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        }

        const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        pdf.save(`Website-Audit-${cleanUrl}.pdf`);

    } catch (error) {
        console.error("Error generating PDF:", error);
        setError("Sorry, there was an issue creating the PDF. Please try again.");
    } finally {
        sectionsToHide.forEach(el => el.style.display = '');
        setIsPrinting(false);
    }
}, [url]);


  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 no-print">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-text mb-2">Website Audit for Outsource.dk</h1>
          <p className="text-lg text-brand-light">Enter a domain to generate a comprehensive, data-driven analysis for your sales pitch.</p>
        </header>

        <div className="max-w-4xl mx-auto no-print">
          <AuditForm onAudit={handleAudit} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center mt-12 animate-fade-in">
            <LoaderIcon className="w-16 h-16 animate-spin text-brand-cyan" />
            <p className="mt-4 text-xl font-semibold">Analyzing {url}...</p>
            <p className="text-brand-light w-full max-w-md h-6 transition-all duration-300">{loadingMessage}</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center mt-12 bg-brand-secondary p-8 rounded-lg animate-fade-in">
            <ServerCrashIcon className="w-16 h-16 text-brand-red mb-4" />
            <p className="text-xl font-semibold text-red-400">An Error Occurred</p>
            <p className="text-brand-light max-w-md">{error}</p>
          </div>
        )}

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center text-center mt-12 animate-fade-in">
            <LoaderIcon className="w-16 h-16 animate-spin text-brand-cyan" />
            <p className="mt-4 text-xl font-semibold">Loading Report...</p>
          </div>
        }>
          {reportData && !isLoading && (
            <>
              <div id="report-content" className="mt-8 animate-fade-in print-container">
                <Report data={reportData} url={url} onPrint={() => setIsPdfModalOpen(true)} isPrinting={isPrinting} />
                <div data-section-id="pitchGenerator">
                    <PitchGenerator 
                        onGenerate={handleGeneratePitch} 
                        pitches={pitches} 
                        isLoading={isPitchLoading}
                    />
                </div>
                <div data-section-id="callNotes">
                    <CallNotes url={url} />
                </div>
              </div>
              <PdfExportModal 
                isOpen={isPdfModalOpen}
                onClose={() => setIsPdfModalOpen(false)}
                onGenerate={handleGeneratePdf}
                url={url}
                isGenerating={isPrinting}
              />
               <ChatbotTrigger onClick={() => setIsChatbotOpen(true)} />
               <Chatbot
                  isOpen={isChatbotOpen}
                  onClose={() => setIsChatbotOpen(false)}
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  isLoading={isChatbotLoading}
                />
            </>
          )}
        </Suspense>
      </main>
      <footer className="text-center p-4 mt-8 text-brand-accent border-t border-brand-accent/20 no-print">
        <a href="https://github.com/google-gemini-v2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-brand-cyan transition-colors">
          <GithubIcon className="w-5 h-5" />
          Powered by Gemini
        </a>
      </footer>
    </div>
  );
};

export default App;
