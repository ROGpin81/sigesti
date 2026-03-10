const sequelize = require('../db/connection');
const { DataTypes } = require('sequelize');

const Tickets = sequelize.define('tickets', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    priority: {
        type: DataTypes.ENUM('ALTA', 'MEDIA', 'BAJA'),
        allowNull: false
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
        allowNull: false
    },

    created_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    qa_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    dev_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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

module.exports = Tickets;