
const DB = require('../db')

//表
const Message = require('./message')


//基于sequelize自动创建表//【！！注意 首次执行完请注释掉该段代码 ！！】
// DB.sync({
//     force: true,//是否清空数据库表
// }).then(function () {
//     console.log('ok')
// })

module.exports = {
    Message
}