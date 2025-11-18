import React, { useState, lazy, Suspense } from 'react';
import type { SavedAudit } from '../types';
import { useAuthContext } from '../hooks/useAuth';

const Header = lazy(() => import('./Header'));
const Dashboard = lazy(() => import('./Dashboard'));
const AuditTool = lazy(() => import('./AuditTool'));

type View = 'dashboard' | 'auditTool';

const MainPlatform: React.FC = () => {
    const { user, addAudit, deleteAudit } = useAuthContext();
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [selectedAudit, setSelectedAudit] = useState<SavedAudit | undefined>(undefined);

    const handleStartNewAudit = () => {
        setSelectedAudit(undefined);
        setCurrentView('auditTool');
    };

    const handleViewAudit = (audit: SavedAudit) => {
        setSelectedAudit(audit);
        setCurrentView('auditTool');
    };
    
    const handleReturnToDashboard = () => {
        setSelectedAudit(undefined);
        setCurrentView('dashboard');
    }

    const handleSaveAudit = (audit: SavedAudit) => {
        addAudit(audit);
    };

    const handleDeleteAudit = (auditId: string) => {
        deleteAudit(auditId);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-brand-primary font-sans">
             <Suspense fallback={<div className="h-20" />}>
                <Header onNavigateToDashboard={handleReturnToDashboard} />
            </Suspense>
            <main>
                {currentView === 'dashboard' && (
                    <Suspense fallback={<div>Loading Dashboard...</div>}>
                        <Dashboard 
                            audits={user?.audits || []}
                            onNewAudit={handleStartNewAudit}
                            onViewAudit={handleViewAudit}
                            onDeleteAudit={handleDeleteAudit}
                        />
                    </Suspense>
                )}
                {currentView === 'auditTool' && (
                     <Suspense fallback={<div>Loading Tool...</div>}>
                        <AuditTool 
                            key={selectedAudit?.id || 'new'}
                            initialAudit={selectedAudit}
                            onNewAudit={handleStartNewAudit}
                            onAuditSaved={handleSaveAudit}
                        />
                    </Suspense>
                )}
            </main>
        </div>
    );
};

export default MainPlatform;