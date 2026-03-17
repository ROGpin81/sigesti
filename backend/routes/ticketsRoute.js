const express = require("express");
const router = express.Router();

const ticketsController = require("../controllers/ticketsController");
const collectionsController = require("../controllers/collectionsController");

router.post("/", ticketsController.crearTicket);
router.get("/", ticketsController.obtenerTickets);
router.get("/:id", ticketsController.obtenerTicketPorId);
router.put("/:id", ticketsController.actualizarTicket);
router.put("/:id/status", ticketsController.cambiarEstadoTicket);
router.put("/:id/postpone", ticketsController.posponerTicket);
router.put("/:id/cancel", ticketsController.cancelarTicket);
router.put("/:id/reassign", ticketsController.reasignarTicket);
router.get("/:id/history", ticketsController.obtenerHistorialTicket);

router.post("/:ticketId/collections", collectionsController.crearColeccion);
router.get("/:ticketId/collections", collectionsController.obtenerColeccionesPorTicket);

module.exports = router;