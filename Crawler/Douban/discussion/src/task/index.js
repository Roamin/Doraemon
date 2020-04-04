const log = require('../utils/log')
const event = require('../utils/event')
const config = require('../config')
const categoryWorker = require('./category/worker')
const pageWorker = require('./page/worker')

const max = config.mysql.POOL.max - 1
let workerNum = 0

function registerEventListener (eventName, handler = () => { }) {
    event.on(eventName, handler)
}

function handleCategoryWorkerEvent ({ status, message }) {
    log.category.info(`${status}\t${message}`)

    // 如果某个分类爬取完成，则唤醒 page worker
    if (status === 'CATEGORY_DONE' && workerNum < max) {
        workerNum++
        log.category.info('load page worker', workerNum)

        try {
            pageWorker()
        } catch (err) {
            log.exception.info(`Catch Exception:\t${err.message}`)
        }
    }
}

function handlePageWorkerEvent ({ status, message }) {
    log.page.info(`${status}\t${message}`)

    if (status === 'NO_MORE_PAGE') {
        workerNum--
    }
}

function init () {
    log.schedule.info(`Start task.`)

    registerEventListener('category-worker-message', handleCategoryWorkerEvent)

    registerEventListener('page-worker-message', handlePageWorkerEvent)

    try {
        categoryWorker()
    } catch (err) {
        log.exception.info(`Catch Exception:\t${err.message}`)
    }
}

init()