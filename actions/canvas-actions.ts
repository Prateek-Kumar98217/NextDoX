"use server";
import { createClient } from "@/lib/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveCanvas(projectId: string, canvasData: any) {
  const supabase = await createClient();

  // Upsert: Update if exists, Insert if new
  const { error } = await supabase.from("project_canvas").upsert(
    {
      project_id: projectId,
      data: canvasData,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "project_id" }
  );

  if (error) {
    console.error("Error saving canvas:", error);
  }
}

export async function loadCanvas(projectId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_canvas")
    .select("data")
    .eq("project_id", projectId)
    .single();

  return data?.data || null;
}
