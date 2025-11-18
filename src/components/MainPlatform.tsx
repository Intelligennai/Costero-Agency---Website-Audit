import React, { useState, lazy, Suspense } from 'react';
import type { SavedAudit, AuditReportData } from '../types';
import { useAuthContext } from '../hooks/useAuth';
import { LoaderIcon } from './Icons';

const Header = lazy(() => import('./Header'));
const Dashboard = lazy(() => import('./Dashboard'));
const NewAudit = lazy(() => import('./NewAudit'));
const AuditViewer = lazy(() => import('./AuditViewer'));

type View = 'dashboard' | 'newAudit' | 'viewAudit';

const MainPlatform: React.FC = () => {
    const { agency, addAudit, deleteAudit } = useAuthContext();
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [selectedAudit, setSelectedAudit] = useState<SavedAudit | null>(null);

    const handleStartNewAudit = () => {
        setSelectedAudit(null);
        setCurrentView('newAudit');
    };

    const handleViewAudit = (audit: SavedAudit) => {
        setSelectedAudit(audit);
        setCurrentView('viewAudit');
    };
    
    const handleReturnToDashboard = () => {
        setSelectedAudit(null);
        setCurrentView('dashboard');
    }

    const handleAuditComplete = (url: string, reportData: AuditReportData) => {
        const newAudit: SavedAudit = {
            id: Date.now().toString(),
            url,
            reportData,
            createdAt: new Date().toISOString(),
        };
        addAudit(newAudit);
        setSelectedAudit(newAudit);
        setCurrentView('viewAudit');
    };

    const handleDeleteAudit = (auditId: string) => {
        deleteAudit(auditId);
        // If the deleted audit is the one being viewed, return to dashboard
        if(selectedAudit?.id === auditId) {
            handleReturnToDashboard();
        }
    };
    
    const renderContent = () => {
        switch (currentView) {
            case 'newAudit':
                return <NewAudit onAuditComplete={handleAuditComplete} onReturnToDashboard={handleReturnToDashboard} />;
            case 'viewAudit':
                if (selectedAudit) {
                    return <AuditViewer audit={selectedAudit} onReturnToDashboard={handleReturnToDashboard} />;
                }
                // Fallback to dashboard if no audit is selected
                handleReturnToDashboard();
                return null;
            case 'dashboard':
            default:
                return (
                    <Dashboard 
                        audits={agency?.audits || []}
                        onNewAudit={handleStartNewAudit}
                        onViewAudit={handleViewAudit}
                        onDeleteAudit={handleDeleteAudit}
                    />
                );
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-brand-primary font-sans">
             <Suspense fallback={<div className="h-20 bg-white dark:bg-brand-primary" />} >
                <Header onNavigateToDashboard={handleReturnToDashboard} />
            </Suspense>
            <main>
                <Suspense fallback={
                    <div className="flex items-center justify-center p-20">
                        <LoaderIcon className="w-12 h-12 animate-spin text-brand-cyan" />
                    </div>
                }>
                    {renderContent()}
                </Suspense>
            </main>
        </div>
    );
};

export default MainPlatform;
