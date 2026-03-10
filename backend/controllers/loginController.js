const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuarios = require("../models/Users");
require("dotenv").config();

const login = async (req, res) => {
    try {
        const email = req.body.email || req.body.Correo;
        const password = req.body.password || req.body.Password;

        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                message: "El correo y la contraseña son requeridos.",
            });
        }

        const user = await Usuarios.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                status: 401,
                message: "Credenciales inválidas.",
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                status: 403,
                message: "Usuario inactivo.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                status: 401,
                message: "Credenciales inválidas.",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" },
        );

        return res.status(200).json({
            status: 200,
            message: "Login exitoso.",
            token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error en login.",
            error: error.message,
        });
    }
};

module.exports = { login };