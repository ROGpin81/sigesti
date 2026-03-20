export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: "ALTA" | "MEDIA" | "BAJA";
  status: string;
  created_by_user_id: number;
  qa_user_id: number;
  dev_user_id: number;
  qa_user_name?: string | null;
  dev_user_name?: string | null;
  created_at?: string;
}
