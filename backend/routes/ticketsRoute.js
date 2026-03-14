const express = require("express");
const router = express.Router();

const ticketsController = require("../controllers/ticketsController");

router.post("/", ticketsController.crearTicket);
router.get("/", ticketsController.obtenerTickets);
router.get("/:id", ticketsController.obtenerTicketPorId);
router.put("/:id", ticketsController.actualizarTicket);

module.exports = router;