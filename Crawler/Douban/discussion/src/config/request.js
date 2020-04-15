const request = require('request')
const sleep = require('../utils/sleep')
const userAgents = require('./user-agents')

let recordsCache = {}

function getProxies () {
    return new Promise(resolve => {
        request({
            url: 'http://localhost:8321/api/proxy/list',
            method: 'GET',
        }, (error, response, body) => {
            if (error) {
                return resolve([error])
            }

            if (response.statusCode === 200) {
                try {
                    const { data } = JSON.parse(body)

                    resolve([null, data.sort(() => Math.random() - 0.5)])
                } catch (e) {
                    resolve([e])
                }
            } else {
                resolve([new Error(body)])
            }
        })
    })
}

function getProxyUrl ({ hostname, port, protocol }) {
    return `${protocol}://${hostname}:${port}`
}

module.exports = {
    headers () {
        return {
            'Content-Type': `application/x-www-form-urlencoded`,
            'User-Agent': userAgents()
        }
    },
    proxy () {
        return new Promise(async resolve => {
            let now = Date.now()
            const records = {}
            const [err, proxies = []] = await getProxies()

            if (err || proxies.length === 0) {
                console.error(err)
                return resolve(null)
            }

            proxies.forEach(proxy => {
                const url = getProxyUrl(proxy)

                records[url] = recordsCache[url]
            })

            recordsCache = records

            // random
            let ipIndex = proxies.findIndex((proxy) => {
                const record = recordsCache[getProxyUrl(proxy)]

                if (typeof record === 'undefined') return true

                return now - record > 60000
            })

            if (ipIndex === -1) {
                console.log('sleep')
                await sleep(6000)

                ipIndex = 0
                now = Date.now()
            }

            const item = proxies[ipIndex]

            if (typeof item === 'undefined') {
                console.log('no proxy')
                return resolve(null)
            }

            const url = getProxyUrl(item)

            recordsCache[url] = now

            console.log(url)
            resolve(url)
        })
    }
}