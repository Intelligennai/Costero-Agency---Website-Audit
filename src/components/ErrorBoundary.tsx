import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ServerCrashIcon } from './Icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  // Using a constructor for state initialization to ensure `this.props` is correctly typed.
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  // FIX: Removed explicit public modifier.
  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  // FIX: Removed explicit public modifier.
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  // FIX: Removed explicit public modifier.
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-brand-primary font-sans flex items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-brand-secondary p-8 rounded-lg max-w-2xl mx-auto shadow-lg">
                <ServerCrashIcon className="w-16 h-16 text-brand-red mb-4" />
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Something went wrong.</h1>
                <p className="text-gray-600 dark:text-brand-light mb-4">
                    The application encountered a critical error. This is often caused by a missing API key in the Vercel project settings.
                </p>
                {this.state.error && (
                    <div className="w-full mt-4 p-4 bg-gray-100 dark:bg-brand-primary rounded text-left text-sm text-gray-800 dark:text-brand-text overflow-auto">
                        <p className="font-bold mb-2">Error Details:</p>
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
                    Reload Page
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
