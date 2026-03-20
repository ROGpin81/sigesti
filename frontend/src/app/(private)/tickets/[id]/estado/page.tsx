"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Ticket } from "@/models/Ticket";
import { getErrorApi } from "@/services/api";
import {
  getTicketByIdApi,
  updateTicketStatusApi,
} from "@/services/tickets.service";

const STATUS_FLOW: Record<string, string[]> = {
  ABIERTO: ["VALIDACION_QA"],
  VALIDACION_QA: ["CORRECCION_DEV"],
  CORRECCION_DEV: ["RETEST"],
  RETEST: ["RESUELTO", "CORRECCION_DEV"],
  POSPUESTO: ["VALIDACION_QA", "CORRECCION_DEV", "RETEST"],
  RESUELTO: [],
  CANCELADO: [],
};

export default function EstadoTicketPage() {
  const params = useParams();
  const id = params?.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [toStatus, setToStatus] = useState("");
  const [comment, setComment] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      cargarTicket();
    }
  }, [id]);

  const estadosPermitidos = useMemo(() => {
    if (!ticket) return [];
    return STATUS_FLOW[ticket.status] || [];
  }, [ticket]);

  async function cargarTicket() {
    try {
      setLoading(true);
      setMensaje("");

      const data = await getTicketByIdApi(id);
      const dataTicket = data.ticket || null;

      setTicket(dataTicket);

      const siguientes = STATUS_FLOW[dataTicket?.status] || [];
      setToStatus(siguientes[0] || "");
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setLoading(false);
    }
  }

  async function cambiarEstado() {
    if (!ticket) return;

    if (!toStatus || toStatus.trim() === "") {
      setMensaje("Selecciona un estado destino válido.");
      return;
    }

    if (toStatus === "ABIERTO") {
      setMensaje("No se permite volver a ABIERTO.");
      return;
    }

    try {
      setSaving(true);
      setMensaje("");

      const response = await updateTicketStatusApi(id, {
        to_status: toStatus,
        comment: comment.trim() || undefined,
      });

      setMensaje(response.mensaje || "Estado actualizado correctamente.");
      setComment("");
      await cargarTicket();
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estado del Ticket</h1>
          <p className="mt-2 text-slate-600">
            Gestiona la transición de estados del ticket.
          </p>
        </div>

        <Link
          href={`/tickets/${id}`}
          className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Volver al detalle
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-600">Cargando ticket...</p>
        ) : !ticket ? (
          <p className="text-sm text-slate-600">Ticket no encontrado.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Ticket</p>
              <p className="font-medium">#{ticket.id} - {ticket.title}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Estado actual</p>
              <p className="font-medium">{ticket.status}</p>
            </div>

            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={toStatus}
              onChange={(e) => setToStatus(e.target.value)}
              disabled={estadosPermitidos.length === 0}
            >
              {estadosPermitidos.length === 0 ? (
                <option value="">No hay transiciones disponibles</option>
              ) : (
                estadosPermitidos.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))
              )}
            </select>

            <textarea
              className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Comentario opcional"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              type="button"
              onClick={cambiarEstado}
              disabled={saving || estadosPermitidos.length === 0}
              className="rounded-lg bg-indigo-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Cambiar estado"}
            </button>

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
          </div>
        )}
      </section>
    </div>
  );
}