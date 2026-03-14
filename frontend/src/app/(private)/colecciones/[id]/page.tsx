export default function ColeccionPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Colección</h1>
      <p>ID de colección: {params.id}</p>
    </div>
  );
}