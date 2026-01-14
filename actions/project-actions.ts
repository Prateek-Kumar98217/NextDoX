"use server";

import { createClient } from "@/lib/supabase/server";
import {
  ProjectInsert,
  ProjectRow,
  ProjectUpdate,
} from "@/types/project.types";

export const fetchProjectsByOwner = async (ownerId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return data as ProjectRow[];
};

export const fetchProjectById = async (projectId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();
  if (error) {
    console.error(
      "Error while fetching the required project data: ",
      error.message
    );
    return null;
  }
  return data as ProjectRow;
};

export const createProject = async (project: ProjectInsert) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();
  if (error) {
    console.error("Error creating project:", error);
    return null;
  }
};

export const updateProject = async (
  projectId: string,
  updates: ProjectUpdate
) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", projectId)
    .select()
    .single();
  if (error) {
    console.error("Error updating project:", error);
    return null;
  }
};

export const deleteProject = async (projectId: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);
  if (error) {
    console.error("Error deleting project:", error);
    return null;
  }
  return true;
};
