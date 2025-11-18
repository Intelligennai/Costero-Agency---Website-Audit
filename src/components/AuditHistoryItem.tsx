import React from 'react';
import { SavedAudit } from '../types';
import { TrashIcon, EyeIcon } from './Icons';

interface AuditHistoryItemProps {
    audit: SavedAudit;
    onView: () => void;
    onDelete: () => void;
}

const AuditHistoryItem: React.FC<AuditHistoryItemProps> = ({ audit, onView, onDelete }) => {
    const { url, createdAt } = audit;

    const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click when deleting
        if (window.confirm(`Are you sure you want to delete the audit for ${url}?`)) {
            onDelete();
        }
    };

    return (
        <div 
            className="bg-white dark:bg-brand-secondary rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-brand-accent flex flex-col cursor-pointer"
            onClick={onView}
        >
            <div className="p-6 flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={url}>
                    {url}
                </h3>
                <p className="text-sm text-gray-500 dark:text-brand-light mt-1">{formattedDate}</p>
            </div>
            <div className="border-t border-gray-200 dark:border-brand-accent p-4 flex justify-end items-center gap-2">
                <button 
                    onClick={onView}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-brand-accent rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="View Report"
                >
                    <EyeIcon className="w-4 h-4" />
                    View
                </button>
                 <button
                    onClick={handleDelete}
                    className="p-2 text-gray-500 dark:text-brand-light hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-brand-red dark:hover:text-red-400 rounded-md transition-colors"
                    title="Delete Audit"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default AuditHistoryItem;