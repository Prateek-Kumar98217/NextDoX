import { fetchUserProfile } from "@/actions/profile-actions";
import { ProfileRow } from "@/types/profile.types";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export function useUserProfile(userId: string | null) {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const getInitalProfile = async () => {
      const data = await fetchUserProfile(userId);
      setProfile(data);
      setLoading(false);
    };
    getInitalProfile();

    const channel = supabase
      .channel(`public:profiles:id=eq.${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          setProfile(payload.new as ProfileRow);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { profile, loading };
}
