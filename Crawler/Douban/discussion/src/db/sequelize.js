const Sequelize = require('sequelize')
const { mysql: config } = require('../config')

/* 表字段 */

const sequelize = new Sequelize(
    config.DATABASE, // 数据库名
    config.USERNAME, // 用户名
    config.PASSWORD, // 用户密码
    {
        logging: false,
        dialect: 'mysql', // 数据库使用mysql
        host: config.HOST, // 数据库服务器ip
        port: config.MYSQL_PORT, // 数据库服务器端口
        pool: config.POOL, // 连接池
        timezone: config.TIMEZONE // 时区
    }
)

// 测试是否连接成功
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

module.exports = sequelize