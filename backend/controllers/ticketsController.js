const Tickets = require("../models/Tickets");
const Users = require("../models/Users");
const TicketStatusHistory = require("../models/Ticket_status_history");
const sequelize = require("../db/connection");

const STATUS_FLOW = {
    ABIERTO: ["VALIDACION_QA"],
    VALIDACION_QA: ["CORRECCION_DEV"],
    CORRECCION_DEV: ["RETEST"],
    RETEST: ["RESUELTO", "CORRECCION_DEV"],
    POSPUESTO: ["VALIDACION_QA", "CORRECCION_DEV", "RETEST"],
    RESUELTO: [],
    CANCELADO: [],
};

const createHistoryComment = (base, extra) => {
    if (!extra || !extra.trim()) {
        return base;
    }

    return `${base}. ${extra.trim()}`;
};

const registrarHistorial = async ({
    transaction,
    ticket_id,
    from_status,
    to_status,
    changed_by_user_id,
    comment,
}) => {
    await TicketStatusHistory.create(
        {
            ticket_id,
            from_status,
            to_status,
            changed_by_user_id,
            changed_at: new Date(),
            comment: comment || null,
        },
        { transaction },
    );
};

const crearTicket = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            qa_user_id,
            dev_user_id,
            created_by_user_id,
        } = req.body;

        if (
            !title ||
            !description ||
            !priority ||
            !qa_user_id ||
            !dev_user_id ||
            !created_by_user_id
        ) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios",
            });
        }

        const [qaUser, devUser, createdByUser] = await Promise.all([
            Users.findByPk(qa_user_id),
            Users.findByPk(dev_user_id),
            Users.findByPk(created_by_user_id),
        ]);

        if (!qaUser) {
            return res.status(400).json({
                mensaje: "qa_user_id no existe",
            });
        }

        if (qaUser.role !== "QA") {
            return res.status(400).json({
                mensaje: "qa_user_id debe pertenecer a un usuario con rol QA",
            });
        }

        if (!devUser) {
            return res.status(400).json({
                mensaje: "dev_user_id no existe",
            });
        }

        if (devUser.role !== "DEV") {
            return res.status(400).json({
                mensaje: "dev_user_id debe pertenecer a un usuario con rol DEV",
            });
        }

        if (!createdByUser) {
            return res.status(400).json({
                mensaje: "created_by_user_id no existe",
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
            created_at: new Date(),
        });

        res.status(201).json({
            mensaje: "Ticket creado correctamente",
            ticket,
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el ticket",
            error: error.message,
        });
    }
};

const obtenerTickets = async (req, res) => {
    try {
        const tickets = await Tickets.findAll();

        res.json({
            mensaje: "Listado de tickets",
            tickets,
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los tickets",
        });
    }
};

const obtenerTicketPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await Tickets.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado",
            });
        }

        res.json({
            mensaje: "Detalle del ticket",
            ticket,
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el ticket",
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
                mensaje: "Ticket no encontrado",
            });
        }

        await ticket.update({
            title,
            description,
            priority,
        });

        res.json({
            mensaje: "Ticket actualizado correctamente",
            ticket,
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el ticket",
        });
    }
};

const cambiarEstadoTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { to_status, comment } = req.body;
        const changedByUserId = req.user.id;

        if (!to_status) {
            return res.status(400).json({
                mensaje: "to_status es obligatorio",
            });
        }

        if (to_status === "ABIERTO") {
            return res.status(400).json({
                mensaje: "No se permite volver a ABIERTO",
            });
        }

        const ticket = await Tickets.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado",
            });
        }

        const currentStatus = ticket.status;

        if (currentStatus === to_status) {
            return res.status(400).json({
                mensaje: "El ticket ya se encuentra en ese estado",
            });
        }

        const allowedNextStatuses = STATUS_FLOW[currentStatus] || [];

        if (!allowedNextStatuses.includes(to_status)) {
            return res.status(400).json({
                mensaje: `Transicion no permitida: ${currentStatus} -> ${to_status}`,
            });
        }

        await sequelize.transaction(async (transaction) => {
            await ticket.update(
                {
                    status: to_status,
                    status_last_changed_at: new Date(),
                },
                { transaction },
            );

            await registrarHistorial({
                transaction,
                ticket_id: ticket.id,
                from_status: currentStatus,
                to_status,
                changed_by_user_id: changedByUserId,
                comment: createHistoryComment("Cambio de estado", comment),
            });
        });

        const ticketActualizado = await Tickets.findByPk(id);

        return res.status(200).json({
            mensaje: "Estado del ticket actualizado correctamente",
            ticket: ticketActualizado,
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al cambiar el estado del ticket",
            error: error.message,
        });
    }
};

const posponerTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, comment } = req.body;
        const changedByUserId = req.user.id;

        if (!reason || !reason.trim()) {
            return res.status(400).json({
                mensaje: "Para posponer un ticket se requiere motivo",
            });
        }

        const ticket = await Tickets.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado",
            });
        }

        if (ticket.status === "RESUELTO" || ticket.status === "CANCELADO") {
            return res.status(400).json({
                mensaje: `No se puede posponer un ticket en estado ${ticket.status}`,
            });
        }

        if (ticket.status === "POSPUESTO") {
            return res.status(400).json({
                mensaje: "El ticket ya se encuentra pospuesto",
            });
        }

        const previousStatus = ticket.status;

        await sequelize.transaction(async (transaction) => {
            await ticket.update(
                {
                    status: "POSPUESTO",
                    postponed_reason: reason.trim(),
                    status_last_changed_at: new Date(),
                },
                { transaction },
            );

            await registrarHistorial({
                transaction,
                ticket_id: ticket.id,
                from_status: previousStatus,
                to_status: "POSPUESTO",
                changed_by_user_id: changedByUserId,
                comment: createHistoryComment(
                    `Ticket pospuesto. Motivo: ${reason.trim()}`,
                    comment,
                ),
            });
        });

        const ticketActualizado = await Tickets.findByPk(id);

        return res.status(200).json({
            mensaje: "Ticket pospuesto correctamente",
            ticket: ticketActualizado,
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al posponer ticket",
            error: error.message,
        });
    }
};

const cancelarTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, comment } = req.body;
        const changedByUserId = req.user.id;

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({
                mensaje: "Solo ADMIN puede cancelar tickets",
            });
        }

        if (!reason || !reason.trim()) {
            return res.status(400).json({
                mensaje: "Para cancelar un ticket se requiere motivo",
            });
        }

        const ticket = await Tickets.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado",
            });
        }

        if (ticket.status === "RESUELTO") {
            return res.status(400).json({
                mensaje: "No se puede cancelar un ticket RESUELTO",
            });
        }

        if (ticket.status === "CANCELADO") {
            return res.status(400).json({
                mensaje: "El ticket ya se encuentra cancelado",
            });
        }

        const previousStatus = ticket.status;

        await sequelize.transaction(async (transaction) => {
            await ticket.update(
                {
                    status: "CANCELADO",
                    canceled_reason: reason.trim(),
                    canceled_at: new Date(),
                    canceled_by_user_id: changedByUserId,
                    status_last_changed_at: new Date(),
                },
                { transaction },
            );

            await registrarHistorial({
                transaction,
                ticket_id: ticket.id,
                from_status: previousStatus,
                to_status: "CANCELADO",
                changed_by_user_id: changedByUserId,
                comment: createHistoryComment(
                    `Ticket cancelado. Motivo: ${reason.trim()}`,
                    comment,
                ),
            });
        });

        const ticketActualizado = await Tickets.findByPk(id);

        return res.status(200).json({
            mensaje: "Ticket cancelado correctamente",
            ticket: ticketActualizado,
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al cancelar ticket",
            error: error.message,
        });
    }
};

const reasignarTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { qa_user_id, dev_user_id, comment } = req.body;
        const changedByUserId = req.user.id;

        if (!qa_user_id && !dev_user_id) {
            return res.status(400).json({
                mensaje: "Debe enviar qa_user_id o dev_user_id para reasignar",
            });
        }

        const ticket = await Tickets.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado",
            });
        }

        const updateData = {};
        const changes = [];

        if (qa_user_id) {
            const qaUser = await Users.findByPk(qa_user_id);

            if (!qaUser) {
                return res.status(400).json({
                    mensaje: "qa_user_id no existe",
                });
            }

            if (qaUser.role !== "QA") {
                return res.status(400).json({
                    mensaje:
                        "qa_user_id debe pertenecer a un usuario con rol QA",
                });
            }

            if (ticket.qa_user_id !== qa_user_id) {
                updateData.qa_user_id = qa_user_id;
                changes.push(`QA: ${ticket.qa_user_id} -> ${qa_user_id}`);
            }
        }

        if (dev_user_id) {
            const devUser = await Users.findByPk(dev_user_id);

            if (!devUser) {
                return res.status(400).json({
                    mensaje: "dev_user_id no existe",
                });
            }

            if (devUser.role !== "DEV") {
                return res.status(400).json({
                    mensaje:
                        "dev_user_id debe pertenecer a un usuario con rol DEV",
                });
            }

            if (ticket.dev_user_id !== dev_user_id) {
                updateData.dev_user_id = dev_user_id;
                changes.push(`DEV: ${ticket.dev_user_id} -> ${dev_user_id}`);
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                mensaje: "No hay cambios para aplicar en la reasignacion",
            });
        }

        await sequelize.transaction(async (transaction) => {
            await ticket.update(updateData, { transaction });

            await registrarHistorial({
                transaction,
                ticket_id: ticket.id,
                from_status: ticket.status,
                to_status: ticket.status,
                changed_by_user_id: changedByUserId,
                comment: createHistoryComment(
                    `Reasignacion aplicada (${changes.join(", ")})`,
                    comment,
                ),
            });
        });

        const ticketActualizado = await Tickets.findByPk(id);

        return res.status(200).json({
            mensaje: "Ticket reasignado correctamente",
            ticket: ticketActualizado,
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al reasignar ticket",
            error: error.message,
        });
    }
};

const obtenerHistorialTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Tickets.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado",
            });
        }

        const history = await TicketStatusHistory.findAll({
            where: { ticket_id: id },
            order: [
                ["changed_at", "ASC"],
                ["id", "ASC"],
            ],
        });

        return res.status(200).json({
            mensaje: "Historial del ticket",
            historial: history,
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al obtener historial del ticket",
            error: error.message,
        });
    }
};

module.exports = {
    crearTicket,
    obtenerTickets,
    obtenerTicketPorId,
    actualizarTicket,
    cambiarEstadoTicket,
    posponerTicket,
    cancelarTicket,
    reasignarTicket,
    obtenerHistorialTicket,
};