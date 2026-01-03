import { createClient } from "@/lib/supabase/client";
import { Task } from "@/types/task.types";

const supabase=createClient();

export const fetchTasksByProject = async(projectId: string) => {
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
    const { data, error } = await supabase
        .from("tasks")
        .insert(task)
        .single();
    if(error){
        console.error("Error creating task:", error);
        return null;
    }
    return data as Task;
};

export const updateTask = async(taskId: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", taskId)
        .single();
    if(error){
        console.error("Error updating task:", error);
        return null;
    }
    return data as Task;
};

export const deleteTask = async(taskId: string) => {
    const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)
        .single();
    if(error){
        console.error("Error deleting task:", error);
        return null;
    }
    return true;
}