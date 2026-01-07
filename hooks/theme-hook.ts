"use client";

import { fetchThemeById, fetchThemesByOwner } from "@/actions/theme-actions";
import { ThemeRow } from "@/types/theme.types";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export function useUserThemes(ownerId: string | null) {
  const [themeList, setThemeList] = useState<ThemeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) {
      setThemeList([]);
      setLoading(false);
      return;
    }
    const getIntialThemeList = async () => {
      const data = await fetchThemesByOwner(ownerId);
      setThemeList(data);
      setLoading(false);
    };
    getIntialThemeList();
    const channel = supabase
      .channel(`public:themes:owner_id=eq.${ownerId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "themes",
          filter: `owner_id=eq.${ownerId}`,
        },
        (payload) =>
          setThemeList((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [...prev, payload.new as ThemeRow];
              case "UPDATE":
                return prev.map((t) =>
                  t.id === payload.new.id ? (payload.new as ThemeRow) : t
                );
              case "DELETE":
                return prev.filter((t) => t.id !== payload.old.id);
              default:
                return prev;
            }
          })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ownerId]);

  return { themeList, loading };
}

export function useTheme(themeId: string | null) {
  const [theme, setTheme] = useState<ThemeRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!themeId) {
      setTheme(null);
      setLoading(false);
      return;
    }
    const getIntialThemeList = async () => {
      const data = await fetchThemeById(themeId);
      setTheme(data);
      setLoading(false);
    };
    getIntialThemeList();
    const channel = supabase
      .channel(`public:themes:id=eq.${themeId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "themes",
          filter: `id=eq.${themeId}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") setTheme(null);
          else setTheme(payload.new as ThemeRow);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [themeId]);

  return { theme, loading };
}
