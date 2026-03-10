const sequelize = require('../db/connection');
const { DataTypes } = require('sequelize');

const CollectionFiles = sequelize.define('collection_files', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    collection_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    file_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    qa_description: {
        type: DataTypes.TEXT,
    },

    qa_classification: {
        type: DataTypes.ENUM('INCIDENCIA', 'MEJORA'),
    },

    dev_description: {
        type: DataTypes.TEXT,
    },

    dev_classification: {
        type: DataTypes.ENUM('SOLUCION_APLICADA', 'NO_APLICA'),
    },

    updated_at: {
        type: DataTypes.DATE,
    },

    updated_by_user_id: {
        type: DataTypes.INTEGER,
    },

},{
    tableName: 'collection_files',
    timestamps: false,
});

module.exports = CollectionFiles;