import { api } from "@/services/api";
import { RegistroUsuario } from "@/models/RegistroUsuario";
import { LoginUsuario } from "@/models/LoginUsuario";
import { ChangePasswordRequest } from "@/models/ChangePassword";
import { ProfileResponse } from "@/models/Profile";

export const registroApi = async (body: RegistroUsuario) => {
  const response = await api.post("/registro", body);
  return response.data;
};

export const loginApi = async (body: LoginUsuario) => {
  const response = await api.post("/login", body);
  return response.data;
};

export const getProfileApi = async (): Promise<ProfileResponse> => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const changePasswordApi = async (body: ChangePasswordRequest) => {
  const response = await api.put("/auth/change-password", body);
  return response.data;
};
