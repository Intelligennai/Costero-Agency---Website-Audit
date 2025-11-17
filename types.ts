
export interface AuditSection {
  score: number;
  comment: string;
}

export interface SocialMediaStat {
  platform: string;
  followers: string;
}

export interface ReviewStats {
  score: string;
  reviewCount: string;
}

export interface DigitalMarketingSection extends AuditSection {
  socialMediaStats: SocialMediaStat[];
  trustpilot?: ReviewStats;
  googleReviews?: ReviewStats;
}

export interface AnalysisSection {
  comment: string;
}

export interface AuditReportData {
  websiteUx: AuditSection;
  seo: AuditSection;
  digitalMarketingPresence: DigitalMarketingSection;
  contentCommunication: AuditSection;
  aiAutomation: AuditSection;
  overallPotential: AuditSection;
  summary: string;
  advertisingOptimization: AnalysisSection;
  googleMyBusiness: AnalysisSection;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
