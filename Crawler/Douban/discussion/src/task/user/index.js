const { service } = require('../../db')
const sleep = require('../../utils/sleep')
const getUserGender = require('./get-user-gender')

async function loop (proxy) {
    // 找一条待处理数据
    const user = await service.User.findOne({
        where: {
            gender: 'NULL',
            status: 1,
            count: 0
        }
    })

    // 如果没有，停止
    if (!user) return console.log('No more user.')

    await user.update({
        count: 1
    })

    const id = user.get('id')
    const url = `https://m.douban.com/people/${id}/`

    const [err, res] = await getUserGender(url, proxy)

    if (err) {
        console.log(err.message)
        await user.update({
            count: 0
        })
    } else {
        await user.update({
            ...res
        })

        count++

        console.clear()
        console.log(proxy, 'update', count)
    }

    await sleep(Math.random() * 5000)

    loop(proxy)
}

let count = 0

async function init (limits = 1) {
    const proxies = [{ protocol: 'http', hostname: '144.52.244.182', port: '9999' }, { protocol: 'http', hostname: '144.52.244.182', port: '9999' }, { protocol: 'http', hostname: '144.52.244.182', port: '9999' }]

    for (let i = 0; i < proxies.length; i++) {
        loop(proxies[i])
        await sleep(Math.random() * 500)
    }
}

init()

//监听未捕获的异常
process.on('uncaughtException', function (err) {
    console.error(err.message)
})

//监听Promise没有被捕获的失败函数
process.on('unhandledRejection', function (err) {
    console.error(err.message)
})