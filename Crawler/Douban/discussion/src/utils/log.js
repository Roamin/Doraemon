const path = require('path')
const log4js = require('log4js')

log4js.configure({
    appenders: {
        console: {  //控制台打印日志
            type: 'console'
        },
        category: {  // 文件形式打印日志
            type: 'dateFile',
            filename: path.join(__dirname, '../../logs/category/category'), // 写入日志文件的路径
            alwaysIncludePattern: true, // （默认为false） - 将模式包含在当前日志文件的名称以及备份中
            pattern: '.yyyy-MM-dd.log', // （可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
            encoding: 'utf-8', // default 'utf-8'，文件的编码
            maxLogSize: 1024 * 1024, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件xxx.log.1的序列自增长的文件
            backups: 3,
        },
        page: {  // 文件形式打印日志
            type: 'dateFile',
            filename: path.join(__dirname, '../../logs/page/page'), // 写入日志文件的路径
            alwaysIncludePattern: true, // （默认为false） - 将模式包含在当前日志文件的名称以及备份中
            pattern: '.yyyy-MM-dd.log', // （可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
            encoding: 'utf-8', // default 'utf-8'，文件的编码
            maxLogSize: 1024 * 1024, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件xxx.log.1的序列自增长的文件
            backups: 3,
        },
        exception: {  // 文件形式打印日志
            type: 'dateFile',
            filename: path.join(__dirname, '../../logs/exception/exception'), // 写入日志文件的路径
            alwaysIncludePattern: true, // （默认为false） - 将模式包含在当前日志文件的名称以及备份中
            pattern: '.yyyy-MM-dd.log', // （可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
            encoding: 'utf-8', // default 'utf-8'，文件的编码
            maxLogSize: 1024 * 1024, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件xxx.log.1的序列自增长的文件
            backups: 3,
        },
        schedule: {  // 文件形式打印日志
            type: 'dateFile',
            filename: path.join(__dirname, '../../logs/schedule'), // 写入日志文件的路径
            alwaysIncludePattern: true, // （默认为false） - 将模式包含在当前日志文件的名称以及备份中
            pattern: '.yyyy.log', // （可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
            encoding: 'utf-8', // default 'utf-8'，文件的编码
            maxLogSize: 1024 * 1024, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件xxx.log.1的序列自增长的文件
            backups: 3,
        }
    },
    categories: {
        default: {  //默认使用打印日志的方式
            appenders: ['console'], // 指定为上面定义的appender，如果不指定，无法写入
            level: 'INFO'       //打印日志的级别
        },
        category: {
            appenders: ['category'],
            level: 'INFO'
        },
        page: {
            appenders: ['page'],
            level: 'INFO'
        },
        exception: {
            appenders: ['exception'],
            level: 'INFO'
        },
        schedule: {
            appenders: ['schedule'],
            level: 'INFO'
        }
    }
})

exports.category = log4js.getLogger('category')
exports.page = log4js.getLogger('page')
exports.exception = log4js.getLogger('exception')
exports.schedule = log4js.getLogger('schedule')