import { api } from "@/services/api";

export const getTicketsSummary = async () => {
  const response = await api.get("/dashboard/tickets-summary");
  return response.data;
};

export const getTicketsByStatus = async () => {
  const response = await api.get("/dashboard/tickets-by-status");
  return response.data;
};

export const getTicketCycles = async () => {
  const response = await api.get("/dashboard/ticket-cycles");
  return response.data;
};

export const getUsersSummary = async () => {
  const response = await api.get("/dashboard/users-summary");
  return response.data;
};