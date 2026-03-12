const bcrypt = require("bcrypt");
const Users = require("../models/Users");

const profile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await Users.findByPk(userId, {
            attributes: [
                "id",
                "email",
                "first_name",
                "last_name",
                "role",
                "is_active",
                "created_at",
                "updated_at",
            ],
        });

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado.",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Perfil obtenido correctamente.",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error al obtener perfil.",
            error: error.message,
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json({
                status: 400,
                message: "La contraseña actual y la nueva contraseña son obligatorias.",
            });
        }

        if (current_password === new_password) {
            return res.status(400).json({
                status: 400,
                message: "La nueva contraseña no puede ser igual a la contraseña actual.",
            });
        }

        const user = await Users.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado.",
            });
        }

        const isMatch = await bcrypt.compare(current_password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                status: 401,
                message: "La contraseña actual es incorrecta.",
            });
        }

        const newPasswordHash = await bcrypt.hash(new_password, 10);

        await user.update({
            password_hash: newPasswordHash,
        });

        return res.status(200).json({
            status: 200,
            message: "Contraseña actualizada correctamente.",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error al cambiar contraseña.",
            error: error.message,
        });
    }
};

module.exports = {
    profile,
    changePassword,
};