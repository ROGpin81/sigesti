import { createContext } from "react";
import { AuthUsuario } from "@/models/AuthUsuario";

export const ContextAuth = createContext({
    token: "",
    user: {} as AuthUsuario,
    guardarSesion: (token: string, user: AuthUsuario) => {},
    cerrarSesion: () => {},
});