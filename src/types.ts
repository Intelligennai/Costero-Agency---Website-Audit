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

// FIX: Added SavedAudit interface to be used for storing audit history.
export interface SavedAudit {
  id: string;
  url: string;
  reportData: AuditReportData;
  createdAt: string;
}

export interface AgencyProfile {
  name: string;
  services: string[];
}

export interface BrandingSettings {
  logo: string | null; // Base64 string for the logo
}

export interface User {
  email: string;
  agencyProfile?: AgencyProfile;
  branding: BrandingSettings;
  // FIX: Added audits property to user to store their audit history.
  audits?: SavedAudit[];
}

export interface PdfExportOptions {
  selectedSections: string[];
  headerText: string;
  footerText: string;
  logo: string | null;
}
