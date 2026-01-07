"use client";

import {
  fetchProjectById,
  fetchProjectsByOwner,
} from "@/actions/project-actions";
import { ProjectRow } from "@/types/project.types";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export function useUserProjects(ownerId: string | null) {
  const [projectList, setProjectList] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) {
      setProjectList([]);
      setLoading(false);
      return;
    }
    const getInitialProjectList = async () => {
      const data = await fetchProjectsByOwner(ownerId);
      setProjectList(data);
      setLoading(false);
    };
    getInitialProjectList();
    const channel = supabase
      .channel(`public:projects:owner_id=eq.${ownerId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `owner_id=eq.${ownerId}`,
        },
        (payload) =>
          setProjectList((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [...prev, payload.new as ProjectRow];
              case "UPDATE":
                return prev.map((t) =>
                  t.id === payload.new.id ? (payload.new as ProjectRow) : t
                );
              case "DELETE":
                return prev.filter((t) => t.id !== payload.old.id);
              default:
                return prev;
            }
          })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ownerId]);

  return { projectList, loading };
}

export function useProject(projectId: string | null) {
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setLoading(false);
      return;
    }
    const getInitialProject = async () => {
      const data = await fetchProjectById(projectId);
      setProject(data);
      setLoading(false);
    };
    getInitialProject();
    const channel = supabase
      .channel(`public:projects:id=eq.${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `id=eq.${projectId}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") setProject(null);
          else setProject(payload.new as ProjectRow);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return { project, loading };
}
