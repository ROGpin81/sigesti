"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/models/User";
import { useContextAuth } from "@/providers/ProviderAuth";
import { getErrorApi } from "@/services/api";
import {
  getUsersApi,
  resetUserPasswordApi,
  updateUserRoleApi,
  updateUserStatusApi,
} from "@/services/users.service";

export default function UsuariosPage() {
  const router = useRouter();
  const { user } = useContextAuth();

  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    if (user?.role === "ADMIN") {
      cargarUsuarios();
    }
  }, [user, router]);

  async function cargarUsuarios() {
    try {
      setLoading(true);
      setMensaje("");

      const data = await getUsersApi();
      const lista = Array.isArray(data) ? data : data.data || [];
      setUsuarios(lista);
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    } finally {
      setLoading(false);
    }
  }

  async function cambiarEstado(id: number, estadoActual: boolean) {
    try {
      await updateUserStatusApi(id, { is_active: !estadoActual });
      await cargarUsuarios();
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    }
  }

  async function cambiarRol(id: number, roleActual: "ADMIN" | "QA" | "DEV") {
    const nuevoRol =
      roleActual === "QA" ? "DEV" : roleActual === "DEV" ? "QA" : "QA";

    try {
      await updateUserRoleApi(id, { role: nuevoRol });
      await cargarUsuarios();
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    }
  }

  async function resetearPassword(id: number) {
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

  if (user && user.role !== "ADMIN") return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="mt-2 text-slate-600">
            Panel administrativo de usuarios del sistema.
          </p>
        </div>

        <Link
          href="/usuarios/nuevo"
          className="rounded-lg bg-indigo-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
        >
          Nuevo usuario
        </Link>
      </div>

      {mensaje && (
        <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
          {mensaje}
        </p>
      )}

      <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6">
            <p className="text-sm text-slate-600">Cargando usuarios...</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">
                    {item.first_name} {item.last_name}
                  </td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.role}</td>
                  <td className="px-4 py-3">
                    {item.is_active ? "Activo" : "Inactivo"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/usuarios/${item.id}/editar`}
                        className="rounded-md bg-slate-200 px-3 py-1"
                      >
                        Editar
                      </Link>

                      <button
                        type="button"
                        onClick={() => cambiarEstado(item.id, item.is_active)}
                        className="rounded-md bg-amber-200 px-3 py-1"
                      >
                        {item.is_active ? "Bloquear" : "Activar"}
                      </button>

                      <button
                        type="button"
                        onClick={() => cambiarRol(item.id, item.role)}
                        className="rounded-md bg-blue-200 px-3 py-1"
                      >
                        Cambiar rol
                      </button>

                      <button
                        type="button"
                        onClick={() => resetearPassword(item.id)}
                        className="rounded-md bg-emerald-200 px-3 py-1"
                      >
                        Reset password
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    No hay usuarios registrados.
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