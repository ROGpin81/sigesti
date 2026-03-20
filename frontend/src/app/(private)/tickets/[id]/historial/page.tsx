"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { User } from "@/models/User";
import { getErrorApi } from "@/services/api";
import { getTicketHistoryApi } from "@/services/tickets.service";
import { getUsersApi } from "@/services/users.service";

interface TicketHistoryItem {
  id: number;
  ticket_id: number;
  from_status: string;
  to_status: string;
  changed_by_user_id: number;
  changed_at?: string;
  comment?: string;
}

export default function HistorialTicketPage() {
  const params = useParams();
  const id = params?.id as string;

  const [historial, setHistorial] = useState<TicketHistoryItem[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (id) {
      cargarHistorial();
    }
  }, [id]);

  async function cargarHistorial() {
    try {
      setLoading(true);
      setMensaje("");

      const [historyData, usersData] = await Promise.all([
        getTicketHistoryApi(id),
        getUsersApi(),
      ]);

      setHistorial(historyData.historial || []);

      const listaUsuarios = Array.isArray(usersData)
        ? usersData
        : usersData.data || usersData.users || [];

      setUsuarios(listaUsuarios);
    } catch (error: unknown) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Historial del Ticket</h1>
          <p className="mt-2 text-slate-600">
            Traza completa de cambios de estado y acciones.
          </p>
        </div>

        <Link
          href={`/tickets/${id}`}
          className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Volver al detalle
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
            <p className="text-sm text-slate-600">Cargando historial...</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Desde</th>
                <th className="px-4 py-3">Hacia</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Comentario</th>
              </tr>
            </thead>

            <tbody>
              {historial.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">
                    {item.changed_at
                      ? new Date(item.changed_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">{item.from_status}</td>
                  <td className="px-4 py-3">{item.to_status}</td>
                  <td className="px-4 py-3">
                    {obtenerNombreUsuario(item.changed_by_user_id)}
                  </td>
                  <td className="px-4 py-3">{item.comment || "-"}</td>
                </tr>
              ))}

              {historial.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No hay eventos registrados para este ticket.
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