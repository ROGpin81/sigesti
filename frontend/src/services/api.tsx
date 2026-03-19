import axios from "axios";

const API_URL = "http://localhost:5050";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorApi = (error: any) => {
    if (error?.response?.data?.message) return error.response.data.message;
    return "Ocurrio un error.";
};