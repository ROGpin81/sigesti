import { api } from "@/services/api";
import { TicketCreate } from "@/models/TicketCreate";
import { TicketUpdate } from "@/models/TicketUpdate";

export interface TicketStatusUpdate {
  to_status: string;
  comment?: string;
}

export interface TicketPostponeRequest {
  reason: string;
  comment?: string;
}

export interface TicketCancelRequest {
  reason: string;
  comment?: string;
}

export interface TicketReassignRequest {
  qa_user_id?: number;
  dev_user_id?: number;
  comment?: string;
}

export interface CollectionCreateRequest {
  name: string;
  description?: string;
}

export interface CollectionUpdateRequest {
  name?: string;
  description?: string;
}

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

export const updateTicketStatusApi = async (
  id: string | number,
  body: TicketStatusUpdate
) => {
  const response = await api.put(`/tickets/${id}/status`, body);
  return response.data;
};

export const postponeTicketApi = async (
  id: string | number,
  body: TicketPostponeRequest
) => {
  const response = await api.put(`/tickets/${id}/postpone`, body);
  return response.data;
};

export const cancelTicketApi = async (
  id: string | number,
  body: TicketCancelRequest
) => {
  const response = await api.put(`/tickets/${id}/cancel`, body);
  return response.data;
};

export const reassignTicketApi = async (
  id: string | number,
  body: TicketReassignRequest
) => {
  const response = await api.put(`/tickets/${id}/reassign`, body);
  return response.data;
};

export const getTicketHistoryApi = async (id: string | number) => {
  const response = await api.get(`/tickets/${id}/history`);
  return response.data;
};

export const createCollectionByTicketApi = async (
  ticketId: string | number,
  body: CollectionCreateRequest
) => {
  const response = await api.post(`/tickets/${ticketId}/collections`, body);
  return response.data;
};

export const getCollectionsByTicketApi = async (ticketId: string | number) => {
  const response = await api.get(`/tickets/${ticketId}/collections`);
  return response.data;
};

export const getCollectionByIdApi = async (id: string | number) => {
  const response = await api.get(`/collections/${id}`);
  return response.data;
};

export const updateCollectionApi = async (
  id: string | number,
  body: CollectionUpdateRequest
) => {
  const response = await api.put(`/collections/${id}`, body);
  return response.data;
};

export const deleteCollectionApi = async (id: string | number) => {
  const response = await api.delete(`/collections/${id}`);
  return response.data;
};