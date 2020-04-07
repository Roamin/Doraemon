const { service, model } = require('../../db')
const getGroupDiscussions = require('./consumer/get-group-discussions')
const getGroupMembers = require('./consumer/get-group-members')

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

    // 批量插入 discussions
    console.log(res.next, res.discussions)
}

async function loop () {
    // 找一条待处理数据
    const group = await service.Group.findOne({
        where: {
            status: 'PENDING'
        },
        attributes: ['id']
    })

    // 如果没有，停止
    if (!group) return console.log('No more group.')

    // 标记正在运行中
    await group.update({
        status: 'RUNNING'
    })

    const id = group.get('id')
    const url = `https://www.douban.com/group/${id}/discussion?start=0`

    consumer(url, group)

    loop()
}

async function reset () {
    let groups = await service.Group.findAll({
        where: {
            status: 'RUNNING'
        },
        raw: true
    })

    if (!groups) return

    groups = groups.map(group => {
        group.status = 'PENDING'

        return group
    })


    if (groups) await model.Group.bulkCreate(groups, {
        updateOnDuplicate: ['status']
    })
}

async function members () {
    // 找一条待处理数据
    const group = await service.Group.findOne()

    // 如果没有，停止
    if (!group) return console.log('No more group.')

    const id = group.get('id')
    const url = `https://www.douban.com/group/${id}/members`

    const result = await getGroupMembers(url)

    console.log(result)
}

// reset()

// loop()

members()