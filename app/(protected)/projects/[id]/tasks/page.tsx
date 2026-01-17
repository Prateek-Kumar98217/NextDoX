import { Board } from "@/components/kanban/board";

export default async function TasksPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <div className="flex justify-center items-center w-[80vw]">
      <Board projectId={id} />
    </div>
  );
}
