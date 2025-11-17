
import React from 'react';
import SkeletonLoader from './SkeletonLoader';

const ReportSectionSkeleton: React.FC<{ fullWidth?: boolean }> = ({ fullWidth = false }) => (
    <div className={`bg-gray-100 dark:bg-brand-primary/50 p-6 rounded-lg flex flex-col h-full ${fullWidth ? 'md:col-span-2' : ''}`}>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <SkeletonLoader className="w-6 h-6 rounded-full" />
                <SkeletonLoader className="h-6 w-32" />
            </div>
            {!fullWidth && (
                <SkeletonLoader className="h-8 w-20" />
            )}
        </div>
        <div className="space-y-2 flex-grow">
            <SkeletonLoader className="h-4 w-full" />
            <SkeletonLoader className="h-4 w-full" />
            <SkeletonLoader className="h-4 w-5/6" />
        </div>
    </div>
);


const ReportSkeleton: React.FC = () => {
    return (
        <div className="mt-8 bg-white dark:bg-brand-secondary rounded-lg shadow-2xl p-6 md:p-8 animate-fade-in print-container">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200 dark:border-brand-accent">
                <div>
                    <SkeletonLoader className="h-8 w-48 mb-2" />
                    <SkeletonLoader className="h-6 w-64" />
                </div>
                <SkeletonLoader className="h-12 w-40 rounded-full mt-4 md:mt-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary Skeleton */}
                <div className="md:col-span-2 bg-gray-100 dark:bg-brand-primary/50 p-6 rounded-lg">
                    <SkeletonLoader className="h-7 w-56 mb-4" />
                    <div className="space-y-2">
                        <SkeletonLoader className="h-5 w-full" />
                        <SkeletonLoader className="h-5 w-3/4" />
                    </div>
                </div>

                {/* Potential Chart Skeleton */}
                <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-brand-primary/50 p-6 rounded-lg">
                    <SkeletonLoader className="h-7 w-48 mb-4" />
                    <SkeletonLoader className="w-44 h-44 rounded-full" />
                    <SkeletonLoader className="h-5 w-full mt-4" />
                </div>

                {/* Report Section Skeletons */}
                <ReportSectionSkeleton />
                <ReportSectionSkeleton />
                <ReportSectionSkeleton />
                <ReportSectionSkeleton />

                {/* Full width section skeletons */}
                <ReportSectionSkeleton fullWidth />
                <ReportSectionSkeleton fullWidth />
            </div>
            
            {/* Pitch Generator Skeleton */}
            <div className="mt-8 bg-gray-50 dark:bg-brand-secondary/50 p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                    <SkeletonLoader className="h-8 w-64" />
                    <SkeletonLoader className="h-10 w-36 rounded-md" />
                </div>
                 <div className="relative bg-white dark:bg-brand-primary p-4 rounded-md space-y-3">
                    <SkeletonLoader className="h-4 w-3/4" />
                    <SkeletonLoader className="h-4 w-full" />
                    <SkeletonLoader className="h-4 w-5/6" />
                </div>
            </div>

            {/* Call Notes Skeleton */}
            <div className="mt-8 bg-gray-50 dark:bg-brand-secondary/50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <SkeletonLoader className="h-8 w-48" />
                </div>
                <SkeletonLoader className="w-full h-48" />
            </div>
        </div>
    );
};
export default ReportSkeleton;