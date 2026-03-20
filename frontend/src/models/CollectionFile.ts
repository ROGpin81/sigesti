export interface FileItem {
  id: number;
  original_filename: string;
  storage_key: string;
  mime_type?: string;
  file_ext?: string;
  size_bytes?: number;
  uploaded_at?: string;
  uploaded_by_user_id?: number;
}

export interface CollectionFileItem {
  id: number;
  collection_id: number;
  file_id: number;
  qa_description?: string | null;
  qa_classification?: "INCIDENCIA" | "MEJORA" | null;
  dev_description?: string | null;
  dev_classification?: "SOLUCION_APLICADA" | "NO_APLICA" | null;
  updated_at?: string | null;
  updated_by_user_id?: number | null;
  file?: FileItem;
}