"use client";

import { useRouter } from "next/navigation";

export default function page() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 text-indigo-950">
            <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-8">
                <section className="w-full rounded-2xl border border-indigo-100 bg-white p-8 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">Sistema Web</p>
                    <h1 className="mt-2 text-3xl font-semibold">Sigesti</h1>
                    <p className="mt-3 text-sm text-indigo-700">
                        Sistema de Gestion de Tickets de Calidad (QA).
                    </p>

                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="rounded-lg bg-indigo-900 px-5 py-2.5 text-sm font-semibold text-indigo-50 hover:bg-indigo-800"
                        >
                            Ya tengo cuenta
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/registro")}
                            className="rounded-lg border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-900 hover:bg-indigo-100"
                        >
                            Registrarme
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}