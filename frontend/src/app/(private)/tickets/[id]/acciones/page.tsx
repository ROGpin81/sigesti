export default function AccionesTicketPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Acciones del Ticket</h1>
      <p>Acciones disponibles para ticket: {params.id}</p>
    </div>
  );
}