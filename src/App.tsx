
import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { AuditForm } from './components/AuditForm';
import { generateAuditReport, generateSalesPitch, createChatSession } from './services/geminiService';
import type { AuditReportData, ChatMessage } from './types';
import { GithubIcon, LoaderIcon, ServerCrashIcon } from './components/Icons';
import type { Chat } from '@google/genai';

const Report = lazy(() => import('./components/Report').then(module => ({ default: module.Report })));
const PitchGenerator = lazy(() => import('./components/PitchGenerator').then(module => ({ default: module.PitchGenerator })));
const CallNotes = lazy(() => import('./components/CallNotes').then(module => ({ default: module.CallNotes })));
const Chatbot = lazy(() => import('./components/Chatbot').then(module => ({ default: module.Chatbot })));
const ChatbotTrigger = lazy(() => import('./components/ChatbotTrigger').then(module => ({ default: module.ChatbotTrigger })));


const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [reportData, setReportData] = useState<AuditReportData | null>(null);
  const [pitches, setPitches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPitchLoading, setIsPitchLoading] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  
  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatbotLoading, setIsChatbotLoading] = useState(false);


  useEffect(() => {
    // Initialize the chat session and set a welcome message
    const session = createChatSession();
    setChatSession(session);
    setMessages([
      { role: 'model', text: "Hello! I'm the Outsource.dk AI assistant. How can I help you understand your website audit or our services?" }
    ]);
  }, []);

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
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleGeneratePitch = useCallback(async () => {
    if (!reportData) return;
    const existingPitches = pitches; // Preserve existing pitches in case of failure
    setIsPitchLoading(true);
    setError('');
    try {
      const generatedPitches = await generateSalesPitch(reportData);
      setPitches(generatedPitches);
    } catch (e) {
      console.error(e);
      setPitches(existingPitches); // Restore old pitches on error
       if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred while generating the pitch.');
      }
    } finally {
      setIsPitchLoading(false);
    }
  }, [reportData, pitches]);

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

  const handlePrint = useCallback(async () => {
    const reportElement = document.getElementById('report-content');
    if (!reportElement || !url) return;
    
    setIsPrinting(true);

    try {
        const { default: html2canvas } = await import('html2canvas');
        const { default: jsPDF } = await import('jspdf');

        const canvas = await html2canvas(reportElement, {
            scale: 2,
            backgroundColor: '#0D1B2A', // brand-primary color
            useCORS: true,
            onclone: (clonedDoc) => {
                clonedDoc.querySelectorAll('.no-print').forEach((node) => {
                    if (node instanceof HTMLElement) {
                        node.style.visibility = 'hidden';
                        node.style.display = 'none';
                    }
                });
                const clonedReportContent = clonedDoc.getElementById('report-content');
                if (clonedReportContent) {
                    clonedReportContent.style.animation = 'none';
                    const animatedChildren = clonedReportContent.querySelectorAll('[class*="animate-"]');
                    animatedChildren.forEach(child => {
                      if (child instanceof HTMLElement) {
                        child.style.animation = 'none';
                      }
                    });
                }
            },
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
            position = -heightLeft;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        pdf.save(`Website-Audit-${cleanUrl}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        setError("Sorry, there was an issue creating the PDF. Please try the browser's print function (Ctrl/Cmd + P).");
    } finally {
        setIsPrinting(false);
    }
}, [url]);

const handleSendMessage = useCallback(async (message: string) => {
    if (!chatSession || !message.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: message };
    setMessages(prev => [...prev, userMessage]);
    setIsChatbotLoading(true);

    try {
        const response = await chatSession.sendMessage({ message });
        const modelMessage: ChatMessage = { role: 'model', text: response.text };
        setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
        console.error("Chatbot error:", e);
        const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again in a moment." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsChatbotLoading(false);
    }
}, [chatSession]);


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
            <div id="report-content" className="mt-8 animate-fade-in print-container">
              <Report data={reportData} url={url} onPrint={handlePrint} isPrinting={isPrinting} />
              <PitchGenerator 
                onGenerate={handleGeneratePitch} 
                pitches={pitches} 
                isLoading={isPitchLoading}
              />
              <CallNotes url={url} />
            </div>
          )}
        </Suspense>
      </main>
      <footer className="text-center p-4 mt-8 text-brand-accent border-t border-brand-accent/20 no-print">
        <a href="https://github.com/google-gemini-v2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-brand-cyan transition-colors">
          <GithubIcon className="w-5 h-5" />
          Powered by Gemini
        </a>
      </footer>

      <Suspense fallback={null}>
        <div className="no-print">
          <Chatbot
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isChatbotLoading}
          />
          <ChatbotTrigger onClick={() => setIsChatOpen(true)} />
        </div>
      </Suspense>
    </div>
  );
};

export default App;
