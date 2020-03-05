const Sequelize = require('sequelize')
const db = require('../db')

const Message = db.define('message', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    user: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    time: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = Message