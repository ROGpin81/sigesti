export default function EditarTicketPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Editar Ticket</h1>
      <p>Editando ticket: {params.id}</p>
    </div>
  );
}