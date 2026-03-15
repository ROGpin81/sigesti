"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Ticket } from "@/models/Ticket";
import { User } from "@/models/User";
import { getErrorApi } from "@/services/api";
import { getTicketByIdApi } from "@/services/tickets.service";
import { getUsersApi } from "@/services/users.service";

export default function TicketDetallePage() {
  const params = useParams();
  const id = params?.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (id) {
      cargarTodo();
    }
  }, [id]);

  async function cargarTodo() {
    try {
      setLoading(true);
      setMensaje("");

      const [ticketData, usersData] = await Promise.all([
        getTicketByIdApi(id),
        getUsersApi(),
      ]);

      setTicket(ticketData.ticket || null);

      const listaUsuarios = Array.isArray(usersData)
        ? usersData
        : usersData.data || usersData.users || [];

      setUsuarios(listaUsuarios);
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    } finally {
      setLoading(false);
    }
  }

  function obtenerNombreUsuario(userId: number) {
    const usuario = usuarios.find((item) => item.id === userId);

    if (!usuario) return `Usuario #${userId}`;

    return `${usuario.first_name} ${usuario.last_name}`;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Detalle del Ticket</h1>
          <p className="mt-2 text-slate-600">
            Información completa del ticket seleccionado.
          </p>
        </div>

        {ticket && (
          <Link
            href={`/tickets/${ticket.id}/editar`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Editar
          </Link>
        )}
      </div>

      {mensaje && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {mensaje}
        </p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-600">Cargando ticket...</p>
        ) : !ticket ? (
          <p className="text-sm text-slate-600">Ticket no encontrado.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="text-sm text-slate-500">Título</p>
              <p className="font-medium">{ticket.title}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-slate-500">Descripción</p>
              <p className="font-medium">{ticket.description}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Prioridad</p>
              <p className="font-medium">{ticket.priority}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Estado</p>
              <p className="font-medium">{ticket.status}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">QA asignado</p>
              <p className="font-medium">
                {obtenerNombreUsuario(ticket.qa_user_id)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">DEV asignado</p>
              <p className="font-medium">
                {obtenerNombreUsuario(ticket.dev_user_id)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Creado por</p>
              <p className="font-medium">
                {obtenerNombreUsuario(ticket.created_by_user_id)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Fecha de creación</p>
              <p className="font-medium">
                {ticket.created_at
                  ? new Date(ticket.created_at).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}