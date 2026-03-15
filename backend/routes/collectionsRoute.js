const express = require("express");
const router = express.Router();
const collectionsController = require("../controllers/collectionsController");

router.get("/:id", collectionsController.obtenerColeccionPorId);
router.put("/:id", collectionsController.actualizarColeccion);
router.delete("/:id", collectionsController.eliminarColeccion);

module.exports = router;