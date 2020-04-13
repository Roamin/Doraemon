const Sequelize = require('sequelize')
const event = require('../../../utils/event')
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


        existedDiscussions = existedDiscussions || []

        // 如果并没有重复
        if (existedDiscussions.length === 0) {
            return resolve(discussions)
        }

        const existedDiscussionMap = {}
        existedDiscussions = existedDiscussions.forEach(discussion => {
            existedDiscussionMap[discussion.url] = discussion
        })

        // 保留未插入的数据
        // 或者更新时间不一致的
        let filteredDiscussions = discussions.filter(({ url, updatedAt }) => {
            const existedDiscussion = existedDiscussionMap[url]

            if (typeof existedDiscussion === 'undefined') {
                return true
            }

            return (new Date(existedDiscussion.updatedAt)).getTime() !== (new Date(updatedAt)).getTime()
        })

        // 增加 status，方便重复数据覆盖 status
        filteredDiscussions = filteredDiscussions.map(discussion => {
            discussion.status = 'PENDING'

            return discussion
        })

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
        const [bulkCreateError] = await service.Discussion.bulkCreate(filteredDiscussions, { updateOnDuplicate: ['status', 'updatedAt'] })

        if (bulkCreateError) {
            await group.update({
                status: 'ERROR',
                error: bulkCreateError.message
            })
        }

        event.emit('group-worker-message', {
            event: 'CREATE_DISCUSSION',
            message: `[${group.get('name')}] - ${url} insert ${filteredDiscussions.length} discussions`
        })
    }

    const loops = group.get('loops')
    const hasDuplicate = filteredDiscussions.length === 0

    // 检测是否有重复
    // 如果是第一轮爬取，则忽略碰到重复数据
    if ((!hasDuplicate || loops === 0) && res.next) {
        return consumer(res.next, group)
    }

    await group.update({
        status: 'DONE',
        loops: loops + 1
    })

    event.emit('group-worker-message', {
        event: 'GROUP_DONE',
        message: `[${loops} => ${loops + 1}] - [${group.get('name')}] done.`
    })
}

module.exports = consumer