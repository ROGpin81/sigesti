import { api } from "@/services/api";
import { TicketCreate } from "@/models/TicketCreate";
import { TicketUpdate } from "@/models/TicketUpdate";

export const getTicketsApi = async () => {
  const response = await api.get("/tickets");
  return response.data;
};

export const getTicketByIdApi = async (id: string | number) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
};

export const createTicketApi = async (body: TicketCreate) => {
  const response = await api.post("/tickets", body);
  return response.data;
};

export const updateTicketApi = async (
  id: string | number,
  body: TicketUpdate
) => {
  const response = await api.put(`/tickets/${id}`, body);
  return response.data;
};