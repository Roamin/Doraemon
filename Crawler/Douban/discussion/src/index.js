const task = require('./task')

task()

//监听未捕获的异常
process.on('uncaughtException', function (err) {
    console.error(err.message)
})

//监听Promise没有被捕获的失败函数
process.on('unhandledRejection', function (err) {
    console.error(err.message)
})