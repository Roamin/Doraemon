const { service } = require('../../db')
const sleep = require('../../utils/sleep')
const event = require('../../utils/event')
const consumer = require('./consumer')

async function loop () {
    // 找一条待处理数据
    const group = await service.Group.findOne({
        where: {
            status: 'PENDING'
        }
    })

    // 如果没有，停止
    if (!group) {
        event.emit('group-worker-message', {
            status: 'NO_MORE_GROUP',
            message: 'No more group.'
        })

        return
    }

    // 标记正在运行中
    await group.update({
        status: 'RUNNING'
    })

    const url = group.get('url')

    consumer(url, group)

    await sleep(2000)
    loop()
}

module.exports = loop
