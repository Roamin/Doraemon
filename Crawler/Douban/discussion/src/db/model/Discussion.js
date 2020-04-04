const Sequelize = require('sequelize')
const sequelize = require('../sequelize')
const Group = require('./Group')

const Discussion = sequelize.define('discussion', {
    url: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'RUNNING', 'ERROR'],
        defaultValue: 'PENDING',
        allowNull: false
    },
    error: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Group,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = Discussion