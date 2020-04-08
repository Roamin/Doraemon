const { service } = require('../../db')
const consumer = require('./consumer')

async function loop () {
    // 找一条待处理数据
    const discussion = await service.Discussion.findOne()

    // 如果没有，停止
    if (!discussion) return console.log('Discussion initialization completed.')

    consumer(discussion)
}

loop()