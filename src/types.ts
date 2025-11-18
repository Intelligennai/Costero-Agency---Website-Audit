import type { Chat } from '@google/genai';

// --- Audit Report Data Structure ---
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

export interface SavedAudit {
  id: string;
  url: string;
  reportData: AuditReportData;
  createdAt: string;
  chatSession?: Chat;
  chatMessages?: ChatMessage[];
}


// --- Agency & User Data Structure ---

export interface AgencyProfile {
  name: string;
  services: string[];
}

export interface BrandingSettings {
  logo: string | null; // Base64 string for the logo
}

export type UserRole = 'admin' | 'member';

export interface TeamMember {
  email: string;
  role: UserRole;
}

export interface Agency {
  id: string;
  profile: AgencyProfile | null;
  branding: BrandingSettings;
  audits: SavedAudit[];
  members: TeamMember[];
}

export interface User {
  email: string;
  agencyId: string;
  role: UserRole;
}


// --- UI & Interaction Types ---

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface PdfExportOptions {
  selectedSections: string[];
  headerText: string;
  footerText: string;
  logo: string | null;
}
