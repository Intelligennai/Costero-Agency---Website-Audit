import React, { useMemo } from 'react';
import type { AuditReportData, DigitalMarketingSection } from '../types';
import { ReportSection } from './ReportSection';
import { ScoreDonutChart } from './ScoreDonutChart';
import { CogIcon, WebsiteIcon, SeoIcon, MarketingIcon, ContentIcon, PotentialIcon, AiIcon, AdvertisingIcon, GmbIcon } from './Icons';
import { useTranslations } from '../hooks/useTranslations';

interface ReportProps {
  data: AuditReportData;
  url: string;
  onPrintRequest: () => void;
}

const ReportComponent: React.FC<ReportProps> = ({ data, url, onPrintRequest }) => {
  const t = useTranslations();
  const reportSections = useMemo(() => [
    { id: 'websiteUx', title: t('report_section_title_ux'), data: data.websiteUx, icon: <WebsiteIcon className="w-6 h-6" /> },
    { id: 'seo', title: t('report_section_title_seo'), data: data.seo, icon: <SeoIcon className="w-6 h-6" /> },
    { id: 'digitalMarketingPresence', title: t('report_section_title_marketing'), data: data.digitalMarketingPresence, icon: <MarketingIcon className="w-6 h-6" /> },
    { id: 'contentCommunication', title: t('report_section_title_content'), data: data.contentCommunication, icon: <ContentIcon className="w-6 h-6" /> },
    { id: 'aiAutomation', title: t('report_section_title_ai'), data: data.aiAutomation, icon: <AiIcon className="w-6 h-6" /> },
  ], [data, t]);

  return (
    <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-2xl p-6 md:p-8 animate-slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200 dark:border-brand-accent">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-brand-text">{t('report_title')}</h2>
          <a href={`https://${url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-lg text-brand-cyan hover:underline">{url}</a>
        </div>
        <button
          onClick={onPrintRequest}
          className="no-print mt-4 md:mt-0 flex items-center justify-center gap-2 px-6 py-2 bg-brand-cyan text-brand-primary font-bold rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-secondary focus:ring-brand-cyan transition-all"
        >
          <CogIcon className="w-5 h-5" />
          <span>{t('report_download_pdf')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div data-section-id="summary" className="md:col-span-2 bg-gray-100 dark:bg-brand-primary/50 p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4 text-gray-700 dark:text-brand-light">{t('summary_title')}</h3>
          <p className="text-gray-800 dark:text-brand-text text-lg">{data.summary || 'An executive summary could not be generated.'}</p>
        </div>

        <div data-section-id="overallPotential" className="flex flex-col items-center justify-center bg-gray-100 dark:bg-brand-primary/50 p-6 rounded-lg print-break-inside-avoid">
          <h3 className="text-2xl font-bold mb-4 text-gray-700 dark:text-brand-light flex items-center gap-2">
            <span title={t('potential_title')}>
              <PotentialIcon className="w-7 h-7" />
            </span>
             {t('potential_title')}
          </h3>
          {data.overallPotential ? (
            <>
              <ScoreDonutChart score={data.overallPotential.score} />
              <p className="text-center text-gray-600 dark:text-brand-light mt-4">{data.overallPotential.comment}</p>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-brand-light">Not available</p>
            </div>
          )}
        </div>
        
        {reportSections[0] && reportSections[0].data && (
           <ReportSection
              sectionId={reportSections[0].id}
              title={reportSections[0].title}
              score={reportSections[0].data.score}
              comment={reportSections[0].data.comment}
              icon={reportSections[0].icon}
            />
        )}
        
        {reportSections.slice(1).map((section, index) => {
           if (!section.data) return null;
            const digitalMarketingData = section.id === 'digitalMarketingPresence' 
            ? (section.data as DigitalMarketingSection) 
            : undefined;

            return (
              <ReportSection
                key={index + 1}
                sectionId={section.id}
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
        
        {data.advertisingOptimization && (
          <ReportSection
            sectionId="advertisingOptimization"
            title={t('report_section_title_advertising')}
            comment={data.advertisingOptimization.comment}
            icon={<AdvertisingIcon className="w-6 h-6" />}
            className="md:col-span-2"
          />
        )}

        {data.googleMyBusiness && (
          <ReportSection
            sectionId="googleMyBusiness"
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