"use server";

import { createClient } from "@/lib/supabase/server";
import { Project } from "@/types/project.types";

export const fetchProjectsByOwner = async (ownerId: string) => {
    const supabase= await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });
    if(error) {
        console.error("Error fetching projects:", error);
        return [];
    }
    return data as Project[];
};

export const createProject = async (project: Omit<Project, "id" | "created_at">) => {
    const supabase= await createClient();
    const { data, error } = await supabase
        .from("projects")
        .insert(project)
        .select()
        .single();
    if(error) {
        console.error("Error creating project:", error);
        return null;
    }
    return data as Project;
};

export const updateProject = async (projectId: string, updates: Partial<Project>) => {
    const supabase= await createClient();
    const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", projectId)
        .select()
        .single();
    if(error) {
        console.error("Error updating project:", error);
        return null;
    }
    return data as Project;
}

export const deleteProject = async (projectId: string) => {
    const supabase= await createClient();
    const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
    if(error) {
        console.error("Error deleting project:", error);
        return null;
    }
    return true;
};