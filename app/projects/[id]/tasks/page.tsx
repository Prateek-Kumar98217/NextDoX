import { OpenCanvas } from "@/components/canvas/open-canvas";
import { Board } from "@/components/kanban/board";

export default async function TasksPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <main className="w-full h-full">
      <h1>Tasks</h1>
      <Board projectId={id} />
      <OpenCanvas projectId={id} />
    </main>
  );
}
