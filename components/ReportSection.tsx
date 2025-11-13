
import React from 'react';

interface ReportSectionProps {
  title: string;
  score: number;
  comment: string;
  icon: React.ReactNode;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-brand-green';
  if (score >= 50) return 'text-brand-yellow';
  return 'text-brand-red';
};

export const ReportSection: React.FC<ReportSectionProps> = ({ title, score, comment, icon }) => {
  const scoreColor = getScoreColor(score);

  return (
    <div className="bg-brand-primary/50 p-6 rounded-lg flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300 print-break-inside-avoid">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-brand-cyan">{icon}</span>
          <h4 className="text-xl font-bold text-brand-light">{title}</h4>
        </div>
        <div className={`text-3xl font-bold ${scoreColor}`}>{score}<span className="text-lg">/100</span></div>
      </div>
      <p className="text-brand-text flex-grow">{comment}</p>
    </div>
  );
};
