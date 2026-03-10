const sequelize = require('../db/conexion');
const { DataTypes } = require('sequelize');

const Ticket_status_history = sequelize.define('ticket_status_history', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    from_status: {
        type: DataTypes.ENUM(
            'ABIERTO',
            'VALIDACION_QA',
            'CORRECCION_DEV',
            'RETEST',
            'RESUELTO',
            'POSPUESTO',
            'CANCELADO'
        ),
        allowNull: false
    },

    to_status: {
        type: DataTypes.ENUM(
            'ABIERTO',
            'VALIDACION_QA',
            'CORRECCION_DEV',
            'RETEST',
            'RESUELTO',
            'POSPUESTO',
            'CANCELADO'
        ),
        allowNull: false
    },

    changed_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    changed_at: {
        type: DataTypes.DATE,
    },

    comment: {
        type: DataTypes.TEXT,
    }

},{
    tableName: 'ticket_status_history',
    timestamps: false,
});

module.exports = Ticket_status_history;