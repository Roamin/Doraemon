const { service } = require('../../db')
const sleep = require('../../utils/sleep')
const event = require('../../utils/event')
const consumer = require('./consumer')

async function loop () {
    // 找一条待处理数据
    const page = await service.Page.findOne({
        where: {
            status: 'PENDING'
        }
    })

    // 如果没有，停止
    if (!page) {
        event.emit('page-worker-message', {
            status: 'NO_MORE_PAGE',
            message: 'No more page.'
        })

        return
    }

    consumer(page)

    await sleep(2000)
    loop()
}

module.exports = loop