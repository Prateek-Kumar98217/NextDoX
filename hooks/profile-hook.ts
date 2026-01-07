import { fetchUserProfile } from "@/actions/profile-actions";
import { ProfileRow } from "@/types/profile.types";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/realtime-js/dist/module/RealtimeChannel";

export function useUserProfile(userId: string | null) {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) return;
    const getInitalProfile = async () => {
      const data = await fetchUserProfile(userId);
      setProfile(data);
      setLoading(false);
    };
    getInitalProfile();

    const supbsciption = supabase
      .channel(`public:profiles:id=eq.${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<ProfileRow>) => {
          setProfile(payload.new as ProfileRow);
        }
      )
      .subscribe();

    return () => {
      supbsciption.unsubscribe();
    };
  }, [userId]);

  return { profile, loading };
}
