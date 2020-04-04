const { service } = require('../../db')
const consumer = require('./consumer')

async function loop () {
    // 找一条待处理数据
    const page = await service.Page.findOne({
        where: {
            url: 'http://www.xxizhan.com/thread-1930-1-1.html'
            // status: 'PENDING'
        }
    })

    // 如果没有，停止
    if (!page) return console.log('Page initialization completed.')

    consumer(page)
}

loop()