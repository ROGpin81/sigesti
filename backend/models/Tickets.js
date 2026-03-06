const sequelize = require('../db/connection');
const { DataTypes } = require('sequelize');

const Ticket = sequelize.define('tickets', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING,
    },

    description: {
        type: DataTypes.TEXT,
    },

    priority: {
        type: DataTypes.ENUM('ALTA', 'MEDIA', 'BAJA'),
    },

    status: {
        type: DataTypes.ENUM(
            'ABIERTO',
            'VALIDACION_QA',
            'CORRECCION_DEV',
            'RETEST',
            'RESUELTO',
            'POSPUESTO',
            'CANCELADO'
        ),
    },

    created_by_user_id: {
        type: DataTypes.INTEGER,
    },

    qa_user_id: {
        type: DataTypes.INTEGER,
    },

    dev_user_id: {
        type: DataTypes.INTEGER,
    },

    created_at: {
        type: DataTypes.DATE,
    },

    status_last_changed_at: {
        type: DataTypes.DATE,
    },

    postponed_reason: {
        type: DataTypes.TEXT,
    },

    canceled_reason: {
        type: DataTypes.TEXT,
    },

    canceled_at: {
        type: DataTypes.DATE,
    },

    canceled_by_user_id: {
        type: DataTypes.INTEGER,
    },

},{
    tableName: 'tickets',
    timestamps: false,
});

module.exports = Ticket;