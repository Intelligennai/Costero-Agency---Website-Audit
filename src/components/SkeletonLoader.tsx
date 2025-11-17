
import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className = '' }) => {
  return (
    <div className={`bg-gray-200 dark:bg-brand-accent/30 rounded-md animate-pulse ${className}`} />
  );
};

export default SkeletonLoader;