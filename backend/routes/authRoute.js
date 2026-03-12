const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth");
const { profile, changePassword } = require("../controllers/authController");

router.get("/profile", authMiddleware, profile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;