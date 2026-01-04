"use server";

import { createClient } from "@/lib/supabase/server";
import { Task } from "@/types/task.types";

export const fetchTasksByProject = async(projectId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
    if(error){
        console.error("Error fetching tasks:", error);
        return [];
    }
    return data as Task[];
};

export const createTask = async(task: Omit<Task, "id" | "created_at">) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tasks")
        .insert(task)
        .select()
        .single();
    if(error){
        console.error("Error creating task:", error);
        return null;
    }
    return data as Task;
};

export const updateTask = async(taskId: string, updates: Partial<Task>) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", taskId)
        .select()
        .single();
    if(error){
        console.error("Error updating task:", error);
        return null;
    }
    return data as Task;
};

export const deleteTask = async(taskId: string) => {
    const supabase = await createClient();
    const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)
    if(error){
        console.error("Error deleting task:", error);
        return null;
    }
    return true;
}