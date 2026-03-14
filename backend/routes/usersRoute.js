const express = require("express");

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    actualizarEstadoUsuario,
    resetearPasswordUsuario,
    actualizarRolUsuario,
} = require("../controllers/usersController");

const router = express.Router();

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({
            status: 403,
            message: "No tiene los permisos necesarios.",
        });
    }

    next();
};

router.use(adminOnly);

router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuarioPorId);
router.post("/", crearUsuario);
router.put("/:id", actualizarUsuario);
router.put("/:id/status", actualizarEstadoUsuario);
router.put("/:id/reset-password", resetearPasswordUsuario);
router.put("/:id/role", actualizarRolUsuario);

module.exports = router;