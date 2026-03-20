const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const { uploadFile, getFilesByCollection, updateFileClassification, getFileById,
  downloadFile, } = require("../controllers/files.controller");

// Subir archivo a una colección
router.post(
  "/collections/:collectionId/files",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

// Obtener archivos de una colección
router.get(
  "/collections/:collectionId/files",
  authMiddleware,
  getFilesByCollection
);

// Actualizar clasificación de un archivo
router.patch(
  "/collection-files/:id",
  authMiddleware,
  updateFileClassification
);

// Obtener detalles de un archivo
router.get(
  "/files/:id",
  authMiddleware,
  getFileById
);

// Descargar un archivo
router.get(
  "/files/:id/download",
  authMiddleware,
  downloadFile
);

module.exports = router;