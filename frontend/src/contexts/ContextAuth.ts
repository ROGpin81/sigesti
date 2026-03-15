import { createContext } from "react";
import { AuthUsuario } from "@/models/AuthUsuario";

export interface ContextAuthType {
  token: string;
  user: AuthUsuario | null;
  loading: boolean;
  isAuthenticated: boolean;
  guardarSesion: (token: string, user: AuthUsuario) => void;
  actualizarUsuario: (user: AuthUsuario) => void;
  cerrarSesion: () => void;
}

export const ContextAuth = createContext<ContextAuthType>({
    token: "",
    user: null,
    loading: true,
    isAuthenticated: false,
    guardarSesion: () => {},
    actualizarUsuario: () => {},
    cerrarSesion: () => {},
});