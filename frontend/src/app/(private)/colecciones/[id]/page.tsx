"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getErrorApi } from "@/services/api";
import {
  deleteCollectionApi,
  getCollectionByIdApi,
  updateCollectionApi,
} from "@/services/tickets.service";

interface CollectionItem {
  id: number;
  ticket_id: number;
  name: string;
  description?: string;
  created_by_user_id: number;
  created_at?: string;
}

export default function ColeccionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [coleccion, setColeccion] = useState<CollectionItem | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      cargarColeccion();
    }
  }, [id]);

  async function cargarColeccion() {
    try {
      setLoading(true);
      setMensaje("");

      const data = await getCollectionByIdApi(id);
      const dataColeccion = data.coleccion || null;

      setColeccion(dataColeccion);
      setName(dataColeccion?.name || "");
      setDescription(dataColeccion?.description || "");
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setLoading(false);
    }
  }

  async function guardarCambios() {
    if (!coleccion) return;

    if (!name.trim()) {
      setMensaje("El nombre de la colección es obligatorio.");
      return;
    }

    try {
      setSaving(true);
      setMensaje("");

      const response = await updateCollectionApi(coleccion.id, {
        name,
        description: description.trim() || undefined,
      });

      setMensaje(response.mensaje || "Colección actualizada correctamente.");
      await cargarColeccion();
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setSaving(false);
    }
  }

  async function eliminarColeccion() {
    if (!coleccion) return;

    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta colección?"
    );

    if (!confirmar) return;

    try {
      setDeleting(true);
      setMensaje("");

      const response = await deleteCollectionApi(coleccion.id);
      setMensaje(response.mensaje || "Colección eliminada correctamente.");
      router.push(`/tickets/${coleccion.ticket_id}/colecciones`);
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Detalle de Colección</h1>
          <p className="mt-2 text-slate-600">
            Consulta y actualiza la información de la colección.
          </p>
        </div>

        {coleccion && (
          <Link
            href={`/tickets/${coleccion.ticket_id}/colecciones`}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
          >
            Volver al ticket
          </Link>
        )}
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
        {loading ? (
          <p className="text-sm text-slate-600">Cargando colección...</p>
        ) : !coleccion ? (
          <p className="text-sm text-slate-600">Colección no encontrada.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">ID colección</p>
              <p className="font-medium">{coleccion.id}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Ticket</p>
              <p className="font-medium">#{coleccion.ticket_id}</p>
            </div>

            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex flex-wrap gap-3">
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
                onClick={eliminarColeccion}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>

              <Link
                href={`/colecciones/${coleccion.id}/archivos`}
                className="rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
              >
                Ver archivos
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}