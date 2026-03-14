const Tickets = require("../models/Tickets");

const crearTicket = async (req, res) => {

    try {

        const {
            title,
            description,
            priority,
            qa_user_id,
            dev_user_id,
            created_by_user_id
        } = req.body;

        if (!title || !description || !priority || !qa_user_id || !dev_user_id || !created_by_user_id) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });
        }

        const ticket = await Tickets.create({
            title,
            description,
            priority,
            status: "ABIERTO",
            qa_user_id,
            dev_user_id,
            created_by_user_id,
            created_at: new Date()
        });

        res.status(201).json({
            mensaje: "Ticket creado correctamente",
            ticket
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al crear el ticket",
            error: error.message
        });

    }

};

const obtenerTickets = async (req, res) => {

    try {

        const tickets = await Tickets.findAll();

        res.json({
            mensaje: "Listado de tickets",
            tickets
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener los tickets"
        });

    }

};

const obtenerTicketPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const ticket = await Tickets.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado"
            });
        }

        res.json({
            mensaje: "Detalle del ticket",
            ticket
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener el ticket"
        });

    }

};

const actualizarTicket = async (req, res) => {

    try {

        const { id } = req.params;

        const { title, description, priority } = req.body;

        const ticket = await Tickets.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado"
            });
        }

        await ticket.update({
            title,
            description,
            priority
        });

        res.json({
            mensaje: "Ticket actualizado correctamente",
            ticket
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al actualizar el ticket"
        });

    }

};


module.exports = {
    crearTicket,
    obtenerTickets,
    obtenerTicketPorId,
    actualizarTicket
};