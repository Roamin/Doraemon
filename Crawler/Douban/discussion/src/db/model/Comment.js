const Sequelize = require('sequelize')
const sequelize = require('../sequelize')
const User = require('./User')
const Topic = require('./Topic')

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
        references: {
            model: Topic,
            key: 'id'
        }
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    to: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    content: {
        type: Sequelize.TEXT,
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

module.exports = Comment