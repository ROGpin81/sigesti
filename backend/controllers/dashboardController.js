const sequelize = require("../db/connection");


// ======================================
// Resumen general de tickets
// ======================================
const ticketsSummary = async (req, res) => {

    try {

        const [resultado] = await sequelize.query(`
            SELECT
                COUNT(*) AS total_tickets,
                SUM(status = 'ABIERTO') AS abiertos,
                SUM(status = 'VALIDACION_QA') AS validacion_qa,
                SUM(status = 'CORRECCION_DEV') AS correccion_dev,
                SUM(status = 'RETEST') AS retest,
                SUM(status = 'RESUELTO') AS resueltos,
                SUM(status = 'POSPUESTO') AS pospuestos,
                SUM(status = 'CANCELADO') AS cancelados
            FROM tickets
        `);

        res.json({
            mensaje: "Resumen general de tickets",
            datos: resultado[0]
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener el resumen de tickets",
            error: error.message
        });

    }

};



// ======================================
// Tickets agrupados por estado
// ======================================
const ticketsByStatus = async (req, res) => {

    try {

        const [resultado] = await sequelize.query(`
            SELECT
                status,
                COUNT(*) AS total
            FROM tickets
            GROUP BY status
        `);

        res.json({
            mensaje: "Tickets agrupados por estado",
            datos: resultado
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener tickets por estado"
        });

    }

};



// ======================================
// Ciclos de corrección y retest
// usa la VIEW v_ticket_cycles
// ======================================
const ticketCycles = async (req, res) => {

    try {

        const [resultado] = await sequelize.query(`
            SELECT *
            FROM v_ticket_cycles
        `);

        res.json({
            mensaje: "Ciclos de corrección y retest",
            datos: resultado
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener ciclos de tickets"
        });

    }

};



// ======================================
// Resumen de usuarios
// ======================================
const usersSummary = async (req, res) => {

    try {

        const [resultado] = await sequelize.query(`
            SELECT
                role,
                COUNT(*) AS total
            FROM users
            GROUP BY role
        `);

        res.json({
            mensaje: "Resumen de usuarios por rol",
            datos: resultado
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener resumen de usuarios"
        });

    }

};


module.exports = {
    ticketsSummary,
    ticketsByStatus,
    ticketCycles,
    usersSummary
};