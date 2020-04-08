const Sequelize = require('sequelize')
const sequelize = require('../sequelize')
const User = require('./User')
const Group = require('./Group')

const Topic = sequelize.define('topic', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    groupId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: Group,
            key: 'id'
        }
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    commentCount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    likeCount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    collectCount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = Topic