
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { User, Agency, SavedAudit, TeamMember, UserRole } from '../types';

// --- Constants for LocalStorage ---
const STORAGE_KEY_USER = 'auditpro_user';
const STORAGE_KEY_AGENCY = 'auditpro_agency';

// --- Mock/Default Data ---
const DEFAULT_AGENCY: Agency = {
  id: 'local-agency-id',
  profile: {
    name: 'My Local Agency',
    services: ['SEO', 'Web Design', 'Digital Marketing']
  },
  branding: { logo: null },
  members: [
    { email: 'admin@example.com', role: 'admin' }
  ],
  audits: []
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Load Data on Mount ---
  useEffect(() => {
    const loadSession = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        const storedAgency = localStorage.getItem(STORAGE_KEY_AGENCY);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (storedAgency) {
          setAgency(JSON.parse(storedAgency));
        } else if (storedUser) {
          // If user exists but no agency, set default (edge case fix)
          setAgency(DEFAULT_AGENCY);
          localStorage.setItem(STORAGE_KEY_AGENCY, JSON.stringify(DEFAULT_AGENCY));
        }
      } catch (e) {
        console.error("Failed to load session from local storage", e);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate a small delay for "loading" feel
    setTimeout(loadSession, 500);
  }, []);

  // --- Helper to save agency state ---
  const saveAgency = (newAgency: Agency) => {
    setAgency(newAgency);
    localStorage.setItem(STORAGE_KEY_AGENCY, JSON.stringify(newAgency));
  };

  // --- Auth Actions ---

  const login = async (email: string, pass: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock Login Success
    const newUser: User = {
      email,
      role: 'admin',
      agencyId: 'local-agency-id'
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));

    // Initialize Agency if not present
    if (!agency) {
      saveAgency(DEFAULT_AGENCY);
    }
    
    setIsLoading(false);
  };

  const register = async (email: string, pass: string): Promise<void> => {
    // For this local demo, register is same as login
    await login(email, pass);
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    // Ideally we might want to keep agency data for next login in a real local-first app,
    // but clearing user is enough to log out.
    localStorage.removeItem(STORAGE_KEY_USER);
    setIsLoading(false);
  };

  const updateAgency = async (data: Partial<Omit<Agency, 'id'>>): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    if (agency) {
      const updatedAgency = {
        ...agency,
        ...data,
        profile: { ...agency.profile, ...data.profile },
        branding: { ...agency.branding, ...data.branding }
      } as Agency; // Cast needed due to deep merge simplification

      saveAgency(updatedAgency);
    } else if (!agency && data.profile) {
        // Setup new agency
        const newAgency: Agency = {
            ...DEFAULT_AGENCY,
            profile: data.profile as any, // simplified for demo
            branding: data.branding || { logo: null }
        };
        saveAgency(newAgency);
        
        // Link user
        if(user) {
            const updatedUser = { ...user, agencyId: newAgency.id };
            setUser(updatedUser);
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
        }
    }
    setIsLoading(false);
  };

  const addAudit = async (audit: SavedAudit) => {
    if (!agency) return;
    const updatedAudits = [audit, ...agency.audits];
    const updatedAgency = { ...agency, audits: updatedAudits };
    saveAgency(updatedAgency);
  };

  const deleteAudit = async (auditId: string) => {
    if (!agency) return;
    const updatedAudits = agency.audits.filter(a => a.id !== auditId);
    const updatedAgency = { ...agency, audits: updatedAudits };
    saveAgency(updatedAgency);
  };

  const inviteMember = async (email: string): Promise<void> => {
    if (!agency) return;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMember: TeamMember = { email, role: 'member' };
    const updatedMembers = [...agency.members, newMember];
    const updatedAgency = { ...agency, members: updatedMembers };
    saveAgency(updatedAgency);
  };
  
  const removeMember = async (email: string): Promise<void> => {
    if (!agency) return;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedMembers = agency.members.filter(m => m.email !== email);
    const updatedAgency = { ...agency, members: updatedMembers };
    saveAgency(updatedAgency);
  };

  return { user, agency, isLoading, error, login, register, logout, updateAgency, addAudit, deleteAudit, inviteMember, removeMember };
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
