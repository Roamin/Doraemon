const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

const Group = sequelize.define('group', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: { // 状态，PENDING: 等待遍历, RUNNING: 遍历中, DONE: 遍历完成, DISABLED: 已禁止, ERROR: 遍历错误
        type: Sequelize.ENUM,
        values: ['PENDING', 'RUNNING', 'DONE', 'DISABLED', 'ERROR'],
        defaultValue: 'PENDING',
        allowNull: false
    },
    error: { // 错误信息
        type: Sequelize.TEXT,
        allowNull: true
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

module.exports = Group