import React from 'react';
import type { SocialMediaStat, ReviewStats } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { FacebookIcon, InstagramIcon, TiktokIcon, TwitterIcon, LinkedInIcon, YouTubeIcon, PinterestIcon, RedditIcon, TrustpilotIcon, GoogleIcon } from './Icons';

interface ReportSectionProps {
  title: string;
  score?: number;
  comment: string;
  icon: React.ReactNode;
  className?: string;
  socialMediaStats?: SocialMediaStat[];
  trustpilot?: ReviewStats;
  googleReviews?: ReviewStats;
  sectionId?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-brand-green';
  if (score >= 50) return 'text-brand-yellow';
  return 'text-brand-red';
};

const SocialIcon: React.FC<{ platform: string; className?: string }> = ({ platform, ...props }) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('facebook')) return <FacebookIcon {...props} />;
    if (lowerPlatform.includes('instagram')) return <InstagramIcon {...props} />;
    if (lowerPlatform.includes('tiktok')) return <TiktokIcon {...props} />;
    if (lowerPlatform.includes('x') || lowerPlatform.includes('twitter')) return <TwitterIcon {...props} />;
    if (lowerPlatform.includes('linkedin')) return <LinkedInIcon {...props} />;
    if (lowerPlatform.includes('youtube')) return <YouTubeIcon {...props} />;
    if (lowerPlatform.includes('pinterest')) return <PinterestIcon {...props} />;
    if (lowerPlatform.includes('reddit')) return <RedditIcon {...props} />;
    return null;
};

const ReportSectionComponent: React.FC<ReportSectionProps> = ({ title, score, comment, icon, className = '', socialMediaStats, trustpilot, googleReviews, sectionId }) => {
  const scoreColor = score !== undefined ? getScoreColor(score) : '';
  const hasReputationData = trustpilot || googleReviews;
  const t = useTranslations();

  return (
    <div data-section-id={sectionId} className={`bg-gray-100 dark:bg-brand-primary/50 p-6 rounded-lg flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300 print-break-inside-avoid ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-brand-cyan" title={title}>{icon}</span>
          <h4 className="text-xl font-bold text-gray-700 dark:text-brand-light">{title}</h4>
        </div>
        {score !== undefined && (
          <div className={`text-3xl font-bold ${scoreColor}`}>{score}<span className="text-lg">/100</span></div>
        )}
      </div>
      <div className="text-gray-800 dark:text-brand-text flex-grow">
        {comment.split('\n').map((line, index) => (
          <p key={`${line}-${index}`} className={line.trim().startsWith('*') ? 'ml-4' : ''}>
            {line}
          </p>
        ))}
      </div>
      
      {socialMediaStats && socialMediaStats.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-brand-accent/30">
          <h5 className="text-sm font-bold text-gray-600 dark:text-brand-light mb-2">{t('report_social_media_followers')}</h5>
          <ul className="space-y-2">
            {socialMediaStats.map((stat, index) => (
              <li key={index} className="flex items-center justify-between text-gray-800 dark:text-brand-text">
                <span className="flex items-center gap-2 capitalize">
                  <SocialIcon platform={stat.platform} className="w-5 h-5 text-gray-500 dark:text-brand-light" />
                  {stat.platform}
                </span>
                <span className="font-semibold text-brand-cyan">{stat.followers}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasReputationData && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-brand-accent/30">
            <h5 className="text-sm font-bold text-gray-600 dark:text-brand-light mb-2">{t('report_online_reputation')}</h5>
            <ul className="space-y-2">
                {googleReviews && (
                    <li className="flex items-center justify-between text-gray-800 dark:text-brand-text">
                        <span className="flex items-center gap-2">
                            <GoogleIcon className="w-5 h-5 text-gray-500 dark:text-brand-light" />
                            {t('report_google_reviews')}
                        </span>
                        <div className="text-right">
                            <p className="font-semibold text-brand-yellow">{googleReviews.score}</p>
                            <p className="text-xs text-gray-500 dark:text-brand-light">{googleReviews.reviewCount}</p>
                        </div>
                    </li>
                )}
                {trustpilot && (
                    <li className="flex items-center justify-between text-gray-800 dark:text-brand-text">
                        <span className="flex items-center gap-2">
                            <TrustpilotIcon className="w-5 h-5 text-brand-green" />
                            {t('report_trustpilot')}
                        </span>
                         <div className="text-right">
                            <p className="font-semibold text-brand-yellow">{trustpilot.score}</p>
                            <p className="text-xs text-gray-500 dark:text-brand-light">{trustpilot.reviewCount}</p>
                        </div>
                    </li>
                )}
            </ul>
        </div>
      )}
    </div>
  );
};

export const ReportSection = React.memo(ReportSectionComponent);
