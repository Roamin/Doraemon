const model = require('./model')
const sequelize = require('./sequelize')

// 基于 sequelize 自动创建表
// alter: true   若 model 有改动，则同时变更数据库表格结构，原有的数据不变
// force: true   若 force 为 true，则每个 Model 在尝试创建自己的表之前将运行 DROP TABLE IF EXISTS
sequelize
    .sync({
        force: true
    })
    .then(() => {
        console.log(`Sync all defined models to the DB.`)
    })
    .catch(err => {
        console.error('Unable to sync defined models:', err)
    })