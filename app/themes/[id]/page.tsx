export default async function ThemePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <main>
      <h1>This is the page for the theme with ID: {id}</h1>
    </main>
  );
}
