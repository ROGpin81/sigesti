import { AuthUsuario } from "./AuthUsuario";

export interface ProfileResponse {
  status: number;
  message: string;
  data: AuthUsuario;
}