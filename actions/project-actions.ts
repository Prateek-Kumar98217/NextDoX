import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types/project.types";

const supabase=createClient();

export const fetchProjectsByOwner = async (ownerId: string) => {
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
    const { data, error } = await supabase
        .from("projects")
        .insert(project)
        .single();
    if(error) {
        console.error("Error creating project:", error);
        return null;
    }
    return data as Project;
};

export const updateProject = async (projectId: string, updates: Partial<Project>) => {
    const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", projectId)
        .single();
    if(error) {
        console.error("Error updating project:", error);
        return null;
    }
    return data as Project;
}

export const deleteProject = async (projectId: string) => {
    const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .single();
    if(error) {
        console.error("Error deleting project:", error);
        return null;
    }
    return true;
};