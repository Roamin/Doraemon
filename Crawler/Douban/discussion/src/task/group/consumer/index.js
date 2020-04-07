const Sequelize = require('sequelize')
const sleep = require('../../../utils/sleep')
const event = require('../../../utils/event')
const getUrlParam = require('../../../utils/get-url-param')
const { service } = require('../../../db')
const getGroupDiscussions = require('./get-group-discussions')

function filterDiscussions (discussions) {
    return new Promise(async resolve => {
        // 已存在的 Discussion
        let existedDiscussions = await service.Discussion.findAll({
            where: {
                url: {
                    [Sequelize.Op.or]: discussions.map(discussion => discussion.url)
                }
            },
            raw: true
        })
        // 已存在的 Topic
        let existedTopics = await service.Topic.findAll({
            where: {
                id: {
                    [Sequelize.Op.or]: discussions.map(discussion => getUrlParam(discussion.url, 'topic'))
                }
            },
            raw: true
        })

        existedDiscussions = existedDiscussions || []
        existedTopics = existedTopics || []

        // 如果并没有重复
        if (existedDiscussions.length === 0 && existedTopics.length === 0) {
            return resolve(discussions)
        }

        existedDiscussions = existedDiscussions.map(discussion => discussion.url)
        existedTopics = existedTopics.map(magnet => magnet.origin)

        // 已存在的
        existedDiscussions = existedDiscussions.concat(existedTopics)

        const filteredDiscussions = discussions.filter(discussion => !existedDiscussions.includes(discussion.url))

        resolve(filteredDiscussions)
    })
}

async function consumer (url, group) {
    const [err, res] = await getGroupDiscussions(url)

    // 如果处理失败
    if (err) {
        await group.update({
            status: 'ERROR',
            error: err.message
        })

        return
    }

    const groupId = group.get('id')
    const discussions = res.discussions.map(discussion => {
        discussion.groupId = groupId

        return discussion
    })
    const filteredDiscussions = await filterDiscussions(discussions)

    // 如果有未存入的数据，则批量插入 discussions
    if (filteredDiscussions.length > 0) {
        await service.Discussion.create(filteredDiscussions)

        event.emit('group-worker-message', {
            status: 'CREATE_DISCUSSION',
            message: `[${group.get('name')}] - ${url} insert ${filteredDiscussions.length} discussions`
        })
    }

    const loops = group.get('loops')
    const hasDuplicate = discussions.length > filteredDiscussions.length

    // 检测是否有重复
    // 如果是第一轮爬取，则忽略碰到重复数据
    if ((!hasDuplicate || loops === 0) && res.next) {
        await sleep(2000)
        return consumer(res.next, group)
    }

    await group.update({
        status: 'DONE',
        loops: loops + 1
    })

    event.emit('group-worker-message', {
        status: 'GROUP_DONE',
        message: `[${loops} => ${loops + 1}] - [${group.get('name')}] done.`
    })
}

module.exports = consumer