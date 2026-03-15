export default function HistorialTicketPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Historial del Ticket</h1>
      <p>Historial del ticket: {params.id}</p>
    </div>
  );
}