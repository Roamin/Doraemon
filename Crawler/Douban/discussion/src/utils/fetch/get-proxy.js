const axios = require('axios')
const sleep = require('../../utils/sleep')

let recordsCache = {}

function getProxies () {
    return new Promise(resolve => {
        axios.get('http://localhost:8321/api/proxy/list').then(res => {
            try {
                const data = (res.data.data || []).map(proxy => {
                    return {
                        ...proxy,
                        key: JSON.stringify(proxy)
                    }
                })

                // Random
                data.sort(() => Math.random() - 0.5)

                resolve([null, data])
            } catch (e) {
                resolve([e])
            }
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

            return resolve(null)
        }

        if (proxies.length === 0) {
            console.error('Proxy pool is empty')

            return resolve(null)
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

        console.log(recordsCache)

        resolve({
            protocol,
            host,
            port
        })
    })
}