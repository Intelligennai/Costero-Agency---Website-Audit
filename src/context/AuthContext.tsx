import React, { createContext, ReactNode } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';
import type { User, Agency, SavedAudit } from '../types';

interface AuthContextType {
  user: User | null;
  agency: Agency | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateAgency: (data: Partial<Omit<Agency, 'id'>>) => Promise<void>;
  addAudit: (audit: SavedAudit) => void;
  deleteAudit: (auditId: string) => void;
  inviteMember: (email: string) => Promise<void>;
  removeMember: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuthHook();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
