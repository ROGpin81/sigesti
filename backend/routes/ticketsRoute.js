const express = require("express");
const router = express.Router();

const ticketsController = require("../controllers/ticketsController");

router.post("/tickets", ticketsController.crearTicket);

router.get("/tickets", ticketsController.obtenerTickets);

router.get("/tickets/:id", ticketsController.obtenerTicketPorId);

router.put("/tickets/:id", ticketsController.actualizarTicket);

module.exports = router;