import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { CloseIcon, CogIcon, LoaderIcon } from './Icons';
import type { BrandingSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  // FIX: Use 'agency' and 'updateAgency' from the context, not 'user' and 'updateUser'.
  const { agency, updateAgency, isLoading } = useAuthContext();
  const t = useTranslations();
  
  // FIX: Initialize state from the 'agency' object's branding.
  const [branding, setBranding] = useState<BrandingSettings>(agency?.branding || { logo: null });
  // FIX: Initialize preview from the 'agency' object's branding.
  const [logoPreview, setLogoPreview] = useState<string | null>(agency?.branding.logo || null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert(t('settings_modal_logo_too_large'));
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        setBranding(prev => ({ ...prev, logo: base64 }));
        setLogoPreview(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error converting logo to base64", error);
        alert(t('settings_modal_logo_error'));
      }
    }
  };

  const handleSave = async () => {
    // FIX: Call 'updateAgency' with the correct payload.
    await updateAgency({ branding });
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in no-print"
        onClick={onClose}
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="settings-modal-heading"
    >
        <div 
            className="w-full max-w-lg flex flex-col bg-white dark:bg-brand-secondary rounded-xl shadow-2xl animate-slide-in border border-gray-200 dark:border-brand-accent"
            onClick={(e) => e.stopPropagation()}
        >
            <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-brand-accent">
                <div className="flex items-center gap-3">
                    <CogIcon className="w-6 h-6 text-brand-cyan" />
                    <h2 id="settings-modal-heading" className="font-bold text-lg text-gray-900 dark:text-brand-text">{t('settings_modal_title')}</h2>
                </div>
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-brand-light hover:bg-gray-100 dark:hover:bg-brand-accent transition-colors" aria-label="Close settings">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <main className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 dark:text-brand-light">{t('settings_modal_branding_title')}</h3>
                    <div className="flex items-center gap-4">
                       <div className="flex-1">
                          <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-600 dark:text-brand-light mb-1">{t('settings_modal_logo_label')}</label>
                           <input
                              id="logoUpload"
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={handleLogoChange}
                              className="text-sm text-gray-500 dark:text-brand-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-cyan/20 file:text-brand-cyan hover:file:bg-brand-cyan/30"
                            />
                            <p className="text-xs text-gray-400 dark:text-brand-light/70 mt-1">{t('settings_modal_logo_limit')}</p>
                       </div>
                       {logoPreview && <img src={logoPreview} alt="Logo Preview" className="h-16 w-16 object-contain bg-gray-200 dark:bg-brand-accent rounded-md p-1" />}
                    </div>
                </div>
            </main>
            
            <footer className="flex items-center justify-end p-4 border-t border-gray-200 dark:border-brand-accent gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-brand-text bg-gray-200 dark:bg-brand-accent rounded-md hover:bg-opacity-80 transition-colors">
                    {t('settings_modal_close_button')}
                </button>
                 <button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-semibold text-brand-primary bg-brand-cyan rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <LoaderIcon className="w-5 h-5 animate-spin" />
                            {t('settings_modal_saving_button')}
                        </>
                    ) : t('settings_modal_save_button')}
                 </button>
            </footer>
        </div>
    </div>
  );
};

export default SettingsModal;