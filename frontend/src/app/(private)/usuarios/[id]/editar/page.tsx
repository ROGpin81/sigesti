"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useContextAuth } from "@/providers/ProviderAuth";
import { getErrorApi } from "@/services/api";
import {
  getUserByIdApi,
  resetUserPasswordApi,
  updateUserApi,
  updateUserRoleApi,
  updateUserStatusApi,
} from "@/services/users.service";

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useContextAuth();

  const id = params?.id as string;

  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [role, setRole] = useState<"ADMIN" | "QA" | "DEV">("QA");
  const [is_active, setIsActive] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    if (id) {
      cargarUsuario();
    }
  }, [user, router, id]);

  async function cargarUsuario() {
    try {
      setLoading(true);
      setMensaje("");

      const data = await getUserByIdApi(id);
      const usuario = data.data || data;

      setEmail(usuario.email);
      setFirstName(usuario.first_name);
      setLastName(usuario.last_name);
      setRole(usuario.role);
      setIsActive(usuario.is_active);
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    } finally {
      setLoading(false);
    }
  }

  async function guardarCambios() {
    try {
      setSaving(true);
      setMensaje("");

      await updateUserApi(id, {
        email,
        first_name,
        last_name,
      });

      await updateUserRoleApi(id, { role });
      await updateUserStatusApi(id, { is_active });

      setMensaje("Usuario actualizado correctamente.");
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    } finally {
      setSaving(false);
    }
  }

  async function resetearPassword() {
    const nuevaPassword = window.prompt(
      "Escribe la nueva contraseña temporal:"
    );

    if (!nuevaPassword || nuevaPassword.trim() === "") return;

    try {
      await resetUserPasswordApi(id, { password: nuevaPassword });
      setMensaje("Contraseña reseteada correctamente.");
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    }
  }

  if (!user) {
    return (
      <div>
        <p>Cargando sesión...</p>
      </div>
    );
  }

  if (user.role !== "ADMIN") return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Usuario</h1>
        <p className="mt-2 text-slate-600">
          Edita datos, rol, estado y contraseña del usuario.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-600">Cargando usuario...</p>
        ) : (
          <div className="space-y-4">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Nombre"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Apellido"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />

            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "ADMIN" | "QA" | "DEV")
              }
            >
              <option value="QA">QA</option>
              <option value="DEV">DEV</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={is_active}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Usuario activo
            </label>

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
                onClick={resetearPassword}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Resetear contraseña
              </button>

              <button
                type="button"
                onClick={() => router.push("/usuarios")}
                className="rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
              >
                Volver
              </button>
            </div>

            {mensaje && (
              <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
                {mensaje}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}