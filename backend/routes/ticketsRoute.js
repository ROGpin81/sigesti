const express = require("express");
const router = express.Router();

const ticketsController = require("../controllers/ticketsController");
const collectionsController = require("../controllers/collectionsController");

router.post("/", ticketsController.crearTicket);
router.get("/", ticketsController.obtenerTickets);
router.get("/:id", ticketsController.obtenerTicketPorId);
router.put("/:id", ticketsController.actualizarTicket);

router.post("/:ticketId/collections", collectionsController.crearColeccion);
router.get("/:ticketId/collections", collectionsController.obtenerColeccionesPorTicket);

module.exports = router;