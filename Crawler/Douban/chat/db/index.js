const Sequelize = require('sequelize')
const { mysql: config } = require('../config')

/* 表字段 */

const db = new Sequelize(
    config.DATABASE, // 数据库名
    config.USERNAME, // 用户名
    config.PASSWORD, // 用户密码
    {
        dialect: 'mysql', // 数据库使用mysql
        host: config.HOST, // 数据库服务器ip
        port: config.MYSQL_PORT // 数据库服务器端口
    }
)

module.exports = db