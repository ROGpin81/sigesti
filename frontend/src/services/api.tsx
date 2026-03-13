import axios from "axios";
import { RegistroUsuario } from "@/models/RegistroUsuario";
import { LoginUsuario } from "@/models/LoginUsuario";

const API_URL = "http://localhost:5050";

export const registroApi = async (body: RegistroUsuario) => {
    const response = await axios.post(`${API_URL}/registro`, body);
    return response.data;
};

export const loginApi = async (body: LoginUsuario) => {
    const response = await axios.post(`${API_URL}/login`, body);
    return response.data;
};

export const getErrorApi = (error: any) => {
    if (error?.response?.data?.message) return error.response.data.message;
    return "Ocurrio un error.";
};