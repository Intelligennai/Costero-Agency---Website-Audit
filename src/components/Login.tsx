
import React, { useState, useEffect } from 'react';
import { LockIcon, LoaderIcon, UserIcon } from './Icons';

interface LoginProps {
  onLogin: (password: string) => void;
  onRegister: (email: string, password: string) => void;
  error: string;
  isLoading: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onRegister, error, isLoading }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  // Reset form state when mode changes or external error is cleared
  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFormError('');
  }, [mode]);
  
  useEffect(() => {
    setFormError(error);
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setFormError(''); // Clear previous errors

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setFormError("Passwords do not match.");
        return;
      }
      onRegister(email, password);
    } else {
      // For simplicity, the original login logic only used a password.
      // In a real app, this would use email and password.
      // We'll stick to the original requirement.
      onLogin(password);
    }
  };

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'login' ? 'register' : 'login');
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-brand-secondary rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-brand-text mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-500 dark:text-brand-light">
                {mode === 'login' ? 'Please enter the password to access the tool.' : 'Sign up to start auditing websites.'}
            </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
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
                  placeholder="Email address"
                  disabled={isLoading}
                />
              </div>
          )}

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
              placeholder="Password"
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
                placeholder="Confirm Password"
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
                  {mode === 'login' ? 'Authenticating...' : 'Creating Account...'}
                </>
              ) : (
                mode === 'login' ? 'Access Tool' : 'Create Account'
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-brand-light">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleMode} className="font-semibold text-brand-cyan hover:underline ml-1 focus:outline-none">
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>

      </div>
    </div>
  );
};