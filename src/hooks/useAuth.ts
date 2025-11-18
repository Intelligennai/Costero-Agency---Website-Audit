
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { User, Agency, SavedAudit, TeamMember, UserRole } from '../types';

// Map DB audit shape to App audit shape
const mapAuditFromDB = (dbAudit: any): SavedAudit => ({
  id: dbAudit.id,
  url: dbAudit.url,
  reportData: dbAudit.report_data,
  createdAt: dbAudit.created_at,
});

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgencyData = async (agencyId: string) => {
    try {
      // 1. Fetch Agency Details
      const { data: agencyData, error: agencyError } = await supabase
        .from('agencies')
        .select('*')
        .eq('id', agencyId)
        .single();

      if (agencyError) throw agencyError;

      // 2. Fetch Members (Profiles linked to this agency)
      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('agency_id', agencyId);
      
      if (membersError) throw membersError;

      // 3. Fetch Audits
      const { data: auditsData, error: auditsError } = await supabase
        .from('audits')
        .select('*')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false });

      if (auditsError) throw auditsError;

      setAgency({
        id: agencyData.id,
        profile: {
            name: agencyData.name,
            services: agencyData.services
        },
        branding: agencyData.branding,
        members: membersData as TeamMember[],
        audits: auditsData.map(mapAuditFromDB)
      });

    } catch (err) {
      console.error("Error fetching agency data:", err);
    }
  };

  const fetchProfile = async (userId: string, userEmail: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        // If profile missing for some reason, might need manual handling or trigger didn't fire
        return;
      }

      if (profile) {
        const currentUser: User = {
          email: userEmail,
          role: profile.role as UserRole,
          agencyId: profile.agency_id
        };
        setUser(currentUser);

        if (profile.agency_id) {
          await fetchAgencyData(profile.agency_id);
        } else {
          setAgency(null); // User exists but hasn't set up agency yet
        }
      }
    } catch (err) {
        console.error("Unexpected error in fetchProfile:", err);
    }
  };

  useEffect(() => {
    // Initial Session Check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!);
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setAgency(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) throw error;
    } catch (e: any) {
      setError(e.message || 'error_login_failed');
      setIsLoading(false); // Only stop loading on error, success triggers auth listener
    }
  };

  const register = async (email: string, pass: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
      });
      if (error) throw error;
      // Success will trigger auth listener
    } catch (e: any) {
      setError(e.message || 'error_registration_failed');
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAgency(null);
  };

  const updateAgency = async (data: Partial<Omit<Agency, 'id'>>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
        // Scenario: User just signed up, has no agency yet (agency_id is null)
        if (!agency && data.profile) {
             // 1. Create new agency row
             const { data: newAgency, error: createError } = await supabase
                .from('agencies')
                .insert({
                    name: data.profile.name,
                    services: data.profile.services,
                    branding: { logo: null }
                })
                .select()
                .single();
            
            if (createError) throw createError;

            // 2. Update user profile with new agency_id
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) throw new Error("No authenticated user");

            const { error: profileError } = await supabase
                .from('profiles')
                .update({ agency_id: newAgency.id })
                .eq('id', authUser.id);

            if (profileError) throw profileError;

            // 3. Refresh state
            await fetchProfile(authUser.id, authUser.email!);
            return;
        }

        // Scenario: Existing agency update
        if (agency) {
             const updates: any = {};
             if (data.profile) {
                 updates.name = data.profile.name;
                 updates.services = data.profile.services;
             }
             if (data.branding) {
                 updates.branding = data.branding;
             }

             const { error: updateError } = await supabase
                .from('agencies')
                .update(updates)
                .eq('id', agency.id);
            
            if (updateError) throw updateError;
            await fetchAgencyData(agency.id);
        }

    } catch(e: any) {
        setError(e.message || 'error_update_failed');
        throw e;
    } finally {
        setIsLoading(false);
    }
  };

  const addAudit = async (audit: SavedAudit) => {
    if (!agency) return;
    try {
        const { error } = await supabase
            .from('audits')
            .insert({
                agency_id: agency.id,
                url: audit.url,
                report_data: audit.reportData,
                // id and created_at generated by DB/default
            });
        
        if (error) throw error;
        // Refresh audits
        fetchAgencyData(agency.id);
    } catch (e) {
        console.error("Failed to add audit", e);
    }
  };

  const deleteAudit = async (auditId: string) => {
    if (!agency) return;
    try {
        const { error } = await supabase
            .from('audits')
            .delete()
            .eq('id', auditId);
        
        if (error) throw error;
        // Refresh audits
        fetchAgencyData(agency.id);
    } catch (e) {
        console.error("Failed to delete audit", e);
    }
  };

  const inviteMember = async (email: string): Promise<void> => {
    if (!agency) return;
    try {
       const { error } = await supabase
        .from('invitations')
        .insert({
            email,
            agency_id: agency.id,
            role: 'member'
        });
        
       if (error) throw error;
       alert("Invitation logged in database. (Real email sending requires Edge Functions).");
    } catch (e: any) {
        throw e;
    }
  };
  
  const removeMember = async (email: string): Promise<void> => {
    // This is tricky because we need the ID of the profile to delete, 
    // but we are listing by email.
    // For MVP, we might need to just update the profile to set agency_id = null
    // But we can't easily select ID by email due to RLS usually.
    // Let's assume we can't do this easily without an Edge Function or proper Admin API.
    // For now, we'll alert.
    alert("Member removal requires admin privileges via Supabase Dashboard for this version.");
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
