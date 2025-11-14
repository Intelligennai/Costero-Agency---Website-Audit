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

export interface AuditReportData {
  websiteUx?: AuditSection;
  seo?: AuditSection;
  digitalMarketingPresence?: DigitalMarketingSection;
  contentCommunication?: AuditSection;
  aiAutomation?: AuditSection;
  overallPotential?: AuditSection;
  summary?: string;
}
