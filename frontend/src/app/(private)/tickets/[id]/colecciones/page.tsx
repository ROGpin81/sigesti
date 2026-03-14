export default function ColeccionesTicketPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Colecciones del Ticket</h1>
      <p>Colecciones asociadas al ticket: {params.id}</p>
    </div>
  );
}