import Link from "next/link";

export default async function CanvasPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <main>
      <Link href={`/projects/${id}/tasks`}>Go to tasks</Link>
      <h1>Welcome to canvas for project: {id}</h1>
    </main>
  );
}
