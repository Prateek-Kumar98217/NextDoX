import { fetchTasksByProject } from "@/actions/task-actions";
import { supabase } from "@/lib/supabase/client";
import { TaskRow } from "@/types/task.types";
import { useEffect, useState } from "react";

export function useProjectTasks(projectId: string | null) {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    const getIntialTasks = async () => {
      const data = await fetchTasksByProject(projectId);
      setTasks(data);
      setLoading(false);
    };
    getIntialTasks();

    const channel = supabase
      .channel(`public:tasks:project_id=eq${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          setTasks((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [...prev, payload.new as TaskRow];
              case "UPDATE":
                return prev.map((t) =>
                  t.id === payload.new.id ? (payload.new as TaskRow) : t
                );
              case "DELETE":
                return prev.filter((t) => t.id !== payload.old.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return { tasks, loading };
}
