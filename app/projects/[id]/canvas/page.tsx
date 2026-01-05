export default async function TasksPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <main>
      <h1>Welcome to canvas for project: {id}</h1>
    </main>
  );
}
