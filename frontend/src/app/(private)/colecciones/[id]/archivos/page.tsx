export default function ArchivosColeccionPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Archivos de la Colección</h1>
      <p>Archivos asociados a la colección: {params.id}</p>
    </div>
  );
}