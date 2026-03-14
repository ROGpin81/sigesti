export default function EditarUsuarioPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Editar Usuario</h1>
      <p>Editando usuario: {params.id}</p>
    </div>
  );
}