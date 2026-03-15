export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "ADMIN" | "QA" | "DEV";
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}