"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContextAuth } from "@/providers/ProviderAuth";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, isAuthenticated, user, cerrarSesion } = useContextAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  function handleLogout() {
    cerrarSesion();
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-slate-900 p-6 text-white">
          <h2 className="text-2xl font-bold">SIGESTI</h2>
          <p className="mt-2 text-sm text-slate-300">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {user?.role}
          </p>

          <nav className="mt-8 space-y-3">
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-800" href="/dashboard">
              Dashboard
            </Link>

            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-800" href="/perfil">
              Perfil
            </Link>

            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-800" href="/tickets">
              Tickets
            </Link>

            {user?.role === "ADMIN" && (
              <Link className="block rounded-lg px-3 py-2 hover:bg-slate-800" href="/usuarios">
                Usuarios
              </Link>
            )}

            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-800" href="/estadisticas">
              Estadísticas
            </Link>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"
          >
            Cerrar sesión
          </button>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}