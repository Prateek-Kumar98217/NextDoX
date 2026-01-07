import Link from "next/link";

export default async function TasksPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <main>
      <Link href={`/projects/${id}/canvas`}>Go to canvas</Link>
      <h1>Welcome to tasks for project: {id}</h1>
    </main>
  );
}
