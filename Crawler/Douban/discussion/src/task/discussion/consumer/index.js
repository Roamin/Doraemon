const event = require('../../../utils/event')
const { service } = require('../../../db')
const getTopicPageInfo = require('./get-topic-page-info')
const getTopicComments = require('./get-topic-comments')

function consumer (discussion) {
    return new Promise(async resolve => {
        // 标记正在运行中
        await discussion.update({
            status: 'RUNNING'
        })

        const url = discussion.get('url')

        // 获取话题 Topic 信息，需要返回创建 user
        const [errTopic, resTopic, $topicPage] = await getTopicPageInfo(url)
        if (errTopic) {
            await discussion.update({
                status: 'ERROR',
                error: errTopic.message
            })

            return resolve([errTopic])
        }

        // 获取话题下面的评论，需要返回创建 users
        const [errTopicComments, topicComments] = await getTopicComments(url, $topicPage)
        if (errTopicComments) {
            await discussion.update({
                status: 'ERROR',
                error: errTopicComments.message
            })

            return resolve([errTopicComments])
        }

        const groupId = discussion.get('groupId')
        const topic = {
            groupId,
            ...resTopic.topic
        }

        const userMap = {}
        let users = [resTopic.user, ...topicComments.users]

        // 因为可能出现回复的消息被删除，导致没有用户头像
        users.forEach(user => {
            userMap[user.id] = Object.assign(userMap[user.id] || {}, user)
        })

        users = Object.keys(userMap).map(id => userMap[id])

        // 先创建用户，避免后面 topic、comment 关联失败
        const [createUsersErr] = await service.User.bulkCreate(users, { ignoreDuplicates: true })
        if (createUsersErr) {
            await discussion.update({
                status: 'ERROR',
                error: createUsersErr.message
            })

            return resolve([createUsersErr])
        }

        const [createTopicsErr] = await service.Topic.bulkCreate([topic], { updateOnDuplicate: ['title', 'text', 'content', 'commentCount', 'likeCount', 'collectCount'] })
        if (createTopicsErr) {
            await discussion.update({
                status: 'ERROR',
                error: createTopicsErr.message
            })

            return resolve([createTopicsErr])
        }

        const [createCommentsErr] = await service.Comment.bulkCreate(topicComments.comments, { ignoreDuplicates: true })
        if (createCommentsErr) {
            await discussion.update({
                status: 'ERROR',
                error: createCommentsErr.message
            })

            return resolve([createCommentsErr])
        }

        event.emit('discussion-worker-message', {
            event: 'INSERT_TOPIC',
            message: `insert ${topic.title} with ${topicComments.comments.length} comments`
        })

        await discussion.update({
            status: 'DONE',
            loops: discussion.get('loops') + 1
        })

        event.emit('discussion-worker-message', {
            event: 'DISCUSSION_DONE',
            message: `updated discussion: ${discussion.get('title')}`
        })

        resolve([null])
    })
}

module.exports = consumer