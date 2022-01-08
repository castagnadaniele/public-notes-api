const { Model, DataTypes } = require('sequelize')

class Note extends Model {}

function initNotes(sequelize) {
    Note.init(
        {
            title: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        { sequelize, modelName: 'notes' }
    )
}

module.exports = {
    Note: Note,
    initNotes,
}
