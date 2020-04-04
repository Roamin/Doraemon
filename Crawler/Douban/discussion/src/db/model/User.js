const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = User