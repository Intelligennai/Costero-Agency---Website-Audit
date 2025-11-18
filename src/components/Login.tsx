import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { LockIcon, LoaderIcon, UserIcon, CloseIcon } from './Icons';
import type { TranslationKey } from '../translations';

interface LoginProps {
    mode: 'login' | 'register';
    onToggleMode: () => void;
    onShowLanding: () => void;
}

export const Login: React.FC<LoginProps> = ({ mode, onToggleMode, onShowLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { login, register, error, isLoading } = useAuth();
  const t = useTranslations();

  // Reset form state when mode changes
  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFormError('');
  }, [mode]);
  
  // Display auth hook errors
  useEffect(() => {
    if (error) {
        setFormError(t(error as TranslationKey));
    }
  }, [error, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setFormError(''); // Clear previous errors

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setFormError(t('login_passwords_no_match'));
        return;
      }
      register(email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-brand-primary p-4 animate-fade-in">
       <button onClick={onShowLanding} className="absolute top-4 right-4 p-2 rounded-full text-gray-500 dark:text-brand-light hover:bg-gray-100 dark:hover:bg-brand-accent transition-colors" aria-label="Close">
            <CloseIcon className="w-6 h-6" />
        </button>
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-brand-secondary rounded-xl shadow-lg border border-gray-200 dark:border-brand-accent">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-brand-text mb-2">
                {mode === 'login' ? t('login_welcome_back') : t('login_create_account')}
            </h1>
            <p className="text-gray-500 dark:text-brand-light">
                {mode === 'login' ? t('login_enter_password_prompt') : t('login_signup_prompt')}
            </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
             <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400 dark:text-brand-light" />
                 </div>
                 <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-brand-primary border-2 border-gray-300 dark:border-brand-accent rounded-lg text-gray-900 dark:text-brand-text placeholder-gray-400 dark:placeholder-brand-light focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all disabled:opacity-70"
                  placeholder={t('login_email_placeholder')}
                  disabled={isLoading}
                />
              </div>

          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400 dark:text-brand-light" />
             </div>
             <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === 'login' ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-brand-primary border-2 border-gray-300 dark:border-brand-accent rounded-lg text-gray-900 dark:text-brand-text placeholder-gray-400 dark:placeholder-brand-light focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all disabled:opacity-70"
              placeholder={t('login_password_placeholder')}
              disabled={isLoading}
            />
          </div>

          {mode === 'register' && (
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400 dark:text-brand-light" />
               </div>
               <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-brand-primary border-2 border-gray-300 dark:border-brand-accent rounded-lg text-gray-900 dark:text-brand-text placeholder-gray-400 dark:placeholder-brand-light focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all disabled:opacity-70"
                placeholder={t('login_confirm_password_placeholder')}
                disabled={isLoading}
              />
            </div>
          )}

          {formError && (
            <p className="text-sm text-brand-red text-center animate-fade-in">{formError}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-brand-primary bg-brand-cyan hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-secondary focus:ring-brand-cyan transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="w-5 h-5 animate-spin mr-2" />
                  {mode === 'login' ? t('login_authenticating') : t('login_creating_account')}
                </>
              ) : (
                mode === 'login' ? t('login_access_tool') : t('login_create_account')
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-brand-light">
          {mode === 'login' ? t('login_no_account') : t('login_already_have_account')}
          <button onClick={onToggleMode} disabled={isLoading} className="font-semibold text-brand-cyan hover:underline ml-1 focus:outline-none disabled:opacity-50">
            {mode === 'login' ? t('login_sign_up') : t('login_log_in')}
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;