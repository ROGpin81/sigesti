const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

router.get("/tickets-summary", dashboardController.ticketsSummary);

router.get("/tickets-by-status", dashboardController.ticketsByStatus);

router.get("/ticket-cycles", dashboardController.ticketCycles);

router.get("/users-summary", dashboardController.usersSummary);

module.exports = router;