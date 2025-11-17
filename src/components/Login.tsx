
import React, { useState } from 'react';
import { LockIcon } from './Icons';

interface LoginProps {
  onLogin: (password: string) => void;
  error: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-brand-secondary rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-brand-text mb-2">Website Audit Tool</h1>
            <p className="text-brand-light">Please enter the password to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-brand-light" />
             </div>
             <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-brand-primary border-2 border-brand-accent rounded-lg text-brand-text placeholder-brand-light focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all"
              placeholder="Password"
            />
          </div>

          {error && (
            <p className="text-sm text-brand-red text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-brand-primary bg-brand-cyan hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-cyan transition-all"
            >
              Access Tool
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
