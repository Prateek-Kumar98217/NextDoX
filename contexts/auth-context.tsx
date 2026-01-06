"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { ProfileRow } from "@/types/profile.types";
import { fetchUserProfile } from "@/actions/profile-actions";

interface AuthContextType {
  user: ProfileRow | User | null;
  loading: boolean;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<ProfileRow | User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await setExtendedUser(session);
      setLoading(false);
    };

    //Get the user information throught the user profile
    const setExtendedUser = async (session: Session | null) => {
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        setUser(userProfile);
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setExtendedUser(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmailPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(
        "Error signing in with email and password: ",
        error.message
      );
    }
    redirect(`${window.location.origin}/`);
  };

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Error while signing in: ", error.message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error while signing out: ", error.message);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      console.error(
        "Error signing up with email and password: ",
        error.message
      );
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithEmailPassword,
    signInWithGithub,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
