"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContextAuth } from "@/providers/ProviderAuth";
import { getErrorApi } from "@/services/api";
import { getCollectionByIdApi } from "@/services/tickets.service";
import {
  getFilesByCollectionApi,
  getFileDownloadUrl,
  getFilePublicUrl,
  isImageFile,
  updateCollectionFileApi,
  uploadFileToCollectionApi,
} from "@/services/files.service";
import { CollectionFileItem } from "@/models/CollectionFile";

interface CollectionItem {
  id: number;
  ticket_id: number;
  name: string;
  description?: string;
  created_by_user_id: number;
  created_at?: string;
}

export default function ArchivosColeccionPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useContextAuth();

  const [coleccion, setColeccion] = useState<CollectionItem | null>(null);
  const [archivos, setArchivos] = useState<CollectionFileItem[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  const [qaDescription, setQaDescription] = useState<Record<number, string>>({});
  const [qaClassification, setQaClassification] = useState<Record<number, string>>({});
  const [devDescription, setDevDescription] = useState<Record<number, string>>({});
  const [devClassification, setDevClassification] = useState<Record<number, string>>({});

  useEffect(() => {
    if (id) {
      cargarTodo();
    }
  }, [id]);

  async function cargarTodo() {
    try {
      setLoading(true);
      setMensaje("");

      const [collectionResponse, filesResponse] = await Promise.all([
        getCollectionByIdApi(id),
        getFilesByCollectionApi(id),
      ]);

      const collectionData = collectionResponse.coleccion || null;
      setColeccion(collectionData);
      setArchivos(filesResponse || []);

      const qaDescInit: Record<number, string> = {};
      const qaClassInit: Record<number, string> = {};
      const devDescInit: Record<number, string> = {};
      const devClassInit: Record<number, string> = {};

      (filesResponse || []).forEach((item) => {
        qaDescInit[item.id] = item.qa_description || "";
        qaClassInit[item.id] = item.qa_classification || "";
        devDescInit[item.id] = item.dev_description || "";
        devClassInit[item.id] = item.dev_classification || "";
      });

      setQaDescription(qaDescInit);
      setQaClassification(qaClassInit);
      setDevDescription(devDescInit);
      setDevClassification(devClassInit);
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setLoading(false);
    }
  }

  async function subirArchivo() {
    if (!archivoSeleccionado) {
      setMensaje("Debes seleccionar un archivo.");
      return;
    }

    try {
      setSubiendo(true);
      setMensaje("");

      const response = await uploadFileToCollectionApi(id, archivoSeleccionado);
      setMensaje(response.message || response.mensaje || "Archivo subido correctamente.");
      setArchivoSeleccionado(null);

      const input = document.getElementById("archivoInput") as HTMLInputElement | null;
      if (input) input.value = "";

      await cargarTodo();
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setSubiendo(false);
    }
  }

  async function guardarClasificacion(item: CollectionFileItem) {
    try {
      setSavingId(item.id);
      setMensaje("");

      const body: {
        qa_description?: string;
        qa_classification?: "INCIDENCIA" | "MEJORA";
        dev_description?: string;
        dev_classification?: "SOLUCION_APLICADA" | "NO_APLICA";
      } = {};

      if (user?.role === "QA" || user?.role === "ADMIN") {
        body.qa_description = qaDescription[item.id] || "";
        if (qaClassification[item.id]) {
          body.qa_classification = qaClassification[item.id] as "INCIDENCIA" | "MEJORA";
        }
      }

      if (user?.role === "DEV" || user?.role === "ADMIN") {
        body.dev_description = devDescription[item.id] || "";
        if (devClassification[item.id]) {
          body.dev_classification = devClassification[item.id] as "SOLUCION_APLICADA" | "NO_APLICA";
        }
      }

      const response = await updateCollectionFileApi(item.id, body);
      setMensaje(response.message || response.mensaje || "Clasificación actualizada.");
      await cargarTodo();
    } catch (error: unknown) {
      setMensaje(getErrorApi(error));
    } finally {
      setSavingId(null);
    }
  }

  function formatBytes(bytes?: number) {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Archivos de la Colección</h1>
          <p className="mt-2 text-slate-600">
            Gestiona evidencias, vista previa, descarga y clasificación QA / DEV.
          </p>
          {coleccion && (
            <p className="mt-1 text-sm text-slate-500">
              Colección #{coleccion.id} - {coleccion.name}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {coleccion && (
            <Link
              href={`/colecciones/${coleccion.id}`}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
            >
              Volver a colección
            </Link>
          )}

          {coleccion && (
            <Link
              href={`/tickets/${coleccion.ticket_id}/colecciones`}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Volver al ticket
            </Link>
          )}
        </div>
      </div>

      {mensaje && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            mensaje.toLowerCase().includes("correct") ||
            mensaje.toLowerCase().includes("actualizada") ||
            mensaje.toLowerCase().includes("subido")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {mensaje}
        </p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Subir nuevo archivo</h2>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            id="archivoInput"
            type="file"
            onChange={(e) => setArchivoSeleccionado(e.target.files?.[0] || null)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
          />

          <button
            type="button"
            onClick={subirArchivo}
            disabled={subiendo}
            className="rounded-lg bg-indigo-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-60"
          >
            {subiendo ? "Subiendo..." : "Subir archivo"}
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Formatos permitidos: PDF, JPG, JPEG, PNG, DOC, DOCX, XLS, XLSX.
        </p>
      </section>

      <section className="space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">Cargando archivos...</p>
          </div>
        ) : archivos.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">
              Esta colección aún no tiene archivos asociados.
            </p>
          </div>
        ) : (
          archivos.map((item) => {
            const file = item.file;
            const publicUrl = getFilePublicUrl(file?.storage_key);
            const downloadUrl = getFileDownloadUrl(item.file_id);

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      {isImageFile(file?.mime_type, file?.file_ext) ? (
                        <img
                          src={publicUrl}
                          alt={file?.original_filename || "Archivo"}
                          className="h-64 w-full rounded-lg object-contain"
                        />
                      ) : (
                        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-center text-sm text-slate-500">
                          Vista previa no disponible para este tipo de archivo.
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Ver
                      </a>

                      <a
                        /*href={downloadUrl}*/
                        href={publicUrl}
                        download={file?.original_filename || true}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Descargar
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-slate-500">Archivo original</p>
                        <p className="font-medium break-all">{file?.original_filename || "-"}</p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">Tamaño</p>
                        <p className="font-medium">{formatBytes(file?.size_bytes)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">Tipo MIME</p>
                        <p className="font-medium break-all">{file?.mime_type || "-"}</p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">Fecha de carga</p>
                        <p className="font-medium">
                          {file?.uploaded_at
                            ? new Date(file.uploaded_at).toLocaleString()
                            : "-"}
                        </p>
                      </div>
                    </div>

                    {(user?.role === "QA" || user?.role === "ADMIN") && (
                      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <h3 className="font-semibold text-amber-800">Clasificación QA</h3>

                        <div className="mt-3 space-y-3">
                          <select
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            value={qaClassification[item.id] || ""}
                            onChange={(e) =>
                              setQaClassification((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                          >
                            <option value="">Seleccione clasificación QA</option>
                            <option value="INCIDENCIA">INCIDENCIA</option>
                            <option value="MEJORA">MEJORA</option>
                          </select>

                          <textarea
                            className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            placeholder="Descripción QA"
                            value={qaDescription[item.id] || ""}
                            onChange={(e) =>
                              setQaDescription((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </section>
                    )}

                    {(user?.role === "DEV" || user?.role === "ADMIN") && (
                      <section className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                        <h3 className="font-semibold text-blue-800">Clasificación DEV</h3>

                        <div className="mt-3 space-y-3">
                          <select
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            value={devClassification[item.id] || ""}
                            onChange={(e) =>
                              setDevClassification((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                          >
                            <option value="">Seleccione clasificación DEV</option>
                            <option value="SOLUCION_APLICADA">SOLUCION_APLICADA</option>
                            <option value="NO_APLICA">NO_APLICA</option>
                          </select>

                          <textarea
                            className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            placeholder="Descripción DEV"
                            value={devDescription[item.id] || ""}
                            onChange={(e) =>
                              setDevDescription((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </section>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-slate-500">QA actual</p>
                        <p className="font-medium">
                          {item.qa_classification || "-"}{" "}
                          {item.qa_description ? `| ${item.qa_description}` : ""}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">DEV actual</p>
                        <p className="font-medium">
                          {item.dev_classification || "-"}{" "}
                          {item.dev_description ? `| ${item.dev_description}` : ""}
                        </p>
                      </div>
                    </div>

                    {(user?.role === "QA" ||
                      user?.role === "DEV" ||
                      user?.role === "ADMIN") && (
                      <button
                        type="button"
                        onClick={() => guardarClasificacion(item)}
                        disabled={savingId === item.id}
                        className="rounded-lg bg-indigo-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-60"
                      >
                        {savingId === item.id
                          ? "Guardando..."
                          : "Guardar clasificación"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}