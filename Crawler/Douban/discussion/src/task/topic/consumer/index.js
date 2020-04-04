const log = require('../../../utils/log')
const event = require('../../../utils/event')
const { service } = require('../../../db')
const getMagnetFromPage = require('./get-magnet-from-page')

async function consumer (page) {
    // 标记正在运行中
    await page.update({
        status: 'RUNNING'
    })

    const url = page.get('url')

    // 判断是否已经存入
    // todo

    const [err, res] = await getMagnetFromPage(url)

    // 如果处理失败
    if (err) {
        await page.update({
            status: 'ERROR',
            error: err.message
        })

        return
    }

    const categoryId = page.get('categoryId')
    const magnet = {
        categoryId,
        ...res
    }

    const existedMagnet = await service.Magnet.findOne({
        where: {
            infoHash: magnet.infoHash
        }
    })

    if (existedMagnet) {
        await existedMagnet.update(magnet)

        event.emit('page-worker-message', {
            status: 'UPDATE_MAGNET',
            message: `update ${magnet.name}`
        })
    } else {
        await service.Magnet.create(magnet)

        event.emit('page-worker-message', {
            status: 'INSERT_MAGNET',
            message: `insert ${magnet.name}`
        })
    }

    await page.destroy()
    event.emit('page-worker-message', {
        status: 'PAGE_DONE',
        message: `delete page: ${url}`
    })
}

module.exports = consumer