const express = require("express");
const bcrypt = require("bcrypt");
const Usuarios = require("../models/Users");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, first_name, last_name, password, role, is_active } = req.body;

    if (!email || !first_name || !last_name || !password || !role) {
      return res.status(400).json({
        status: 400,
        message: "email, first_name, last_name, password y role son requeridos.",
      });
    }

    /*
    "email": "x",
    "first_name": "x",
    "last_name": "x",
    "password": "x",
    "role": "x"
    */

    // 
    const validRoles = ["ADMIN", "QA", "DEV"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        status: 400,
        message: "role inválido. Valores permitidos: ADMIN, QA, DEV.",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await Usuarios.create({
      email,
      first_name,
      last_name,
      password_hash,
      role,
      is_active: typeof is_active === "boolean" ? is_active : true,
    });

    return res.status(201).json({
      status: 201,
      message: "Usuario creado exitosamente.",
      data: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role,
        is_active: newUser.is_active,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: 409,
        message: "El email ya está registrado.",
      });
    }

    return res.status(500).json({
      status: 500,
      message: "Error al crear usuario.",
      error: error.message,
    });
  }
});

module.exports = router;