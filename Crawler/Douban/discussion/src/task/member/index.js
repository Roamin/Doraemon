const { service, model } = require('../../db')
const getGroupMembers = require('./consumer/get-group-members')

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

members()