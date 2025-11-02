import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: 'customer' | 'caretaker' | null;
  loading: boolean;
  signUp: (email: string, password: string, role: 'customer' | 'caretaker', fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'customer' | 'caretaker' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role
          const { data } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
          
          const role = data?.role || null;
          setUserRole(role);
          setLoading(false);

          // Redirect after login based on role
          if (event === 'SIGNED_IN') {
            if (role === 'customer') {
              navigate('/dashboard/customer');
            } else if (role === 'caretaker') {
              navigate('/dashboard/caretaker');
            }
          }
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data }) => {
            setUserRole(data?.role || null);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, role: 'customer' | 'caretaker', fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { 
          full_name: fullName,
          role: role
        }
      }
    });

    if (error) return { error };
    if (!data.user) return { error: 'Signup failed' };

    // Wait for trigger to create user_role
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update role if caretaker
    if (role === 'caretaker') {
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: 'caretaker' })
        .eq('user_id', data.user.id);

      if (roleError) console.error('Role update error:', roleError);
    }

    // Create caretaker profile if needed
    if (role === 'caretaker' && fullName) {
      await supabase
        .from('caretaker_profiles')
        .insert({
          user_id: data.user.id,
          full_name: fullName,
          hourly_rate: 0,
          daily_rate: 0
        });
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) return { error };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};