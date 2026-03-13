"use client";

import { useContext, useState } from "react";
import { ViewReact } from "@/models/ViewReact";
import { AuthUsuario } from "@/models/AuthUsuario";
import { ContextAuth } from "@/contexts/ContextAuth";

export default function ProviderAuth(props: ViewReact) {
    const [token, setToken] = useState<string>("");
    const [user, setUser] = useState<AuthUsuario | null>(null);

    function guardarSesion(tokenNuevo: string, userNuevo: AuthUsuario) {
        setToken(tokenNuevo);
        setUser(userNuevo);
    }

    function cerrarSesion() {
        setToken("");
        setUser(null);
    }

    return (
        <ContextAuth.Provider value={{ token, user, guardarSesion, cerrarSesion }}>
            {props.children}
        </ContextAuth.Provider>
    );
}

export function useContextAuth() {
    return useContext(ContextAuth);
}