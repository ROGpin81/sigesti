"use client";

import Link from "next/link";
import { useContextAuth } from "@/providers/ProviderAuth";

export default function DashboardPage() {
  const { user } = useContextAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Bienvenido, {user?.first_name} {user?.last_name}
        </h1>
        <p className="mt-2 text-slate-600">
          Rol actual: <span className="font-semibold">{user?.role}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/perfil"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">Mi perfil</h2>
          <p className="mt-2 text-sm text-slate-600">
            Consultar información del usuario y cambiar contraseña.
          </p>
        </Link>

        <Link
          href="/tickets"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">Tickets</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ver y administrar tickets del sistema.
          </p>
        </Link>

        {user?.role === "ADMIN" && (
          <Link
            href="/usuarios"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Usuarios</h2>
            <p className="mt-2 text-sm text-slate-600">
              Gestión administrativa de usuarios.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}