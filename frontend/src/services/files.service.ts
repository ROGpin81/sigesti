import { api, API_URL } from "@/services/api";
import { CollectionFileItem } from "@/models/CollectionFile";

export interface FileClassificationUpdate {
  qa_description?: string;
  qa_classification?: "INCIDENCIA" | "MEJORA";
  dev_description?: string;
  dev_classification?: "SOLUCION_APLICADA" | "NO_APLICA";
}

export const getFilesByCollectionApi = async (
  collectionId: string | number
): Promise<CollectionFileItem[]> => {
  const response = await api.get(`/api/collections/${collectionId}/files`);
  return response.data?.data || [];
};

export const uploadFileToCollectionApi = async (
  collectionId: string | number,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/api/collections/${collectionId}/files`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updateCollectionFileApi = async (
  id: string | number,
  body: FileClassificationUpdate
) => {
  const response = await api.patch(`/api/collection-files/${id}`, body);
  return response.data;
};

export const getFileByIdApi = async (id: string | number) => {
  const response = await api.get(`/api/files/${id}`);
  return response.data;
};

export const getFileDownloadUrl = (fileId: string | number) => {
  return `${API_URL}/api/files/${fileId}/download`;
};

export const getFilePublicUrl = (storageKey?: string) => {
  if (!storageKey) return "";
  return `${API_URL}/uploads/collections/${storageKey}`;
};

export const isImageFile = (mimeType?: string, fileExt?: string) => {
  if (mimeType?.startsWith("image/")) return true;

  const ext = (fileExt || "").toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
};