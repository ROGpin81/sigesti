const sequelize = require('../bd/conexion');
const { DataTypes } = require('sequelize');

const File = sequelize.define('files', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    original_filename: {
        type: DataTypes.STRING,
    },

    storage_key: {
        type: DataTypes.STRING,
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
    },

    uploaded_at: {
        type: DataTypes.DATE,
    },

},{
    tableName: 'files',
    timestamps: false,
});

module.exports = File;