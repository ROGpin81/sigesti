import axios from "axios";

export const API_URL = "http://localhost:5050";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("sigesti_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const getErrorApi = (error: unknown) => {
  const err = error as any;

  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.mensaje) return err.response.data.mensaje;

  return "Ocurrio un error.";
};