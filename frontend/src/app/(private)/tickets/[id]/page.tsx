export default function TicketDetallePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Detalle del Ticket</h1>
      <p>ID del ticket: {params.id}</p>
    </div>
  );
}