const axios = require('axios')
const sleep = require('../../utils/sleep')

let recordsCache = {}

function getProxies () {
    return new Promise(resolve => {
        axios.get('http://localhost:8321/api/proxy/list').then(res => {
            const data = (res.data.data || []).map(proxy => {
                proxy.port = parseInt(proxy.port)
                proxy.key = JSON.stringify(proxy)

                return proxy
            })

            // Random
            data.sort(() => Math.random() - 0.5)

            resolve([null, data])
        }).catch(err => {
            resolve([new Error(err.code)])
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
            return now - record > 10000
        })

        if (ipIndex === -1) {
            console.log('sleep')
            await sleep(10000)

            ipIndex = 0
            now = Date.now()
        }

        const { protocol, hostname: host, port, key } = proxies[ipIndex]

        recordsCache[key] = now

        resolve({
            protocol,
            host,
            port
        })
    })
}