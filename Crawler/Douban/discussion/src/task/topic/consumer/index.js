const event = require('../../../utils/event')
const { service } = require('../../../db')
const getTopicPageInfo = require('./get-topic-page-info')
const getTopicComments = require('./get-topic-comments')

async function consumer (discussion) {
    // 标记正在运行中
    await discussion.update({
        status: 'RUNNING'
    })

    const url = discussion.get('url')

    const [errTopic, resTopic] = await getTopicPageInfo(url)
    const [errTopicComments, topicComments] = await getTopicComments(url)

    // 如果处理失败
    if (errTopic) {
        await discussion.update({
            status: 'ERROR',
            error: errTopic.message
        })

        return
    }
    if (errTopicComments) {
        await discussion.update({
            status: 'ERROR',
            error: errTopicComments.message
        })

        return
    }

    const groupId = discussion.get('groupId')
    const topic = {
        groupId,
        ...resTopic
    }

    console.log(await service.Topic.create(topic))
    await service.Comment.create(topicComments)

    event.emit('discussion-worker-message', {
        status: 'INSERT_TOPIC',
        message: `insert ${topic.title} with ${topicComments.length} comments`
    })

    // await discussion.destroy()
    event.emit('discussion-worker-message', {
        status: 'DISCUSSION_DONE',
        message: `delete discussion: ${url}`
    })
}

module.exports = consumer