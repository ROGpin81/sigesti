const Collections = require("../models/Collections");
const CollectionFiles = require("../models/CollectionFiles");
const Tickets = require("../models/Tickets");

const crearColeccion = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                mensaje: "El nombre de la colección es obligatorio",
            });
        }

        const ticket = await Tickets.findByPk(ticketId);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado",
            });
        }

        const coleccion = await Collections.create({
            ticket_id: ticketId,
            name,
            description,
            created_by_user_id: req.user.id,
            created_at: new Date(),
        });

        return res.status(201).json({
            mensaje: "Colección creada correctamente",
            coleccion,
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al crear la colección",
            error: error.message,
        });
    }
};

const obtenerColeccionesPorTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Tickets.findByPk(ticketId);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado",
            });
        }

        const colecciones = await Collections.findAll({
            where: { ticket_id: ticketId },
        });

        return res.status(200).json({
            mensaje: "Listado de colecciones del ticket",
            colecciones,
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al obtener las colecciones",
            error: error.message,
        });
    }
};

const obtenerColeccionPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const coleccion = await Collections.findByPk(id);

        if (!coleccion) {
            return res.status(404).json({
                mensaje: "Colección no encontrada",
            });
        }

        return res.status(200).json({
            mensaje: "Detalle de la colección",
            coleccion,
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al obtener la colección",
            error: error.message,
        });
    }
};

const actualizarColeccion = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const coleccion = await Collections.findByPk(id);

        if (!coleccion) {
            return res.status(404).json({
                mensaje: "Colección no encontrada",
            });
        }

        if (name) {
            coleccion.name = name;
        }

        if (description) {
            coleccion.description = description;
        }

        await coleccion.save();

        return res.status(200).json({
            mensaje: "Colección actualizada correctamente",
            coleccion,
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al actualizar la colección",
            error: error.message,
        });
    }
};

const eliminarColeccion = async (req, res) => {
    try {
        const { id } = req.params;

        const coleccion = await Collections.findByPk(id);

        if (!coleccion) {
            return res.status(404).json({
                mensaje: "Colección no encontrada",
            });
        }

        const archivosAsociados = await CollectionFiles.count({
            where: { collection_id: id },
        });

        if (archivosAsociados > 0) {
            return res.status(400).json({
                mensaje:
                    "No se puede eliminar la colección porque tiene archivos asociados",
            });
        }

        await coleccion.destroy();

        return res.status(200).json({
            mensaje: "Colección eliminada correctamente",
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al eliminar la colección",
            error: error.message,
        });
    }
};

module.exports = {
    crearColeccion,
    obtenerColeccionesPorTicket,
    obtenerColeccionPorId,
    actualizarColeccion,
    eliminarColeccion,
};