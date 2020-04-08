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
        values: ['PENDING', 'RUNNING', 'DONE', 'ERROR'],
        defaultValue: 'PENDING',
        allowNull: false
    },
    error: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    groupId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: Group,
            key: 'id'
        }
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    loops: { //  遍历次数
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = Discussion