const request = require('request')
const sleep = require('../../utils/sleep')

let recordsCache = {}

function getProxies () {
    return new Promise(resolve => {
        request('http://localhost:8321/api/proxy/list', (error, response, body) => {
            if (error) {
                return resolve([error])
            }

            if (response && response.statusCode === 200) {
                const res = JSON.parse(body)
                const data = (res.data || []).map(proxy => {
                    proxy.port = parseInt(proxy.port)
                    proxy.key = JSON.stringify(proxy)

                    return proxy
                })

                // Random
                data.sort(() => Math.random() - 0.5)

                resolve([null, data])
            } else {
                return resolve([new Error(`STATUS_CODE: ${response.statusCode || 'UNKNOWN_CODE'}`)])
            }
        })
    })
}

module.exports = function getProxy () {
    return new Promise(async resolve => {
        let now = Date.now()
        const records = {}
        const [err, proxies] = await getProxies()

        if (err) {
            console.error('Get proxy failed:', err)

            return resolve(false)
        }

        if (proxies.length === 0) {
            console.error('Proxy pool is empty')

            return resolve(false)
        }

        // record
        proxies.forEach(({ key }) => {
            // if new proxy exists
            records[key] = recordsCache[key]
        })

        // refresh cache
        recordsCache = records

        // find one
        let ipIndex = proxies.findIndex(({ key }) => {
            const record = recordsCache[key]

            if (typeof record === 'undefined') return true

            // 10s
            return now - record > 5000
        })

        if (ipIndex === -1) {
            console.log('sleep')
            await sleep(5000)

            ipIndex = 0
            now = Date.now()
        }

        const { protocol, hostname, port, key } = proxies[ipIndex]

        recordsCache[key] = now

        resolve(`${protocol}://${hostname}:${port}`)
    })
}