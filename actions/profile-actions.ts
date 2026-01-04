"use server";

import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types/profile.types";

export const fetchUserProfile = async (userId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
    if(error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
    return data as Profile;
};

export const updateUserProfile = async (userId: string, updates: Partial<Profile>) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();
    if(error) {
        console.error("Error updating user profile:", error);
        return null;
    }
    return data as Profile;
}

export const deleteUserProfile = async (userId: string) => {
    const supabase = await createClient();
    const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
    if(error) {
        console.error("Error deleting user profile:", error);
        return null;
    }
    return true;
}