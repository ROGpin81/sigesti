"use client";

import { useContext, useState, useEffect, useMemo } from "react";
import { ViewReact } from "@/models/ViewReact";
import { AuthUsuario } from "@/models/AuthUsuario";
import { ContextAuth } from "@/contexts/ContextAuth";

const STORAGE_TOKEN = "sigesti_token";
const STORAGE_USER = "sigesti_user";

export default function ProviderAuth(props: ViewReact) {
    const [token, setToken] = useState<string>("");
    const [user, setUser] = useState<AuthUsuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    try {
      const tokenGuardado = localStorage.getItem(STORAGE_TOKEN);
      const userGuardado = localStorage.getItem(STORAGE_USER);

      if (tokenGuardado) {
        setToken(tokenGuardado);
      }

      if (userGuardado) {
        setUser(JSON.parse(userGuardado));
      }
    } catch (error) {
      console.error("Error al restaurar la sesión:", error);
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem(STORAGE_USER);
    } finally {
      setLoading(false);
    }
  }, []);

    function guardarSesion(tokenNuevo: string, userNuevo: AuthUsuario) {
        setToken(tokenNuevo);
        setUser(userNuevo);

        localStorage.setItem(STORAGE_TOKEN, tokenNuevo);
        localStorage.setItem(STORAGE_USER, JSON.stringify(userNuevo));
    }

    function actualizarUsuario(userNuevo: AuthUsuario) {
    setUser(userNuevo);
    localStorage.setItem(STORAGE_USER, JSON.stringify(userNuevo));
    }

    function cerrarSesion() {
        setToken("");
        setUser(null);

        localStorage.removeItem(STORAGE_TOKEN);
        localStorage.removeItem(STORAGE_USER);
    }

    const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: !!token,
      guardarSesion,
      actualizarUsuario,
      cerrarSesion,
    }),
    [token, user, loading]
    );

    return (
        <ContextAuth.Provider value={value}>
            {props.children}
        </ContextAuth.Provider>
    );
}

export function useContextAuth() {
    return useContext(ContextAuth);
}