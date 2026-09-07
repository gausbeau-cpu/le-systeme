import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  provider: 'google' | 'email' | 'demo';
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'class_s_user_session';

function supabaseUserToProfile(supaUser: {
  id: string;
  email?: string;
  app_metadata?: { provider?: string };
  user_metadata?: { full_name?: string; display_name?: string; avatar_url?: string };
}): UserProfile {
  const provider =
    supaUser.app_metadata?.provider === 'google' ? 'google' : 'email';
  return {
    id: supaUser.id,
    email: supaUser.email || '',
    name:
      supaUser.user_metadata?.full_name ||
      supaUser.user_metadata?.display_name ||
      supaUser.email?.split('@')[0] ||
      'Chasseur',
    avatarUrl: supaUser.user_metadata?.avatar_url || '',
    provider,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    const init = async () => {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user) {
            const u = supabaseUserToProfile(session.user);
            setUser(u);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
            setLoading(false);
            return;
          }

          // Subscribe to auth state changes (handles OAuth redirect callback)
          client.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              const u = supabaseUserToProfile(session.user);
              setUser(u);
              localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
            } else {
              setUser(null);
              localStorage.removeItem(LOCAL_USER_KEY);
            }
          });
        } catch (err) {
          console.warn('Supabase session check failed:', err);
        }
      }

      // Fall back to localStorage cache (works offline / no Supabase key)
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          /* ignore parse errors */
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    clearAuthError();
    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        });
        if (error) throw error;
        // Auth state change listener will update user after redirect
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erreur de connexion Google.';
        console.warn('Google OAuth error:', err);
        setAuthError(msg);
      }
    } else {
      // Demo mode — no Supabase key configured yet
      const demoUser: UserProfile = {
        id: 'demo_hunter_' + Date.now(),
        email: 'demo@le-systeme.app',
        name: 'Chasseur (Mode Démo)',
        avatarUrl: '',
        provider: 'demo',
      };
      setUser(demoUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
    }
    setLoading(false);
  };

  const loginWithEmail = async (email: string, password: string) => {
    clearAuthError();
    const client = getSupabaseClient();
    if (!client) {
      setAuthError('Connexion cloud non configurée. Colle ta clé Supabase dans les Réglages.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const u = supabaseUserToProfile(data.user);
        setUser(u);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Email ou mot de passe incorrect.';
      setAuthError(
        msg.includes('Invalid login') ? 'Email ou mot de passe incorrect.' :
        msg.includes('Email not confirmed') ? 'Confirme ton email avant de te connecter.' :
        msg
      );
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email: string, password: string, displayName: string) => {
    clearAuthError();
    const client = getSupabaseClient();
    if (!client) {
      setAuthError('Connexion cloud non configurée. Colle ta clé Supabase dans les Réglages.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: displayName, display_name: displayName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      if (data.user && !data.user.email_confirmed_at) {
        // Email confirmation pending — show as success message
        setAuthError('✅ Compte créé ! Vérifie ta boîte email pour confirmer ton adresse avant de te connecter.');
      } else if (data.user) {
        const u = supabaseUserToProfile(data.user);
        setUser(u);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la création du compte.";
      setAuthError(
        msg.includes('already registered') ? 'Un compte existe déjà avec cet email. Connecte-toi.' :
        msg.includes('Password should be') ? 'Le mot de passe doit comporter au moins 6 caractères.' :
        msg
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    clearAuthError();
    const client = getSupabaseClient();
    if (!client) {
      setAuthError('Connexion cloud non configurée.');
      return;
    }
    try {
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setAuthError('✅ Email de réinitialisation envoyé. Vérifie ta boîte.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'envoi.";
      setAuthError(msg);
    }
  };

  const logout = async () => {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch {
        /* ignore */
      }
    }
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
  };

  const deleteAccount = async () => {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch {
        /* ignore */
      }
    }
    // Clear all local data for this user
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('class_s_') || k === LOCAL_USER_KEY)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        clearAuthError,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resetPassword,
        logout,
        deleteAccount,
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
