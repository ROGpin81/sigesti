"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContextAuth } from "@/providers/ProviderAuth";
import { getErrorApi } from "@/services/api";
import { createUserApi } from "@/services/users.service";

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const { user } = useContextAuth();

  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "QA" | "DEV">("QA");
  const [is_active, setIsActive] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  if (user && user.role !== "ADMIN") {
    router.replace("/dashboard");
    return null;
  }

  async function crearUsuario() {
    setMensaje("");

    if (
      email.trim() === "" ||
      first_name.trim() === "" ||
      last_name.trim() === "" ||
      password.trim() === ""
    ) {
      setMensaje("Completa todos los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);

      await createUserApi({
        email,
        first_name,
        last_name,
        password,
        role,
        is_active,
      });

      router.push("/usuarios");
    } catch (error: any) {
      setMensaje(getErrorApi(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Usuario</h1>
        <p className="mt-2 text-slate-600">
          El administrador crea cuentas para QA, DEV o ADMIN.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

          <input
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Contraseña temporal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={crearUsuario}
              disabled={loading}
              className="rounded-lg bg-indigo-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar usuario"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/usuarios")}
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