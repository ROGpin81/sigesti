const fs = require("fs");
const path = require("path");
const Files = require("../models/Files");
const CollectionFiles = require("../models/CollectionFiles");

// Controlador para manejar archivos relacionados a colecciones
const uploadFile = async (req, res) => {
  try {
    const { collectionId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "Debe enviar un archivo",
      });
    }

    const file = req.file;

    const newFile = await Files.create({
      original_filename: file.originalname,
      storage_key: file.filename,
      mime_type: file.mimetype,
      file_ext: path.extname(file.originalname),
      size_bytes: file.size,
      uploaded_by_user_id: req.user.id,
      uploaded_at: new Date(),
    });

    const newCollectionFile = await CollectionFiles.create({
      collection_id: Number(collectionId),
      file_id: newFile.id,
    });

    return res.status(201).json({
      ok: true,
      message: "Archivo subido correctamente",
      data: {
        file: newFile,
        collection_file: newCollectionFile,
      },
    });
  } catch (error) {
    console.error("Error al subir archivo:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al subir archivo",
      error: error.message,
    });
  }
};

// Obtener archivos de una colección
const getFilesByCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;

    const results = await CollectionFiles.findAll({
      where: { collection_id: collectionId },
      include: [
        {
          model: Files,
          attributes: [
            "id",
            "original_filename",
            "storage_key",
            "mime_type",
            "file_ext",
            "size_bytes",
            "uploaded_at",
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.json({
      ok: true,
      data: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener archivos",
    });
  }
};

// Actualizar clasificación de un archivo
const updateFileClassification = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      qa_description,
      qa_classification,
      dev_description,
      dev_classification,
    } = req.body;

    const user = req.user;

    const record = await CollectionFiles.findByPk(id);

    if (!record) {
      return res.status(404).json({
        ok: false,
        message: "Registro no encontrado",
      });
    }

    if (user.role === "QA") {
      if (qa_description !== undefined) record.qa_description = qa_description;
      if (qa_classification !== undefined) record.qa_classification = qa_classification;
    }

    if (user.role === "DEV") {
      if (dev_description !== undefined) record.dev_description = dev_description;
      if (dev_classification !== undefined) record.dev_classification = dev_classification;
    }

    if (user.role === "ADMIN") {
      if (qa_description !== undefined) record.qa_description = qa_description;
      if (qa_classification !== undefined) record.qa_classification = qa_classification;
      if (dev_description !== undefined) record.dev_description = dev_description;
      if (dev_classification !== undefined) record.dev_classification = dev_classification;
    }

    record.updated_at = new Date();
    record.updated_by_user_id = user.id;

    await record.save();

    return res.json({
      ok: true,
      message: "Clasificación actualizada",
      data: record,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al actualizar clasificación",
    });
  }
};

// Obtener detalles de un archivo
const getFileById = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await Files.findByPk(id);

    if (!file) {
      return res.status(404).json({
        ok: false,
        message: "Archivo no encontrado",
      });
    }

    const publicUrl = `${req.protocol}://${req.get("host")}/uploads/collections/${file.storage_key}`;

    return res.json({
      ok: true,
      data: {
        id: file.id,
        original_filename: file.original_filename,
        storage_key: file.storage_key,
        mime_type: file.mime_type,
        file_ext: file.file_ext,
        size_bytes: file.size_bytes,
        uploaded_by_user_id: file.uploaded_by_user_id,
        uploaded_at: file.uploaded_at,
        url: publicUrl,
      },
    });
  } catch (error) {
    console.error("Error al obtener archivo:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener archivo",
    });
  }
};

// Descargar un archivo
const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await Files.findByPk(id);

    if (!file) {
      return res.status(404).json({
        ok: false,
        message: "Archivo no encontrado",
      });
    }

    const filePath = path.join(__dirname, "../src/uploads/collections", file.storage_key);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        ok: false,
        message: "El archivo físico no existe en el servidor",
      });
    }

    return res.download(filePath, file.original_filename);
  } catch (error) {
    console.error("Error al descargar archivo:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al descargar archivo",
    });
  }
};

module.exports = {
  uploadFile,
  getFilesByCollection,
  updateFileClassification,
  getFileById,
  downloadFile,
};