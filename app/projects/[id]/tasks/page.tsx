import { Board } from "@/components/kanban/board";

export default async function TasksPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <main className="w-full h-full">
      <h1>Welcome to tasks for project: {id}</h1>
      <Board projectId={id} />
    </main>
  );
}
