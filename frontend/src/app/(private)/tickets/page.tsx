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

  const formatUserDisplay = (name?: string | null, id?: number) => {
    if (name && name.trim()) {
      return name;
    }

    return id ? `#${id}` : "-";
  };

  useEffect(() => {
    cargarTickets();
  }, []);

  async function cargarTickets() {
    try {
      setLoading(true);
      setMensaje("");

      const data = await getTicketsApi();
      setTickets(data.tickets || []);
    } catch (error: unknown) {
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

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6">
            <p className="text-sm text-slate-600">Cargando tickets...</p>
          </div>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="w-12 px-4 py-3">ID</th>
                <th className="w-[32%] px-4 py-3">Título</th>
                <th className="w-24 px-4 py-3">Prioridad</th>
                <th className="w-28 px-4 py-3">Estado</th>
                <th className="w-40 px-4 py-3">QA</th>
                <th className="w-40 px-4 py-3">DEV</th>
                <th className="w-48 px-4 py-3">Creado</th>
                <th className="w-32 px-4 py-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{ticket.id}</td>
                  <td className="px-4 py-3 whitespace-normal wrap-break-word">{ticket.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{ticket.priority}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{ticket.status}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatUserDisplay(ticket.qa_user_name, ticket.qa_user_id)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatUserDisplay(ticket.dev_user_name, ticket.dev_user_id)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {ticket.created_at
                      ? new Date(ticket.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="relative px-4 py-3">
                    <details className="group relative inline-block">
                      <summary className="flex w-24 cursor-pointer list-none items-center justify-between gap-2 whitespace-nowrap rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 [&::-webkit-details-marker]:hidden">
                        <span>Acciones</span>
                        <svg
                          className="h-4 w-4 transition group-open:rotate-180"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 8L10 13L15 8"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </summary>

                      <div className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                        <Link
                          href={`/tickets/${ticket.id}`}
                          className="block border-b border-slate-100 px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50"
                        >
                          Ver ticket
                        </Link>
                        <Link
                          href={`/tickets/${ticket.id}/editar`}
                          className="block border-b border-slate-100 px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-blue-50"
                        >
                          Editar
                        </Link>
                        <Link
                          href={`/tickets/${ticket.id}/estado`}
                          className="block border-b border-slate-100 px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-indigo-50"
                        >
                          Cambiar estado
                        </Link>
                        <Link
                          href={`/tickets/${ticket.id}/acciones`}
                          className="block border-b border-slate-100 px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-amber-50"
                        >
                          Registrar accion
                        </Link>
                        <Link
                          href={`/tickets/${ticket.id}/historial`}
                          className="block border-b border-slate-100 px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50"
                        >
                          Ver historial
                        </Link>
                        <Link
                          href={`/tickets/${ticket.id}/colecciones`}
                          className="block px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-emerald-50"
                        >
                          Ver colecciones
                        </Link>
                      </div>
                    </details>
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