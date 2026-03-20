"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Ticket } from "@/models/Ticket";
import { User } from "@/models/User";
import { useContextAuth } from "@/providers/ProviderAuth";
import { getErrorApi } from "@/services/api";
import {
  cancelTicketApi,
  getTicketByIdApi,
  postponeTicketApi,
  reassignTicketApi,
} from "@/services/tickets.service";
import { getUsersApi } from "@/services/users.service";

export default function AccionesTicketPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useContextAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [postponeReason, setPostponeReason] = useState("");
  const [postponeComment, setPostponeComment] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelComment, setCancelComment] = useState("");
  const [qaUserId, setQaUserId] = useState("");
  const [devUserId, setDevUserId] = useState("");
  const [reassignComment, setReassignComment] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingPostpone, setSavingPostpone] = useState(false);
  const [savingCancel, setSavingCancel] = useState(false);
  const [savingReassign, setSavingReassign] = useState(false);
  const [accionActiva, setAccionActiva] = useState<
    "POSTPONER" | "CANCELAR" | "REASIGNAR" | null
  >(null);

  useEffect(() => {
    if (id) {
      cargarTodo();
    }
  }, [id]);

  const usuariosQA = useMemo(
    () => usuarios.filter((item) => item.role === "QA" && item.is_active),
    [usuarios]
  );

  const usuariosDEV = useMemo(
    () => usuarios.filter((item) => item.role === "DEV" && item.is_active),
    [usuarios]
  );

  async function cargarTodo() {
    try {
      setLoading(true);
      setMensaje("");

      const [ticketData, usersData] = await Promise.all([
        getTicketByIdApi(id),
        getUsersApi(),
      ]);

      const dataTicket = ticketData.ticket || null;
      setTicket(dataTicket);

      const lista = Array.isArray(usersData)
        ? usersData
        : usersData.data || usersData.users || [];

      setUsuarios(lista);

      if (dataTicket) {
        setQaUserId(String(dataTicket.qa_user_id));
        setDevUserId(String(dataTicket.dev_user_id));
      }
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setLoading(false);
    }
  }

  async function posponerTicket() {
    if (!postponeReason.trim()) {
      setMensaje("Para posponer un ticket se requiere motivo.");
      return;
    }

    try {
      setSavingPostpone(true);
      setMensaje("");

      const response = await postponeTicketApi(id, {
        reason: postponeReason,
        comment: postponeComment.trim() || undefined,
      });

      setMensaje(response.mensaje || "Ticket pospuesto correctamente.");
      setPostponeReason("");
      setPostponeComment("");
      await cargarTodo();
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setSavingPostpone(false);
    }
  }

  async function cancelarTicket() {
    if (!cancelReason.trim()) {
      setMensaje("Para cancelar un ticket se requiere motivo.");
      return;
    }

    try {
      setSavingCancel(true);
      setMensaje("");

      const response = await cancelTicketApi(id, {
        reason: cancelReason,
        comment: cancelComment.trim() || undefined,
      });

      setMensaje(response.mensaje || "Ticket cancelado correctamente.");
      setCancelReason("");
      setCancelComment("");
      await cargarTodo();
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setSavingCancel(false);
    }
  }

  async function reasignarTicket() {
    if (!ticket) return;

    const qaSeleccionado = Number(qaUserId);
    const devSeleccionado = Number(devUserId);

    if (
      qaSeleccionado === ticket.qa_user_id &&
      devSeleccionado === ticket.dev_user_id
    ) {
      setMensaje("No hay cambios para aplicar en la reasignación.");
      return;
    }

    try {
      setSavingReassign(true);
      setMensaje("");

      const payload: {
        qa_user_id?: number;
        dev_user_id?: number;
        comment?: string;
      } = {
        comment: reassignComment.trim() || undefined,
      };

      if (qaSeleccionado !== ticket.qa_user_id) {
        payload.qa_user_id = qaSeleccionado;
      }

      if (devSeleccionado !== ticket.dev_user_id) {
        payload.dev_user_id = devSeleccionado;
      }

      const response = await reassignTicketApi(id, payload);

      setMensaje(response.mensaje || "Ticket reasignado correctamente.");
      setReassignComment("");
      await cargarTodo();
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setSavingReassign(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Acciones del Ticket</h1>
          <p className="mt-2 text-slate-600">
            Posponer, cancelar o reasignar responsables del ticket.
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

      {loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Cargando ticket...</p>
        </section>
      ) : !ticket ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Ticket no encontrado.</p>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">¿Qué deseas hacer?</h2>
            <p className="mt-1 text-sm text-slate-500">
              Estado actual: {ticket.status}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAccionActiva("POSTPONER")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  accionActiva === "POSTPONER"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                Postponer Ticket
              </button>

              <button
                type="button"
                onClick={() => setAccionActiva("CANCELAR")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  accionActiva === "CANCELAR"
                    ? "bg-red-600 text-white"
                    : "bg-red-100 text-red-900"
                }`}
              >
                Cancelar Ticket
              </button>

              <button
                type="button"
                onClick={() => setAccionActiva("REASIGNAR")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  accionActiva === "REASIGNAR"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-900"
                }`}
              >
                Reasignar Ticket
              </button>
            </div>
          </section>

          {!accionActiva && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">
                Selecciona una acción para continuar.
              </p>
            </section>
          )}

          {accionActiva === "POSTPONER" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Posponer ticket</h2>
            <p className="mt-1 text-sm text-slate-500">
              Estado actual: {ticket.status}
            </p>

            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Motivo (obligatorio)"
                value={postponeReason}
                onChange={(e) => setPostponeReason(e.target.value)}
              />

              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Comentario opcional"
                value={postponeComment}
                onChange={(e) => setPostponeComment(e.target.value)}
              />

              <button
                type="button"
                onClick={posponerTicket}
                disabled={savingPostpone || ticket.status === "CANCELADO"}
                className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-60"
              >
                {savingPostpone ? "Guardando..." : "Posponer"}
              </button>
            </div>
          </section>
          )}

          {accionActiva === "CANCELAR" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Cancelar ticket</h2>
            <p className="mt-1 text-sm text-slate-500">
              Solo ADMIN puede cancelar. No se puede cancelar RESUELTO.
            </p>

            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Motivo (obligatorio)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />

              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Comentario opcional"
                value={cancelComment}
                onChange={(e) => setCancelComment(e.target.value)}
              />

              <button
                type="button"
                onClick={cancelarTicket}
                disabled={
                  savingCancel ||
                  user?.role !== "ADMIN" ||
                  ticket.status === "RESUELTO" ||
                  ticket.status === "CANCELADO"
                }
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              >
                {savingCancel ? "Guardando..." : "Cancelar ticket"}
              </button>
            </div>
          </section>
          )}

          {accionActiva === "REASIGNAR" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Reasignar ticket</h2>
            <p className="mt-1 text-sm text-slate-500">
              Actualiza responsables QA y/o DEV.
            </p>

            <div className="mt-4 space-y-3">
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={qaUserId}
                onChange={(e) => setQaUserId(e.target.value)}
              >
                <option value="" disabled>
                  Seleccione QA
                </option>
                {usuariosQA.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.first_name} {item.last_name} - {item.email}
                  </option>
                ))}
              </select>

              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={devUserId}
                onChange={(e) => setDevUserId(e.target.value)}
              >
                <option value="" disabled>
                  Seleccione DEV
                </option>
                {usuariosDEV.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.first_name} {item.last_name} - {item.email}
                  </option>
                ))}
              </select>

              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Comentario opcional"
                value={reassignComment}
                onChange={(e) => setReassignComment(e.target.value)}
              />

              <button
                type="button"
                onClick={reasignarTicket}
                disabled={savingReassign}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
              >
                {savingReassign ? "Guardando..." : "Reasignar"}
              </button>
            </div>
          </section>
          )}
        </>
      )}
    </div>
  );
}