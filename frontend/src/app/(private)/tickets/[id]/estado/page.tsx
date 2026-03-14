export default function EstadoTicketPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Estado del Ticket</h1>
      <p>Cambio de estado para ticket: {params.id}</p>
    </div>
  );
}