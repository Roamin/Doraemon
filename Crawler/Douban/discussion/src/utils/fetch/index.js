const request = require('request')
const cheerio = require('cheerio')

const userAgents = require('./user-agents')
const getProxy = require('./get-proxy')
const deleteProxy = require('./delete-proxy')
const sleep = require('../sleep')

function getCookie () {
    const str = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)

    const bid = str.slice(0, 11)

    return `bid=${bid}`
}

// const proxies = [
//     'http://218.2.226.42:80',
//     'http://153.35.185.69:80',
//     'http://123.139.56.238:9999',
//     'http://35.184.36.190:80',
//     'http://61.220.204.25:3128',
//     'http://36.22.208.248:8118'
// ]

module.exports = (url, { hostname, port, protocol }) => {
    const proxy = `${protocol}://${hostname}:${port}`

    return new Promise(async resolve => {
        const options = {
            url,
            headers: {
                'Content-Type': `application/x-www-form-urlencoded`,
                'User-Agent': userAgents(),
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'Accept-Language': 'zh-CN,zh;q=0.8',
                'Cookie': getCookie()
            },
            proxy
        }

        request(options, async (error, response, body) => {
            if (error) {
                console.log('del', proxy)
                // await deleteProxy(proxy)
                return resolve([error])
            }

            if (response && response.statusCode === 200) {
                if (body.indexOf('个人主页') !== -1) {
                    const $ = cheerio.load(body)

                    return resolve([null, $])
                } else {
                    return resolve([new Error('PROXY_ERROR')])
                }
            } else {
                console.log('del', proxy)
                // await deleteProxy(proxy)
                return resolve([new Error(`STATUS_CODE: ${response.statusCode || 'UNKNOWN_CODE'}`)])
            }
        })
    })
}