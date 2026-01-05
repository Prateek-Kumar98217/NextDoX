export default async function TasksPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <main>
      <h1>Welcome to tasks for project: {id}</h1>
    </main>
  );
}
