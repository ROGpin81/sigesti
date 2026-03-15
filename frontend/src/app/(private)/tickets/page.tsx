"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Ticket } from "@/models/Ticket";
import { getErrorApi } from "@/services/api";
import { getTicketsApi } from "@/services/tickets.service";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarTickets();
  }, []);

  async function cargarTickets() {
    try {
      setLoading(true);
      setMensaje("");

      const data = await getTicketsApi();
      setTickets(data.tickets || []);
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="mt-2 text-slate-600">
            Listado principal de tickets del sistema.
          </p>
        </div>

        <Link
          href="/tickets/nuevo"
          className="rounded-lg bg-indigo-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
        >
          Nuevo ticket
        </Link>
      </div>

      {mensaje && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {mensaje}
        </p>
      )}

      <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6">
            <p className="text-sm text-slate-600">Cargando tickets...</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Prioridad</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">QA</th>
                <th className="px-4 py-3">DEV</th>
                <th className="px-4 py-3">Creado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{ticket.id}</td>
                  <td className="px-4 py-3">{ticket.title}</td>
                  <td className="px-4 py-3">{ticket.priority}</td>
                  <td className="px-4 py-3">{ticket.status}</td>
                  <td className="px-4 py-3">{ticket.qa_user_id}</td>
                  <td className="px-4 py-3">{ticket.dev_user_id}</td>
                  <td className="px-4 py-3">
                    {ticket.created_at
                      ? new Date(ticket.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="rounded-md bg-slate-200 px-3 py-1"
                      >
                        Ver
                      </Link>

                      <Link
                        href={`/tickets/${ticket.id}/editar`}
                        className="rounded-md bg-blue-200 px-3 py-1"
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {tickets.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
                    No hay tickets registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}