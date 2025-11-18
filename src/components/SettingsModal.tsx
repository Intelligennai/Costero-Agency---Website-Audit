
import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { CloseIcon, CogIcon, LoaderIcon, FeatureBrandingIcon, UserIcon } from './Icons';
import type { BrandingSettings } from '../types';
import TeamManagement from './TeamManagement';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'branding' | 'team';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { agency, updateAgency, isLoading } = useAuthContext();
  const t = useTranslations();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('branding');
  const [branding, setBranding] = useState<BrandingSettings>(agency?.branding || { logo: null });
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
            className="w-full max-w-4xl flex flex-col bg-white dark:bg-brand-secondary rounded-xl shadow-2xl animate-slide-in border border-gray-200 dark:border-brand-accent overflow-hidden max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-brand-accent bg-gray-50 dark:bg-brand-primary">
                <div className="flex items-center gap-3">
                    <CogIcon className="w-6 h-6 text-brand-cyan" />
                    <h2 id="settings-modal-heading" className="font-bold text-lg text-gray-900 dark:text-brand-text">{t('settings_modal_title')}</h2>
                </div>
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-brand-light hover:bg-gray-200 dark:hover:bg-brand-accent transition-colors" aria-label="Close settings">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <nav className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 dark:border-brand-accent bg-gray-50/50 dark:bg-brand-secondary overflow-y-auto">
                    <ul className="p-2 space-y-1">
                        <li>
                            <button
                                onClick={() => setActiveTab('branding')}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    activeTab === 'branding'
                                        ? 'bg-brand-cyan/10 text-brand-cyan dark:text-brand-cyan'
                                        : 'text-gray-600 dark:text-brand-light hover:bg-gray-100 dark:hover:bg-brand-accent'
                                }`}
                            >
                                <FeatureBrandingIcon className="w-5 h-5" />
                                {t('settings_modal_branding_title')}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('team')}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    activeTab === 'team'
                                        ? 'bg-brand-cyan/10 text-brand-cyan dark:text-brand-cyan'
                                        : 'text-gray-600 dark:text-brand-light hover:bg-gray-100 dark:hover:bg-brand-accent'
                                }`}
                            >
                                <UserIcon className="w-5 h-5" />
                                {t('team_members_title')}
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* Main Content Area */}
                <main className="flex-1 p-6 overflow-y-auto bg-white dark:bg-brand-primary">
                    {activeTab === 'branding' && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('settings_modal_branding_title')}</h3>
                                <p className="text-sm text-gray-500 dark:text-brand-light mb-6">Customize your reports with your agency's logo.</p>
                                
                                <div className="flex flex-col sm:flex-row items-start gap-6">
                                    <div className="flex-1 w-full">
                                        <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-700 dark:text-brand-text mb-2">{t('settings_modal_logo_label')}</label>
                                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-brand-accent border-dashed rounded-md hover:bg-gray-50 dark:hover:bg-brand-secondary transition-colors">
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-gray-600 dark:text-brand-light justify-center">
                                                    <label htmlFor="logoUpload" className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-brand-cyan hover:text-brand-600 focus-within:outline-none">
                                                        <span>Upload a file</span>
                                                        <input id="logoUpload" name="logoUpload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleLogoChange} />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings_modal_logo_limit')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className="block text-sm font-medium text-gray-700 dark:text-brand-text mb-2">Preview</span>
                                        <div className="h-32 w-32 rounded-lg border border-gray-200 dark:border-brand-accent bg-gray-50 dark:bg-brand-secondary flex items-center justify-center overflow-hidden">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                                            ) : (
                                                <span className="text-gray-400 text-xs">No Logo</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'team' && (
                         <div className="animate-fade-in">
                            <TeamManagement />
                        </div>
                    )}
                </main>
            </div>
            
            {/* Footer */}
            <footer className="flex items-center justify-end p-4 border-t border-gray-200 dark:border-brand-accent bg-gray-50 dark:bg-brand-primary gap-3">
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
