import React, { useState, useEffect } from 'react';
import type { PdfExportOptions } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { useAuthContext } from '../hooks/useAuth';
import { CloseIcon, CogIcon, LoaderIcon } from './Icons';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: PdfExportOptions) => void;
  url: string;
  isGenerating: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const PdfExportModalComponent: React.FC<PdfExportModalProps> = ({ isOpen, onClose, onGenerate, url, isGenerating }) => {
  const t = useTranslations();
  const { user } = useAuthContext();
  const agencyName = user?.agencyProfile?.name || 'Your Agency';

  const allSections = [
    { id: 'summary', label: t('pdf_section_summary') },
    { id: 'overallPotential', label: t('pdf_section_potential') },
    { id: 'websiteUx', label: t('pdf_section_ux') },
    { id: 'seo', label: t('pdf_section_seo') },
    { id: 'digitalMarketingPresence', label: t('pdf_section_marketing') },
    { id: 'contentCommunication', label: t('pdf_section_content') },
    { id: 'aiAutomation', label: t('pdf_section_ai') },
    { id: 'advertisingOptimization', label: t('pdf_section_advertising') },
    { id: 'googleMyBusiness', label: t('pdf_section_gmb') },
    { id: 'pitchGenerator', label: t('pdf_section_pitch') },
    { id: 'callNotes', label: t('pdf_section_notes') },
  ];

  const [selectedSections, setSelectedSections] = useState<string[]>(() => 
    allSections.filter(s => !['pitchGenerator', 'callNotes'].includes(s.id)).map(s => s.id)
  );
  
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  useEffect(() => {
    if(user) {
        setHeaderText(t('pdf_modal_default_header', { url }));
        setFooterText(t('pdf_modal_default_footer', { agencyName }));
        setLogo(user.branding.logo);
        setLogoPreview(user.branding.logo);
    }
  }, [isOpen, user, url, agencyName, t]);


  const handleSectionChange = (sectionId: string) => {
    setSelectedSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert(t('settings_modal_logo_too_large'));
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        setLogo(base64);
        setLogoPreview(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error converting logo to base64", error);
        alert(t('settings_modal_logo_error'));
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
            className="w-full max-w-2xl flex flex-col bg-white dark:bg-brand-secondary rounded-xl shadow-2xl animate-slide-in border border-gray-200 dark:border-brand-accent"
            onClick={(e) => e.stopPropagation()}
        >
            <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-brand-accent">
                <div className="flex items-center gap-3">
                    <CogIcon className="w-6 h-6 text-brand-cyan" />
                    <h2 id="pdf-modal-heading" className="font-bold text-lg text-gray-900 dark:text-brand-text">{t('pdf_modal_title')}</h2>
                </div>
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-brand-light hover:bg-gray-100 dark:hover:bg-brand-accent transition-colors" aria-label="Close settings">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <main className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                <div>
                    <h3 className="font-semibold text-gray-700 dark:text-brand-light mb-3">{t('pdf_modal_sections_title')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {allSections.map(section => (
                            <label key={section.id} className="flex items-center gap-2 text-sm text-gray-800 dark:text-brand-text cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedSections.includes(section.id)}
                                    onChange={() => handleSectionChange(section.id)}
                                    className="h-4 w-4 rounded border-gray-300 dark:border-brand-accent bg-gray-100 dark:bg-brand-primary text-brand-cyan focus:ring-brand-cyan focus:ring-offset-white dark:focus:ring-offset-brand-secondary"
                                />
                                {section.label}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-brand-accent">
                    <h3 className="font-semibold text-gray-700 dark:text-brand-light">{t('pdf_modal_branding_title')}</h3>
                    <div>
                        <label htmlFor="headerText" className="block text-sm font-medium text-gray-600 dark:text-brand-light mb-1">{t('pdf_modal_header_label')}</label>
                        <input
                            id="headerText"
                            type="text"
                            value={headerText}
                            onChange={e => setHeaderText(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-brand-primary border border-gray-300 dark:border-brand-accent rounded-md text-gray-900 dark:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                        />
                    </div>
                     <div>
                        <label htmlFor="footerText" className="block text-sm font-medium text-gray-600 dark:text-brand-light mb-1">{t('pdf_modal_footer_label')}</label>
                        <input
                            id="footerText"
                            type="text"
                            value={footerText}
                            onChange={e => setFooterText(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-brand-primary border border-gray-300 dark:border-brand-accent rounded-md text-gray-900 dark:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                       <div>
                          <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-600 dark:text-brand-light mb-1">{t('pdf_modal_logo_label')}</label>
                           <input
                              id="logoUpload"
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={handleLogoChange}
                              className="text-sm text-gray-500 dark:text-brand-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-cyan/20 file:text-brand-cyan hover:file:bg-brand-cyan/30"
                            />
                       </div>
                       {logoPreview && <img src={logoPreview} alt="Logo Preview" className="h-12 w-12 object-contain bg-gray-200 dark:bg-brand-accent rounded-md p-1" />}
                    </div>
                </div>

            </main>
            
            <footer className="flex items-center justify-end p-4 border-t border-gray-200 dark:border-brand-accent gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-brand-text bg-gray-200 dark:bg-brand-accent rounded-md hover:bg-opacity-80 transition-colors">
                    {t('pdf_modal_cancel_button')}
                </button>
                 <button 
                    onClick={handleGenerateClick}
                    disabled={isGenerating}
                    className="px-4 py-2 text-sm font-semibold text-brand-primary bg-brand-cyan rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <LoaderIcon className="w-5 h-5 animate-spin" />
                            {t('pdf_modal_generating_button')}
                        </>
                    ) : t('pdf_modal_generate_button')}
                 </button>
            </footer>
        </div>
    </div>
  )
};

export const PdfExportModal = React.memo(PdfExportModalComponent);