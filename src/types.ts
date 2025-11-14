
export interface AuditSection {
  score: number;
  comment: string;
}

export interface SocialMediaStat {
  platform: string;
  followers: string;
}

export interface DigitalMarketingSection extends AuditSection {
  socialMediaStats: SocialMediaStat[];
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
}

export interface HistoryItem {
  id: string;
  url: string;
  reportData: AuditReportData;
  pitch: string;
  timestamp: string;
}
