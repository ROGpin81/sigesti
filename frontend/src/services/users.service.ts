import { api } from "@/services/api";
import { UserCreate } from "@/models/UserCreate";
import { UserUpdate } from "@/models/UserUpdate";
import { UserStatusUpdate } from "@/models/UserStatusUpdate";
import { UserPasswordReset } from "@/models/UserPasswordReset";
import { UserRoleUpdate } from "@/models/UserRoleUpdate";

export const getUsersApi = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserByIdApi = async (id: string | number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUserApi = async (body: UserCreate) => {
  const response = await api.post("/users", body);
  return response.data;
};

export const updateUserApi = async (
  id: string | number,
  body: UserUpdate
) => {
  const response = await api.put(`/users/${id}`, body);
  return response.data;
};

export const updateUserStatusApi = async (
  id: string | number,
  body: UserStatusUpdate
) => {
  const response = await api.put(`/users/${id}/status`, body);
  return response.data;
};

export const resetUserPasswordApi = async (
  id: string | number,
  body: UserPasswordReset
) => {
  const response = await api.put(`/users/${id}/reset-password`, body);
  return response.data;
};

export const updateUserRoleApi = async (
  id: string | number,
  body: UserRoleUpdate
) => {
  const response = await api.put(`/users/${id}/role`, body);
  return response.data;
};