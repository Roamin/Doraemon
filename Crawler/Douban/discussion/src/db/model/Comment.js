const Sequelize = require('sequelize')
const sequelize = require('../sequelize')
const User = require('./User')

const Comment = sequelize.define('comment', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    topicId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    author: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    created: {
        type: Sequelize.DATE,
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = Comment