import React from 'react';
import { SavedAudit } from '../types';
import AuditHistoryItem from './AuditHistoryItem';
import { PlusIcon } from './Icons';

interface DashboardProps {
    audits: SavedAudit[];
    onNewAudit: () => void;
    onViewAudit: (audit: SavedAudit) => void;
    onDeleteAudit: (auditId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ audits, onNewAudit, onViewAudit, onDeleteAudit }) => {
    const sortedAudits = [...audits].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="container mx-auto p-4 md:p-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <button 
                    onClick={onNewAudit}
                    className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-brand-cyan text-brand-primary font-bold rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-primary focus:ring-brand-cyan transition-all shadow-lg hover:shadow-cyan-500/50"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Audit
                </button>
            </div>

            {sortedAudits.length === 0 ? (
                <div className="text-center py-20 px-6 bg-white dark:bg-brand-secondary rounded-xl border border-gray-200 dark:border-brand-accent">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Welcome to Your Dashboard!</h2>
                    <p className="mt-2 text-gray-600 dark:text-brand-light">You haven't run any audits yet. Click the button above to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedAudits.map(audit => (
                        <AuditHistoryItem 
                            key={audit.id}
                            audit={audit}
                            onView={() => onViewAudit(audit)}
                            onDelete={() => onDeleteAudit(audit.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;