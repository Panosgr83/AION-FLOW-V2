import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseAvailable } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isDemoMode: false,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@aionflow.gr',
  user_metadata: { full_name: 'Demo Admin' },
} as unknown as User;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemoMode = !isSupabaseAvailable();

  useEffect(() => {
    if (isDemoMode) {
      const stored = localStorage.getItem('aion_demo_auth');
      if (stored === 'true') {
        setUser(DEMO_USER);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [isDemoMode]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (isDemoMode) {
      await new Promise(r => setTimeout(r, 800));
      if (email === 'demo@aionflow.gr' && password === 'demo123') {
        localStorage.setItem('aion_demo_auth', 'true');
        setUser(DEMO_USER);
        return { error: null };
      }
      return { error: 'Demo mode: Χρησιμοποιήστε demo@aionflow.gr / demo123' };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error?.message === 'Invalid login credentials') {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) return { error: signUpError.message };
      const { error: retryError } = await supabase.auth.signInWithPassword({ email, password });
      return { error: retryError?.message ?? null };
    }

    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    if (isDemoMode) {
      localStorage.removeItem('aion_demo_auth');
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isDemoMode, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
