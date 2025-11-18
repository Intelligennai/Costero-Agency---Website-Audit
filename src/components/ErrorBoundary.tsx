import React, { Component, ErrorInfo, ReactNode } from 'react';
import { translations } from '../translations';
import { ServerCrashIcon } from './Icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: Initialize state in the constructor to ensure `this.props` is available.
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback to English for error boundary as context might not be available
      const t = translations.en; 
      
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-brand-primary font-sans flex items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-brand-secondary p-8 rounded-lg max-w-2xl mx-auto shadow-lg">
                <ServerCrashIcon className="w-16 h-16 text-brand-red mb-4" />
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">{t.error_boundary_title}</h1>
                <p className="text-gray-600 dark:text-brand-light mb-4">
                    {t.error_boundary_message}
                </p>
                {this.state.error && (
                    <div className="w-full mt-4 p-4 bg-gray-100 dark:bg-brand-primary rounded text-left text-sm text-gray-800 dark:text-brand-text overflow-auto">
                        <p className="font-bold mb-2">{t.error_boundary_details}</p>
                        <pre className="whitespace-pre-wrap break-words">
                            <code>
                                {this.state.error.toString()}
                            </code>
                        </pre>
                    </div>
                )}
                 <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-brand-cyan text-brand-primary font-bold rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-secondary focus:ring-brand-cyan transition-all"
                >
                    {t.error_boundary_reload}
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
