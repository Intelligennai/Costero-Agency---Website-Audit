import React, { useMemo } from 'react';
import type { AuditReportData, DigitalMarketingSection } from '../types';
import { ReportSection } from './ReportSection';
import { ScoreDonutChart } from './ScoreDonutChart';
import { DownloadIcon, WebsiteIcon, SeoIcon, MarketingIcon, ContentIcon, PotentialIcon, AiIcon, AdvertisingIcon, LoaderIcon, GmbIcon } from './Icons';

interface ReportProps {
  data: AuditReportData;
  url: string;
  onPrint: () => void;
  isPrinting: boolean;
}

const ReportComponent: React.FC<ReportProps> = ({ data, url, onPrint, isPrinting }) => {
  const reportSections = useMemo(() => [
    { title: 'Hjemmeside & UX', data: data.websiteUx, icon: <WebsiteIcon className="w-6 h-6" /> },
    { title: 'SEO', data: data.seo, icon: <SeoIcon className="w-6 h-6" /> },
    { title: 'Digital Marketing', data: data.digitalMarketingPresence, icon: <MarketingIcon className="w-6 h-6" /> },
    { title: 'Indhold & Kommunikation', data: data.contentCommunication, icon: <ContentIcon className="w-6 h-6" /> },
    { title: 'AI & Automation', data: data.aiAutomation, icon: <AiIcon className="w-6 h-6" /> },
  ], [data]);

  return (
    <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 md:p-8 animate-slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-brand-accent">
        <div>
          <h2 className="text-3xl font-bold text-brand-text">Audit Report</h2>
          <a href={`https://${url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-lg text-brand-cyan hover:underline">{url}</a>
        </div>
        <button
          onClick={onPrint}
          disabled={isPrinting}
          className="no-print mt-4 md:mt-0 flex items-center justify-center gap-2 px-6 py-2 bg-brand-cyan text-brand-primary font-bold rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-cyan transition-all disabled:opacity-50 disabled:cursor-wait"
        >
          {isPrinting ? (
            <>
              <LoaderIcon className="w-5 h-5 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <DownloadIcon className="w-5 h-5" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 bg-brand-primary/50 p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4 text-brand-light">Executive Summary</h3>
          <p className="text-brand-text text-lg">{data.summary || 'An executive summary could not be generated.'}</p>
        </div>

        <div className="flex flex-col items-center justify-center bg-brand-primary/50 p-6 rounded-lg print-break-inside-avoid">
          <h3 className="text-2xl font-bold mb-4 text-brand-light flex items-center gap-2">
            <span title="Overall Potential">
              <PotentialIcon className="w-7 h-7" />
            </span>
             Overall Potential
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
        
        {/* The first section sits next to the potential chart */}
        {reportSections[0] && reportSections[0].data && (
           <ReportSection
              title={reportSections[0].title}
              score={reportSections[0].data.score}
              comment={reportSections[0].data.comment}
              icon={reportSections[0].icon}
            />
        )}
        
        {/* The rest of the sections flow into the grid, creating the two-column layout */}
        {reportSections.slice(1).map((section, index) => {
           if (!section.data) return null;
            const digitalMarketingData = section.title === 'Digital Marketing' 
            ? (section.data as DigitalMarketingSection) 
            : undefined;

            return (
              <ReportSection
                key={index + 1}
                title={section.title}
                score={section.data.score}
                comment={section.data.comment}
                icon={section.icon}
                socialMediaStats={digitalMarketingData?.socialMediaStats}
                trustpilot={digitalMarketingData?.trustpilot}
                googleReviews={digitalMarketingData?.googleReviews}
              />
            )
        })}
        
        {/* The advertising section spans the full width */}
        {data.advertisingOptimization && (
          <ReportSection
            title="Annoncering & Optimering"
            comment={data.advertisingOptimization.comment}
            icon={<AdvertisingIcon className="w-6 h-6" />}
            className="md:col-span-2"
          />
        )}

        {/* The Google My Business section spans the full width */}
        {data.googleMyBusiness && (
          <ReportSection
            title="Google My Business"
            comment={data.googleMyBusiness.comment}
            icon={<GmbIcon className="w-6 h-6" />}
            className="md:col-span-2"
          />
        )}
      </div>
    </div>
  );
};

export const Report = React.memo(ReportComponent);