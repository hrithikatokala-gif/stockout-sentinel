import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  company_id: string;
  full_name: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (companyId: string, password: string) => Promise<{ error?: string }>;
  signUp: (companyId: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "restoq_auth_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("auth", {
        body: { action: "validate", token },
      });

      if (error || data?.error) {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } else {
        setUser(data.user);
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (companyId: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke("auth", {
        body: { action: "signin", company_id: companyId, password },
      });

      if (error) {
        return { error: "Failed to connect to server" };
      }

      if (data?.error) {
        return { error: data.error };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return {};
    } catch {
      return { error: "Failed to sign in" };
    }
  };

  const signUp = async (companyId: string, password: string, fullName?: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke("auth", {
        body: { action: "signup", company_id: companyId, password, full_name: fullName },
      });

      if (error) {
        return { error: "Failed to connect to server" };
      }

      if (data?.error) {
        return { error: data.error };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return {};
    } catch {
      return { error: "Failed to create account" };
    }
  };

  const signOut = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      await supabase.functions.invoke("auth", {
        body: { action: "signout", token },
      });
    }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
