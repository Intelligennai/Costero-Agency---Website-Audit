import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { LoaderIcon, PlusIcon, TrashIcon, UserIcon } from './Icons';
import type { TranslationKey } from '../translations';

const TeamManagement: React.FC = () => {
    const { agency, inviteMember, removeMember } = useAuthContext();
    const t = useTranslations();
    const [inviteEmail, setInviteEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;
        
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            await inviteMember(inviteEmail);
            setSuccessMessage(t('team_invite_success', { email: inviteEmail }));
            setInviteEmail('');
        } catch (err: any) {
            setError(t((err.message || 'team_invite_error_generic') as TranslationKey));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (email: string) => {
        if (window.confirm(t('team_remove_confirm', { email }))) {
            setIsLoading(true);
            setError('');
            setSuccessMessage('');
            try {
                await removeMember(email);
                setSuccessMessage(t('team_remove_success', { email }));
            } catch (err: any) {
                setError(t((err.message || 'team_remove_error_generic') as TranslationKey));
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-gray-700 dark:text-brand-light mb-4">{t('team_invite_title')}</h3>
                <form onSubmit={handleInvite} className="flex flex-col sm:flex-row items-start gap-3">
                    <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder={t('team_invite_placeholder')}
                        required
                        className="flex-grow w-full px-3 py-2 bg-gray-50 dark:bg-brand-primary border border-gray-300 dark:border-brand-accent rounded-md text-gray-900 dark:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inviteEmail}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-brand-primary bg-brand-cyan rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
                    >
                        {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <PlusIcon className="w-5 h-5" />}
                        {t('team_invite_button')}
                    </button>
                </form>
                 {error && <p className="text-sm text-brand-red mt-2">{error}</p>}
                 {successMessage && <p className="text-sm text-brand-green mt-2">{successMessage}</p>}
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 dark:text-brand-light mb-4">{t('team_members_title')}</h3>
                <ul className="space-y-3">
                    {agency?.members.map(member => (
                        <li key={member.email} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-brand-primary rounded-md border border-gray-200 dark:border-brand-accent">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-brand-accent flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 text-gray-600 dark:text-brand-light"/>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-brand-text">{member.email}</p>
                                    <span className="text-xs font-medium uppercase px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan">{member.role}</span>
                                </div>
                            </div>
                            {member.role !== 'admin' && (
                                <button 
                                    onClick={() => handleRemove(member.email)}
                                    disabled={isLoading}
                                    className="p-2 text-gray-500 dark:text-brand-light hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-brand-red dark:hover:text-red-400 rounded-md transition-colors disabled:opacity-50"
                                    title={t('team_remove_button_tooltip')}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TeamManagement;
