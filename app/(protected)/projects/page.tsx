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
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex justify-center">
      <div className="w-full max-w-5xl px-6 py-10 flex flex-col gap-8">
        <section className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Your Projects
          </h1>
          <AddNewProject />
        </section>

        <section className="flex flex-col gap-4">
          {projectList.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}/tasks`}
              className="
                group rounded-2xl border border-neutral-800
                bg-neutral-900/70 backdrop-blur
                hover:bg-neutral-800/80 hover:border-neutral-700
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500
              "
            >
              <div className="flex flex-col gap-1 p-5">
                <h2 className="text-lg font-medium text-neutral-100 group-hover:text-white">
                  {project.title}
                </h2>

                <p className="text-sm text-neutral-400 line-clamp-2">
                  {project.description || "No description provided."}
                </p>
              </div>
            </Link>
          ))}

          {projectList.length === 0 && (
            <div className="text-center text-neutral-500 py-12">
              No projects yet — create one to get started.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
