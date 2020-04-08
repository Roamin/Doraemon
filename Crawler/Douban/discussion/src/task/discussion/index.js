const { service } = require('../../db')
const sleep = require('../../utils/sleep')
const event = require('../../utils/event')
const consumer = require('./consumer')

async function loop () {
    // 找一条待处理数据
    const discussion = await service.Discussion.findOne({
        where: {
            status: 'PENDING'
        }
    })

    // 如果没有，停止
    if (!discussion) {
        event.emit('discussion-worker-message', {
            event: 'NO_MORE_DISCUSSION',
            message: 'No more discussion.'
        })

        return
    }

    consumer(discussion)

    await sleep(10000 + Math.random() * 5000)
    loop()
}

module.exports = loop