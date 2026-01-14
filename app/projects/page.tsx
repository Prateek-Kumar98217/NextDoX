"use client";

import { AddNewProject } from "@/components/project/add-project";
import { useAuth } from "@/contexts/auth-context";
import { useUserProjects } from "@/hooks/project-hook";
import Link from "next/link";

export default function ProjectsPage() {
  const { user } = useAuth();
  const { projectList, loading } = useUserProjects(user?.id ?? null);
  if (!user || loading) return null;
  return (
    <main>
      <section>
        <AddNewProject />
      </section>
      <div className="flex flex-col">
        {projectList.map((project) => {
          return (
            <div key={project.id} className="gap-3 p-2">
              <Link
                href={`/projects/${project.id}/tasks`}
                className="flex justify-between w-full"
              >
                <div>{project.title}</div>
                <div>{project.description}</div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
