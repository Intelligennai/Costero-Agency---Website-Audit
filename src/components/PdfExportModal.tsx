
import React, { useState } from 'react';
import type { PdfExportOptions } from '../types';
import { CloseIcon, CogIcon, LoaderIcon } from './Icons';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: PdfExportOptions) => void;
  url: string;
  isGenerating: boolean;
}

const allSections = [
  { id: 'summary', label: 'Executive Summary' },
  { id: 'overallPotential', label: 'Overall Potential' },
  { id: 'websiteUx', label: 'Hjemmeside & UX' },
  { id: 'seo', label: 'SEO' },
  { id: 'digitalMarketingPresence', label: 'Digital Marketing' },
  { id: 'contentCommunication', label: 'Indhold & Kommunikation' },
  { id: 'aiAutomation', label: 'AI & Automation' },
  { id: 'advertisingOptimization', label: 'Annoncering & Optimering' },
  { id: 'googleMyBusiness', label: 'Google My Business' },
  { id: 'pitchGenerator', label: 'Auto-Pitch Generator' },
  { id: 'callNotes', label: 'Call Notes' },
];

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const PdfExportModalComponent: React.FC<PdfExportModalProps> = ({ isOpen, onClose, onGenerate, url, isGenerating }) => {
  const [selectedSections, setSelectedSections] = useState<string[]>(() => 
    allSections.filter(s => !['pitchGenerator', 'callNotes'].includes(s.id)).map(s => s.id)
  );
  const [headerText, setHeaderText] = useState(`Website Audit Report for ${url}`);
  const [footerText, setFooterText] = useState('Prepared by Outsource.dk');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleSectionChange = (sectionId: string) => {
    setSelectedSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("Logo file is too large. Please use an image under 2MB.");
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        setLogo(base64);
        setLogoPreview(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error converting logo to base64", error);
        alert("There was an error processing the logo file.");
      }
    }
  };

  const handleGenerateClick = () => {
    onGenerate({
      selectedSections,
      headerText,
      footerText,
      logo
    });
  };
  
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in no-print"
        onClick={onClose}
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="pdf-modal-heading"
    >
        <div 
            className="w-full max-w-2xl flex flex-col bg-brand-secondary rounded-xl shadow-2xl animate-slide-in"
            onClick={(e) => e.stopPropagation()}
        >
            <header className="flex items-center justify-between p-4 border-b border-brand-accent">
                <div className="flex items-center gap-3">
                    <CogIcon className="w-6 h-6 text-brand-cyan" />
                    <h2 id="pdf-modal-heading" className="font-bold text-lg text-brand-text">Customize PDF Export</h2>
                </div>
                <button onClick={onClose} className="p-1 rounded-full text-brand-light hover:bg-brand-accent transition-colors" aria-label="Close settings">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <main className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                <div>
                    <h3 className="font-semibold text-brand-light mb-3">Include Sections in PDF</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {allSections.map(section => (
                            <label key={section.id} className="flex items-center gap-2 text-sm text-brand-text cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedSections.includes(section.id)}
                                    onChange={() => handleSectionChange(section.id)}
                                    className="h-4 w-4 rounded border-brand-accent bg-brand-primary text-brand-cyan focus:ring-brand-cyan focus:ring-offset-brand-secondary"
                                />
                                {section.label}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-brand-accent">
                    <h3 className="font-semibold text-brand-light">Branding Options</h3>
                    <div>
                        <label htmlFor="headerText" className="block text-sm font-medium text-brand-light mb-1">Header Text</label>
                        <input
                            id="headerText"
                            type="text"
                            value={headerText}
                            onChange={e => setHeaderText(e.target.value)}
                            className="w-full px-3 py-2 bg-brand-primary border border-brand-accent rounded-md text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                        />
                    </div>
                     <div>
                        <label htmlFor="footerText" className="block text-sm font-medium text-brand-light mb-1">Footer Text</label>
                        <input
                            id="footerText"
                            type="text"
                            value={footerText}
                            onChange={e => setFooterText(e.target.value)}
                            className="w-full px-3 py-2 bg-brand-primary border border-brand-accent rounded-md text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                       <div>
                          <label htmlFor="logoUpload" className="block text-sm font-medium text-brand-light mb-1">Company Logo (Optional)</label>
                           <input
                              id="logoUpload"
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={handleLogoChange}
                              className="text-sm text-brand-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-cyan/20 file:text-brand-cyan hover:file:bg-brand-cyan/30"
                            />
                       </div>
                       {logoPreview && <img src={logoPreview} alt="Logo Preview" className="h-12 w-12 object-contain bg-brand-accent rounded-md p-1" />}
                    </div>
                </div>

            </main>
            
            <footer className="flex items-center justify-end p-4 border-t border-brand-accent gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-brand-text bg-brand-accent rounded-md hover:bg-opacity-80 transition-colors">
                    Cancel
                </button>
                 <button 
                    onClick={handleGenerateClick}
                    disabled={isGenerating}
                    className="px-4 py-2 text-sm font-semibold text-brand-primary bg-brand-cyan rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <LoaderIcon className="w-5 h-5 animate-spin" />
                            Generating...
                        </>
                    ) : 'Generate PDF'}
                 </button>
            </footer>
        </div>
    </div>
  )
};

export const PdfExportModal = React.memo(PdfExportModalComponent);
