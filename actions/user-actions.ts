import { createClient } from "@/lib/supabase/client";
import { User } from "@/types/user.types";

const supabase = createClient();

export const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
    if(error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
    return data as User;
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
    const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .single();
    if(error) {
        console.error("Error updating user profile:", error);
        return null;
    }
    return data as User;
}

export const deleteUserProfile = async (userId: string) => {
    const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userId)
        .single();
    if(error) {
        console.error("Error deleting user profile:", error);
        return null;
    }
    return true;
}