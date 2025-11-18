import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { User } from '../types';

const USER_STORAGE_KEY = 'audit-tool-user';

// This is a mock auth hook that uses localStorage to simulate a user database and session.
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for a logged-in user in localStorage on initial load
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
      if (storedUsers[email] && storedUsers[email].password === pass) {
        const loggedInUser = { ...storedUsers[email].data };
        setUser(loggedInUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      } else {
        throw new Error('error_incorrect_credentials');
      }
    } catch (e: any) {
      setError(e.message || 'error_login_failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, pass: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
      if (storedUsers[email]) {
        throw new Error('error_user_exists');
      }
      const newUser: User = { 
        email, 
        branding: { logo: null } 
      };
      storedUsers[email] = { password: pass, data: newUser };
      localStorage.setItem('users', JSON.stringify(storedUsers));
      
      // Automatically log in the new user
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));

    } catch (e: any) {
      setError(e.message || 'error_registration_failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUser = async (data: Partial<Omit<User, 'email'>>): Promise<void> => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
        const updatedUser = { ...user, ...data };
        
        // Update user state
        setUser(updatedUser);
        
        // Update session storage
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        
        // Update "database"
        const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
        if (storedUsers[user.email]) {
            storedUsers[user.email].data = updatedUser;
            localStorage.setItem('users', JSON.stringify(storedUsers));
        }

    } catch(e: any) {
        setError(e.message || 'error_update_failed');
    } finally {
        setIsLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return { user, isLoading, error, login, register, logout, updateUser };
};

// Custom hook to easily consume the context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
