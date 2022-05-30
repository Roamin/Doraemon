const log = require('../utils/log')
const event = require('../utils/event')
const config = require('../config')
const groupTask = require('./group')
const discussionTask = require('./discussion/worker')

const max = config.mysql.POOL.max - 1
let workerNum = 0

function registerEventListener (eventName, handler = () => { }) {
  event.on(eventName, handler)
}

function handleGroupWorkerEvent ({ event, message }) {
  log.group.info(`${event}\t${message}`)

  // 如果某个小组爬取完成，则唤醒 discussion worker
  if (event === 'GROUP_DONE' && workerNum < max) {
    workerNum++

    log.group.info('load discussion worker', workerNum)

    discussionTask()
  }
}

function handleDiscussionWorkerEvent ({ event, message }) {
  log.discussion.info(`${event}\t${message}`)

  if (event === 'NO_MORE_DISCUSSION') {
    workerNum--
  }
}

function init () {
  log.schedule.info(`Start task.`)

  registerEventListener('group-worker-message', handleGroupWorkerEvent)

  registerEventListener('discussion-worker-message', handleDiscussionWorkerEvent)

  groupTask()
}

module.exports = init