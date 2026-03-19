"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Ticket } from "@/models/Ticket";
import { getErrorApi } from "@/services/api";
import {
  createCollectionByTicketApi,
  deleteCollectionApi,
  getCollectionsByTicketApi,
  getTicketByIdApi,
} from "@/services/tickets.service";

interface CollectionItem {
  id: number;
  ticket_id: number;
  name: string;
  description?: string;
  created_by_user_id: number;
  created_at?: string;
}

export default function ColeccionesTicketPage() {
  const params = useParams();
  const id = params?.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [colecciones, setColecciones] = useState<CollectionItem[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      cargarTodo();
    }
  }, [id]);

  async function cargarTodo() {
    try {
      setLoading(true);
      setMensaje("");

      const [ticketData, collectionsData] = await Promise.all([
        getTicketByIdApi(id),
        getCollectionsByTicketApi(id),
      ]);

      setTicket(ticketData.ticket || null);
      setColecciones(collectionsData.colecciones || []);
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setLoading(false);
    }
  }

  async function crearColeccion() {
    if (!name.trim()) {
      setMensaje("El nombre de la colección es obligatorio.");
      return;
    }

    try {
      setSaving(true);
      setMensaje("");

      const response = await createCollectionByTicketApi(id, {
        name,
        description: description.trim() || undefined,
      });

      setMensaje(response.mensaje || "Colección creada correctamente.");
      setName("");
      setDescription("");
      await cargarTodo();
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setSaving(false);
    }
  }

  async function eliminarColeccion(idColeccion: number) {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta colección?"
    );

    if (!confirmar) return;

    try {
      setDeletingId(idColeccion);
      setMensaje("");

      const response = await deleteCollectionApi(idColeccion);
      setMensaje(response.mensaje || "Colección eliminada correctamente.");
      await cargarTodo();
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Colecciones del Ticket</h1>
          <p className="mt-2 text-slate-600">
            Organiza evidencias por ticket antes de gestionar archivos.
          </p>
          {ticket && (
            <p className="mt-1 text-sm text-slate-500">
              Ticket #{ticket.id} - {ticket.title}
            </p>
          )}
        </div>

        <Link
          href={`/tickets/${id}`}
          className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Volver al detalle
        </Link>
      </div>

      {mensaje && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            mensaje.toLowerCase().includes("correct")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {mensaje}
        </p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Nueva colección</h2>

        <div className="mt-4 space-y-3">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Nombre de la colección"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            type="button"
            onClick={crearColeccion}
            disabled={saving}
            className="rounded-lg bg-indigo-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Crear colección"}
          </button>
        </div>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6">
            <p className="text-sm text-slate-600">Cargando colecciones...</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Creado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {colecciones.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.description || "-"}</td>
                  <td className="px-4 py-3">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/colecciones/${item.id}`}
                        className="rounded-md bg-slate-200 px-3 py-1"
                      >
                        Ver
                      </Link>

                      <button
                        type="button"
                        onClick={() => eliminarColeccion(item.id)}
                        disabled={deletingId === item.id}
                        className="rounded-md bg-red-200 px-3 py-1 disabled:opacity-60"
                      >
                        {deletingId === item.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {colecciones.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No hay colecciones registradas para este ticket.
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