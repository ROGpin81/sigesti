"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useContextAuth } from "@/providers/ProviderAuth";
import { User } from "@/models/User";
import { getErrorApi } from "@/services/api";
import { getUsersApi } from "@/services/users.service";
import { createTicketApi } from "@/services/tickets.service";

export default function NuevoTicketPage() {
  const router = useRouter();
  const { user } = useContextAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"ALTA" | "MEDIA" | "BAJA">("MEDIA");
  const [qa_user_id, setQaUserId] = useState("");
  const [dev_user_id, setDevUserId] = useState("");
  const [usuariosQA, setUsuariosQA] = useState<User[]>([]);
  const [usuariosDEV, setUsuariosDEV] = useState<User[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      const data = await getUsersApi();
      const lista = Array.isArray(data) ? data : data.data || data.users || [];

      setUsuariosQA(lista.filter((item: User) => item.role === "QA" && item.is_active));
      setUsuariosDEV(lista.filter((item: User) => item.role === "DEV" && item.is_active));
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    }
  }

  async function crearTicket() {
    setMensaje("");

    if (
      title.trim() === "" ||
      description.trim() === "" ||
      priority.trim() === "" ||
      qa_user_id === "" ||
      dev_user_id === "" ||
      !user?.id
    ) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);

      await createTicketApi({
        title,
        description,
        priority,
        qa_user_id: Number(qa_user_id),
        dev_user_id: Number(dev_user_id),
        created_by_user_id: user.id,
      });

      router.push("/tickets");
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Ticket</h1>
        <p className="mt-2 text-slate-600">
          Registra un nuevo ticket en el sistema.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={qa_user_id}
            onChange={(e) => setQaUserId(e.target.value)}
          >
            <option value="">Seleccione QA</option>
            {usuariosQA.map((item) => (
              <option key={item.id} value={item.id}>
                {item.first_name} {item.last_name} - {item.email}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={dev_user_id}
            onChange={(e) => setDevUserId(e.target.value)}
          >
            <option value="">Seleccione DEV</option>
            {usuariosDEV.map((item) => (
              <option key={item.id} value={item.id}>
                {item.first_name} {item.last_name} - {item.email}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={crearTicket}
              disabled={loading}
              className="rounded-lg bg-indigo-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar ticket"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/tickets")}
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
      </section>
    </div>
  );
}