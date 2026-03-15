"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useContextAuth } from "@/providers/ProviderAuth";
import { getErrorApi } from "@/services/api";
import { changePasswordApi, getProfileApi } from "@/services/auth.service";

export default function PerfilPage() {
  const router = useRouter();
  const { user, actualizarUsuario, cerrarSesion } = useContextAuth();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [mensajePerfil, setMensajePerfil] = useState("");
  const [mensajePassword, setMensajePassword] = useState("");
  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

  async function cargarPerfil() {
    try {
      setLoadingProfile(true);
      setMensajePerfil("");

      const response = await getProfileApi();
      actualizarUsuario(response.data);
    } catch (error: any) {
      const mensaje = getErrorApi(error);
      setMensajePerfil(mensaje);

      if (error?.response?.status === 401) {
        cerrarSesion();
        router.replace("/login");
      }
    } finally {
      setLoadingProfile(false);
    }
  }

  async function cambiarPassword() {
    setMensajePassword("");

    if (
      current_password.trim() === "" ||
      new_password.trim() === "" ||
      confirm_password.trim() === ""
    ) {
      setMensajePassword("Completa todos los campos.");
      return;
    }

    if (new_password !== confirm_password) {
      setMensajePassword("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    if (current_password === new_password) {
      setMensajePassword("La nueva contraseña no puede ser igual a la actual.");
      return;
    }

    try {
      setLoadingPassword(true);

      const response = await changePasswordApi({
        current_password,
        new_password,
      });

      setMensajePassword(response.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMensajePassword(getErrorApi(error));

      if (error?.response?.status === 401) {
        cerrarSesion();
        router.replace("/login");
      }
    } finally {
      setLoadingPassword(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mi perfil</h1>
        <p className="mt-2 text-slate-600">
          Consulta tus datos y actualiza tu contraseña.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Datos del usuario</h2>

        {loadingProfile ? (
          <p className="mt-4 text-sm text-slate-600">Cargando perfil...</p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Nombre</p>
              <p className="font-medium">
                {user?.first_name} {user?.last_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Correo</p>
              <p className="font-medium">{user?.email}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Rol</p>
              <p className="font-medium">{user?.role}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Estado</p>
              <p className="font-medium">
                {user?.is_active ? "Activo" : "Inactivo"}
              </p>
            </div>
          </div>
        )}

        {mensajePerfil && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {mensajePerfil}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Cambiar contraseña</h2>

        <div className="mt-4 space-y-3">
          <input
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
            placeholder="Contraseña actual"
            value={current_password}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <input
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
            placeholder="Nueva contraseña"
            value={new_password}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
            placeholder="Confirmar nueva contraseña"
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={cambiarPassword}
            disabled={loadingPassword}
            className="rounded-lg bg-indigo-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-60"
          >
            {loadingPassword ? "Guardando..." : "Actualizar contraseña"}
          </button>

          {mensajePassword && (
            <p
              className={`rounded-lg px-3 py-2 text-sm ${
                mensajePassword.toLowerCase().includes("correctamente")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {mensajePassword}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}