import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Adjust path as needed
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "expo-router";

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null as User | null,
  session: null as Session | null,
  loading: true,
  signIn: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {},
  signUp: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {},
  signOut: async () => {},
  googleAuth: async (idToken: string) => {},
});

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<any>;
  signUp: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<any>;
  signOut: () => Promise<void>;
  googleAuth: (idToken: string, email: string) => Promise<any>;
}

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get current session and set up listener
    const setupSession = async () => {
      setLoading(true);

      // Get current session
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
      }

      // Set up auth state change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user || null);
          setLoading(false);
        }
      );

      setLoading(false);

      // Clean up listener on unmount
      return () => {
        authListener?.subscription?.unsubscribe();
      };
    };

    setupSession();
  }, []);

  // Auth functions
  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    router.push("/(tabs)");
    return data;
  };

  const signUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          email: email,
        },
      },
    });

    if (error) throw error;
    router.push("/(tabs)");

    return data;
  };

  const googleAuth = async (idToken: string) => {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });
    if (error) throw error;
    router.push("/(tabs)");

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signIn, signUp, signOut, googleAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
