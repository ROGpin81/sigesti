export interface TicketCreate {
  title: string;
  description: string;
  priority: "ALTA" | "MEDIA" | "BAJA";
  qa_user_id: number;
  dev_user_id: number;
  created_by_user_id: number;
}