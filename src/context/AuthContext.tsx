import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types/database';
import { ReadoraStore } from '../lib/store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password?: string, fullName?: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => void;
  setInterests: (interests: string[]) => void;
  switchMockRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'readora_active_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(() => {
    const savedId = localStorage.getItem(CURRENT_USER_KEY) || 'u-admin-1';
    return ReadoraStore.getProfileById(savedId) || ReadoraStore.getProfiles()[0] || null;
  });

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const profile = ReadoraStore.getProfileById(session.user.id);
          if (profile) setUser(profile);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const profile = ReadoraStore.getProfileById(session.user.id);
          if (profile) setUser(profile);
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      if (isSupabaseConfigured && supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          let profile = ReadoraStore.getProfileById(data.user.id);
          if (!profile) {
            profile = ReadoraStore.saveProfile({
              id: data.user.id,
              username: email.split('@')[0],
              full_name: email.split('@')[0],
              role: 'user',
            });
          }
          setUser(profile);
          localStorage.setItem(CURRENT_USER_KEY, profile.id);
          return { success: true };
        }
      }

      // Offline / Demo authentication fallback
      const profiles = ReadoraStore.getProfiles();
      const existing = profiles.find(p => p.username === email.toLowerCase() || p.id === email);
      if (existing) {
        setUser(existing);
        localStorage.setItem(CURRENT_USER_KEY, existing.id);
        return { success: true };
      }

      // Create new user session if not found in mock list
      const username = email.includes('@') ? email.split('@')[0] : email;
      const newProfile = ReadoraStore.saveProfile({
        id: `u-${Date.now()}`,
        username,
        full_name: username.charAt(0).toUpperCase() + username.slice(1),
        role: 'user',
      });
      setUser(newProfile);
      localStorage.setItem(CURRENT_USER_KEY, newProfile.id);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signup = async (email: string, password?: string, fullName?: string, username?: string) => {
    try {
      if (isSupabaseConfigured && supabase && password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, username },
          },
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const profile = ReadoraStore.saveProfile({
            id: data.user.id,
            username: username || email.split('@')[0],
            full_name: fullName || 'New Reader',
            role: 'user',
          });
          setUser(profile);
          localStorage.setItem(CURRENT_USER_KEY, profile.id);
          return { success: true };
        }
      }

      // Offline fallback
      const uname = username || email.split('@')[0];
      const newProfile = ReadoraStore.saveProfile({
        id: `u-${Date.now()}`,
        username: uname,
        full_name: fullName || uname,
        role: 'user',
        interests: [],
      });
      setUser(newProfile);
      localStorage.setItem(CURRENT_USER_KEY, newProfile.id);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = (data: Partial<Profile>) => {
    if (!user) return;
    const updated = ReadoraStore.saveProfile({ ...user, ...data });
    setUser(updated);
  };

  const setInterests = (interests: string[]) => {
    if (!user) return;
    const updated = ReadoraStore.saveProfile({ ...user, interests });
    setUser(updated);
  };

  const switchMockRole = (role: UserRole) => {
    if (!user) return;
    const updated = ReadoraStore.saveProfile({ ...user, role });
    setUser(updated);
  };

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'admin' || user?.role === 'moderator';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isModerator,
        isSupabaseConnected: isSupabaseConfigured,
        login,
        signup,
        logout,
        updateProfile,
        setInterests,
        switchMockRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
