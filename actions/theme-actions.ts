import { createClient } from "@/lib/supabase/client";
import { Theme } from "@/types/theme.types";

const supabase = createClient();

export const fetchThemesByOwner = async (ownerId: string) => {
    const { data, error } = await supabase
        .from("themes")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });
    if(error) {
        console.error("Error fetching themes:", error);
        return [];
    }
    return data as Theme[];
};

export const createTheme = async (theme: Omit<Theme, "id" | "created_at">) => {
    const { data, error } = await supabase
        .from("themes")
        .insert(theme)
        .single();
    if(error) {
        console.error("Error creating theme:", error);
        return null;
    }
    return data as Theme;
};

export const updateTheme = async (themeId: string, updates: Partial<Theme>) => {
    const { data, error } = await supabase
        .from("themes")
        .update(updates)
        .eq("id", themeId)
        .single();
    if(error) {
        console.error("Error updating theme:", error);
        return null;
    }
    return data as Theme;
};

export const deleteTheme = async (themeId: string) => {
    const { error } = await supabase
        .from("themes")
        .delete()
        .eq("id", themeId)
        .single();
    if(error) {
        console.error("Error deleting theme:", error);
        return null;
    }
    return true;
};