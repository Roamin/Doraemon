const { service, model } = require('../../db')
const event = require('../../utils/event')
const consumer = require('./consumer')

function reset () {
  return new Promise(async resolve => {
    let groups = await service.Group.findAll({
      raw: true
    })

    if (!groups) return resolve()

    groups = groups.map(group => {
      group.status = 'PENDING'
      group.error = ''

      return group
    })

    if (groups) {
      await model.Group.bulkCreate(groups, {
        updateOnDuplicate: ['status', 'error']
      })
    }

    resolve()
  })
}


async function run () {
  // 找一条待处理数据
  const group = await service.Group.findOne({
    where: {
      status: 'PENDING'
    }
  })

  // 如果没有，停止
  if (!group) {
    event.emit('group-worker-message', {
      event: 'NO_MORE_GROUP',
      message: 'No more group.'
    })

    return
  }

  // 标记正在运行中
  await group.update({
    status: 'RUNNING'
  })

  const id = group.get('id')
  const url = `https://www.douban.com/group/${id}/discussion?start=0`

  consumer(url, group)

  run()
}

async function start () {
  // 重置 category 的状态，DONE => PENDING
  await reset()

  run()
}

module.exports = start
