const sequelize = require('../db/connection');
const { DataTypes } = require('sequelize');

const Files = sequelize.define('files', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    original_filename: {
        type: DataTypes.STRING,
        allowNull: false
    },

    storage_key: {
        type: DataTypes.STRING,
        allowNull: false
    },

    mime_type: {
        type: DataTypes.STRING,
    },

    file_ext: {
        type: DataTypes.STRING,
    },

    size_bytes: {
        type: DataTypes.BIGINT,
    },

    uploaded_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    uploaded_at: {
        type: DataTypes.DATE,
    },

},{
    tableName: 'files',
    timestamps: false,
});

module.exports = Files;