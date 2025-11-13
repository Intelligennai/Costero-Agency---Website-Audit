import React from 'react';
import type { AuditReportData, AuditSection } from '../types';
import { ReportSection } from './ReportSection';
import { ScoreDonutChart } from './ScoreDonutChart';
import { DownloadIcon, WebsiteIcon, SeoIcon, MarketingIcon, ContentIcon, PotentialIcon, AiIcon } from './Icons';

interface ReportProps {
  data: AuditReportData;
  url: string;
  onPrint: () => void;
}

export const Report: React.FC<ReportProps> = ({ data, url, onPrint }) => {
  const reportSections: { title: string; data?: AuditSection; icon: React.ReactNode }[] = [
    { title: 'Hjemmeside & UX', data: data.websiteUx, icon: <WebsiteIcon className="w-6 h-6" /> },
    { title: 'SEO', data: data.seo, icon: <SeoIcon className="w-6 h-6" /> },
    { title: 'Digital Marketing', data: data.digitalMarketingPresence, icon: <MarketingIcon className="w-6 h-6" /> },
    { title: 'Indhold & Kommunikation', data: data.contentCommunication, icon: <ContentIcon className="w-6 h-6" /> },
    { title: 'AI & Automation', data: data.aiAutomation, icon: <AiIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 md:p-8 animate-slide-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-brand-accent">
            <div>
                <h2 className="text-3xl font-bold text-brand-text">Audit Report</h2>
                <a href={`https://${url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-lg text-brand-cyan hover:underline">{url}</a>
            </div>
            <button
                onClick={onPrint}
                className="no-print mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-brand-accent text-brand-text rounded-md hover:bg-brand-light transition-colors"
            >
                <DownloadIcon className="w-5 h-5" />
                Download PDF
            </button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex flex-col items-center justify-center bg-brand-primary/50 p-6 rounded-lg print-break-inside-avoid">
            <h3 className="text-2xl font-bold mb-4 text-brand-light flex items-center gap-2">
                <PotentialIcon className="w-7 h-7" /> Overall Potential
            </h3>
            {data.overallPotential ? (
                <>
                    <ScoreDonutChart score={data.overallPotential.score} />
                    <p className="text-center text-brand-light mt-4">{data.overallPotential.comment}</p>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-brand-light">Not available</p>
                </div>
            )}
        </div>
        <div className="md:col-span-2 bg-brand-primary/50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-brand-light">Executive Summary</h3>
            <p className="text-brand-text text-lg">{data.summary || 'An executive summary could not be generated.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {reportSections.map((section, index) => (
          section.data ? (
            <ReportSection
              key={index}
              title={section.title}
              score={section.data.score}
              comment={section.data.comment}
              icon={section.icon}
            />
          ) : null
        ))}
      </div>
    </div>
  );
};