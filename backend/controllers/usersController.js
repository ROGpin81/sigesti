const bcrypt = require("bcrypt");
const Users = require("../models/Users");

const obtenerUsuarios = async (req, res) => {
    try {
        const users = await Users.findAll({
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

        return res.status(200).json({
            status: 200,
            message: "Usuarios obtenidos exitosamente.",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error en el servidor.",
            error,
        });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: "El id es requerido.",
            });
        }

        const user = await Users.findByPk(id, {
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
            message: "Usuario obtenido exitosamente.",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error en el servidor.",
            error,
        });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const { email, first_name, last_name, password, role, is_active } =
            req.body;

        if (!email || !first_name || !last_name || !password || !role) {
            return res.status(400).json({
                status: 400,
                message: "Todos los campos son obligatorios.",
            });
        }

        const validRoles = ["ADMIN", "QA", "DEV"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                status: 400,
                message: "Rol inválido.",
            });
        }

        const existe = await Users.findOne({ where: { email } });
        if (existe) {
            return res.status(409).json({
                status: 409,
                message: "El email ya está registrado.",
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Users.create({
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
                id: nuevoUsuario.id,
                email: nuevoUsuario.email,
                first_name: nuevoUsuario.first_name,
                last_name: nuevoUsuario.last_name,
                role: nuevoUsuario.role,
                is_active: nuevoUsuario.is_active,
                created_at: nuevoUsuario.created_at,
                updated_at: nuevoUsuario.updated_at,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error en el servidor.",
            error,
        });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { email, first_name, last_name } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: "El id es requerido.",
            });
        }

        if (!email || !first_name || !last_name) {
            return res.status(400).json({
                status: 400,
                message: "Todos los campos son requeridos.",
            });
        }

        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado.",
            });
        }

        const existeEmail = await Users.findOne({ where: { email } });
        if (existeEmail && existeEmail.id !== id) {
            return res.status(409).json({
                status: 409,
                message: "El email ya está registrado.",
            });
        }

        user.email = email;
        user.first_name = first_name;
        user.last_name = last_name;
        await user.save();

        return res.status(200).json({
            status: 200,
            message: "Usuario actualizado exitosamente.",
            data: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                is_active: user.is_active,
                updated_at: user.updated_at,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error en el servidor.",
            error,
        });
    }
};

const actualizarEstadoUsuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { is_active } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: "El id es requerido.",
            });
        }

        if (typeof is_active !== "boolean") {
            return res.status(400).json({
                status: 400,
                message: "is_active debe ser boolean.",
            });
        }

        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado.",
            });
        }

        user.is_active = is_active;
        await user.save();

        return res.status(200).json({
            status: 200,
            message: "Estado de usuario actualizado exitosamente.",
            data: {
                id: user.id,
                is_active: user.is_active,
                updated_at: user.updated_at,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error en el servidor.",
            error,
        });
    }
};

const resetearPasswordUsuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { password } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: "El id es requerido.",
            });
        }

        if (!password) {
            return res.status(400).json({
                status: 400,
                message: "La contraseña es obligatoria.",
            });
        }

        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado.",
            });
        }

        const password_hash = await bcrypt.hash(password, 10);
        user.password_hash = password_hash;
        await user.save();

        return res.status(200).json({
            status: 200,
            message: "Contraseña reseteada exitosamente.",
            data: {
                id: user.id,
                updated_at: user.updated_at,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error en el servidor.",
            error,
        });
    }
};

const actualizarRolUsuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { role } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: "El id es requerido.",
            });
        }

        if (!role) {
            return res.status(400).json({
                status: 400,
                message: "El rol es obligatorio.",
            });
        }

        const validRoles = ["ADMIN", "QA", "DEV"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                status: 400,
                message: "Rol inválido.",
            });
        }

        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado.",
            });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({
            status: 200,
            message: "Rol actualizado exitosamente.",
            data: {
                id: user.id,
                role: user.role,
                updated_at: user.updated_at,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error inesperado.",
            error,
        });
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    actualizarEstadoUsuario,
    resetearPasswordUsuario,
    actualizarRolUsuario,
};