"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getErrorApi, loginApi } from "@/services/api";
import { useContextAuth } from "@/providers/ProviderAuth";

export default function Login() {
    const router = useRouter();
    const { guardarSesion } = useContextAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function iniciarSesion() {
        setError("");

        if (email === "" || password === "") {
            setError("Correo y contraseña son obligatorios.");
            return;
        }

        try {
            const data = await loginApi({ email, password });
            guardarSesion(data.token, data.user);
            router.push("/dashboard");
        } catch (err: any) {
            setError(getErrorApi(err));
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 text-indigo-950">
            <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-8">
                <section className="w-full rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">Acceso</p>
                    <h1 className="mt-2 text-2xl font-semibold">Iniciar sesión</h1>

                    <div className="mt-6 space-y-3">
                        <input
                            className="w-full rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-900 outline-none"
                            placeholder="Correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            className="w-full rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-900 outline-none"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={iniciarSesion}
                            className="w-full rounded-lg bg-indigo-900 px-4 py-2.5 text-sm font-semibold text-indigo-50 hover:bg-indigo-800"
                        >
                            Iniciar sesión
                        </button>

                        <button
                            type="button"
                            className="text-sm font-semibold text-indigo-700 underline underline-offset-4"
                        >
                            Olvidé mi contraseña
                        </button>

                        {error && (
                            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}