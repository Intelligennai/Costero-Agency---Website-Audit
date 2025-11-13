export interface AuditSection {
  score: number;
  comment: string;
}

export interface AuditReportData {
  websiteUx?: AuditSection;
  seo?: AuditSection;
  digitalMarketingPresence?: AuditSection;
  contentCommunication?: AuditSection;
  aiAutomation?: AuditSection;
  overallPotential?: AuditSection;
  summary?: string;
}