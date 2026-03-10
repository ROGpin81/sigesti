const sequelize = require('../db/connection');
const { DataTypes } = require('sequelize');

const Collections = sequelize.define('collections', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT
    },

    created_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    created_at: {
        type: DataTypes.DATE
    }

},{
    tableName: 'collections',
    timestamps: false,
});

module.exports = Collections;