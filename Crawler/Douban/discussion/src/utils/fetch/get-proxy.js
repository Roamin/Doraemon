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
        // const [err, proxies] = await getProxies()
        const proxies = [
            { hostname: '139.194.51.23', port: 8080, protocol: 'http' },
            { hostname: '36.89.189.137', port: 36922, protocol: 'http' },
            { hostname: '58.253.157.154', port: 9999, protocol: 'http' },
            { hostname: '49.86.183.94', port: 9999, protocol: 'http' },
            { hostname: '213.6.28.66', port: 8080, protocol: 'http' },
            { hostname: '77.48.22.59', port: 30442, protocol: 'http' },
            { hostname: '94.153.224.194', port: 58713, protocol: 'http' },
            { hostname: '58.253.155.203', port: 9999, protocol: 'http' },
            { hostname: '36.255.85.229', port: 83, protocol: 'http' },
            { hostname: '77.70.35.87', port: 60186, protocol: 'http' },
            { hostname: '77.79.253.231', port: 80, protocol: 'http' },
            { hostname: '91.82.42.2', port: 43881, protocol: 'http' },
            { hostname: '94.143.48.53', port: 8080, protocol: 'http' },
            { hostname: '195.225.49.131', port: 58302, protocol: 'http' },
            { hostname: '128.1.210.2', port: 3128, protocol: 'http' },
            { hostname: '36.255.87.251', port: 83, protocol: 'http' },
            { hostname: '223.247.130.60', port: 808, protocol: 'http' },
            { hostname: '102.164.220.152', port: 53049, protocol: 'http' },
            { hostname: '95.179.162.13', port: 8080, protocol: 'http' },
            { hostname: '62.4.54.158', port: 53102, protocol: 'http' },
            { hostname: '202.152.27.75', port: 8080, protocol: 'http' },
            { hostname: '103.105.80.13', port: 8080, protocol: 'http' },
            { hostname: '212.156.149.38', port: 53100, protocol: 'http' },
            { hostname: '95.179.197.59', port: 8080, protocol: 'http' },
            { hostname: '46.209.63.178', port: 3128, protocol: 'http' },
            { hostname: '177.38.76.153', port: 8080, protocol: 'http' },
            { hostname: '59.62.24.151', port: 9000, protocol: 'http' },
            { hostname: '36.249.49.58', port: 9999, protocol: 'http' },
            { hostname: '60.13.42.132', port: 9999, protocol: 'http' },
            { hostname: '91.205.174.26', port: 80, protocol: 'http' },
            { hostname: '191.242.230.135', port: 8080, protocol: 'http' },
            { hostname: '195.138.72.84', port: 55126, protocol: 'http' },
            { hostname: '63.246.57.113', port: 46312, protocol: 'http' },
            { hostname: '58.253.156.34', port: 9999, protocol: 'http' },
            { hostname: '36.94.23.154', port: 9999, protocol: 'http' },
            { hostname: '62.69.214.17', port: 8090, protocol: 'http' },
            { hostname: '95.51.161.226', port: 38513, protocol: 'http' },
            { hostname: '80.51.61.3', port: 8080, protocol: 'http' },
            { hostname: '60.13.42.142', port: 9999, protocol: 'http' },
            { hostname: '103.14.198.209', port: 83, protocol: 'http' },
            { hostname: '46.209.131.245', port: 8080, protocol: 'http' },
            { hostname: '36.89.69.226', port: 56222, protocol: 'http' },
            { hostname: '60.162.72.121', port: 9000, protocol: 'http' },
            { hostname: '45.112.127.23', port: 8080, protocol: 'http' },
            { hostname: '89.218.170.54', port: 35704, protocol: 'http' },
            { hostname: '203.143.19.85', port: 8080, protocol: 'http' },
            { hostname: '217.23.69.146', port: 8080, protocol: 'http' },
            { hostname: '150.107.205.82', port: 8081, protocol: 'http' },
            { hostname: '45.4.237.72', port: 32956, protocol: 'http' },
            { hostname: '94.28.93.117', port: 8080, protocol: 'http' },
            { hostname: '223.242.224.70', port: 9999, protocol: 'http' },
            { hostname: '45.64.11.77', port: 8080, protocol: 'http' },
            { hostname: '41.194.37.106', port: 52355, protocol: 'http' },
            { hostname: '60.13.42.247', port: 9999, protocol: 'http' },
            { hostname: '193.117.138.126', port: 39900, protocol: 'http' },
            { hostname: '47.99.61.236', port: 9999, protocol: 'http' },
            { hostname: '36.67.27.189', port: 47877, protocol: 'http' },
            { hostname: '45.175.239.1', port: 999, protocol: 'http' },
            { hostname: '93.117.72.27', port: 32468, protocol: 'http' },
            { hostname: '58.253.154.45', port: 9999, protocol: 'http' },
        ]

        // if (err) {
        //     console.error('Get proxy failed:', err)

        //     return resolve(false)
        // }

        // if (proxies.length === 0) {
        //     console.error('Proxy pool is empty')

        //     return resolve(false)
        // }

        // // record
        // proxies.forEach(({ key }) => {
        //     // if new proxy exists
        //     records[key] = recordsCache[key]
        // })

        // // refresh cache
        // recordsCache = records

        // // find one
        // let ipIndex = proxies.findIndex(({ key }) => {
        //     const record = recordsCache[key]

        //     if (typeof record === 'undefined') return true

        //     // 10s
        //     return now - record > 1000
        // })

        // if (ipIndex === -1) {
        //     console.log('sleep')
        //     await sleep(5000)

        //     ipIndex = 0
        //     now = Date.now()
        // }

        const { protocol, hostname, port } = proxies[parseInt(proxies.length * Math.random())]

        // recordsCache[key] = now

        console.log(`${protocol}://${hostname}:${port}`)


        resolve(`${protocol}://${hostname}:${port}`)
    })
}