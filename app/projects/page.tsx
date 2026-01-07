"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useUserProjects } from "@/hooks/project-hook";
import Link from "next/link";
import { useState } from "react";

export default function ProjectsPage() {
  const { user } = useAuth();
  const { projectList, loading } = useUserProjects(user?.id ?? null);
  const [create, setCreate] = useState(false);
  if (!user || loading) return null;
  return (
    <main>
      <section>
        <Button
          onClick={() => {
            setCreate(true);
          }}
        >
          New Project...
        </Button>
      </section>
      <ul>
        {projectList.map((project) => {
          return (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}/tasks`}
                className="flex justify-around items-center"
              >
                <div>{project.title}</div>
                <div>{project.description}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
