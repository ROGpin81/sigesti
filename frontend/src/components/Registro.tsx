"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registroApi, getErrorApi } from "@/services/api";

export default function Registro() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"QA" | "DEV">("QA");
    const [mensaje, setMensaje] = useState("");

    async function registrarCuenta() {
        setMensaje("");

        if (email === "" || first_name === "" || last_name === "" || password === "") {
            setMensaje("Completa todos los campos.");
            return;
        }

        try {
            await registroApi({
                email,
                first_name,
                last_name,
                password,
                role,
                is_active: true,
            });

            setMensaje("Cuenta registrada con exito.");
            router.push("/login");
        } catch (error: any) {
            setMensaje(getErrorApi(error));
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 text-indigo-950">
            <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-8">
                <section className="w-full rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold">Registro</h1>

                    <div className="mt-4 space-y-3">
                        <input
                            className="w-full rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm"
                            placeholder="Correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            className="w-full rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm"
                            placeholder="Nombre"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                        <input
                            className="w-full rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm"
                            placeholder="Apellido"
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                        />

                        <input
                            type="password"
                            className="w-full rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <select
                            className="w-full rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm"
                            value={role}
                            onChange={(e) => setRole(e.target.value as "QA" | "DEV")}
                        >
                            <option value="QA">QA</option>
                            <option value="DEV">DEV</option>
                        </select>

                        <button
                            type="button"
                            onClick={registrarCuenta}
                            className="w-full rounded-lg bg-indigo-900 px-4 py-2.5 text-sm font-semibold text-indigo-50 hover:bg-indigo-800"
                        >
                            Registrar cuenta
                        </button>

                        {mensaje !== "" && <p className="text-sm text-indigo-700">{mensaje}</p>}
                    </div>
                </section>
            </main>
        </div>
    );
}