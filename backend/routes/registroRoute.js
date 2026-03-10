const express = require("express");
const { registro } = require("../controllers/registroController");

const router = express.Router();

router.post("/", registro);

module.exports = router;