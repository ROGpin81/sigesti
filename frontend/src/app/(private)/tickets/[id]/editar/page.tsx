"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getErrorApi } from "@/services/api";
import { getTicketByIdApi, updateTicketApi } from "@/services/tickets.service";

export default function EditarTicketPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"ALTA" | "MEDIA" | "BAJA">("MEDIA");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      cargarTicket();
    }
  }, [id]);

  async function cargarTicket() {
    try {
      setLoading(true);
      setMensaje("");

      const data = await getTicketByIdApi(id);
      const ticket = data.ticket;

      setTitle(ticket.title);
      setDescription(ticket.description);
      setPriority(ticket.priority);
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    } finally {
      setLoading(false);
    }
  }

  async function guardarCambios() {
    if (
      title.trim() === "" ||
      description.trim() === "" ||
      priority.trim() === ""
    ) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    try {
      setSaving(true);
      setMensaje("");

      await updateTicketApi(id, {
        title,
        description,
        priority,
      });

      router.push(`/tickets/${id}`);
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Ticket</h1>
        <p className="mt-2 text-slate-600">
          Actualiza la información básica del ticket.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-600">Cargando ticket...</p>
        ) : (
          <div className="space-y-4">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "ALTA" | "MEDIA" | "BAJA")
              }
            >
              <option value="ALTA">ALTA</option>
              <option value="MEDIA">MEDIA</option>
              <option value="BAJA">BAJA</option>
            </select>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={guardarCambios}
                disabled={saving}
                className="rounded-lg bg-indigo-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>

              <button
                type="button"
                onClick={() => router.push(`/tickets/${id}`)}
                className="rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
              >
                Cancelar
              </button>
            </div>

            {mensaje && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {mensaje}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}