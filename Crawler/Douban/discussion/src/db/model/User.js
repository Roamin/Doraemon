const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

const User = sequelize.define('user', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'https://img3.doubanio.com/icon/user_normal_f.jpg'
    },
    gender: {
        type: Sequelize.ENUM,
        values: ['MALE', 'FEMALE', 'UNKNOWN', 'NULL'],
        defaultValue: 'NULL',
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = User