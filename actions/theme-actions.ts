"use server";

import { createClient } from "@/lib/supabase/server";
import { ThemeInsert, ThemeRow, ThemeUpdate } from "@/types/theme.types";

export const fetchThemesByOwner = async (ownerId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching themes:", error);
    return [];
  }
  return data as ThemeRow[];
};

export const fetchThemeById = async (themeId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .eq("id", themeId)
    .single();
  if (error) {
    console.error("Error fetching the required theme data: ", error.message);
    return null;
  }
  return data as ThemeRow;
};

export const createTheme = async (theme: ThemeInsert) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("themes")
    .insert(theme)
    .select()
    .single();
  if (error) {
    console.error("Error creating theme:", error);
    return null;
  }
  return data as ThemeRow;
};

export const updateTheme = async (themeId: string, updates: ThemeUpdate) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("themes")
    .update(updates)
    .eq("id", themeId)
    .select()
    .single();
  if (error) {
    console.error("Error updating theme:", error);
    return null;
  }
  return data as ThemeRow;
};

export const deleteTheme = async (themeId: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("themes").delete().eq("id", themeId);
  if (error) {
    console.error("Error deleting theme:", error);
    return null;
  }
  return true;
};
