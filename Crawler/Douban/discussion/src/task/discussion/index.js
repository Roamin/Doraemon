const { service } = require('../../db')
const event = require('../../utils/event')
const sleep = require('../../utils/sleep')
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

    const [err] = await consumer(discussion)
    if (err) {
        console.error('consumer error:', err.message)
    } else {
        console.clear()
        console.log('done')
    }

    await sleep(Math.random() * 5000)
    loop()
}

module.exports = loop