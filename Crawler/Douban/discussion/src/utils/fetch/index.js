const axios = require('axios')
// const axiosRetry = require('axios-retry')
const cheerio = require('cheerio')

const userAgents = require('./user-agents')
const getProxy = require('./get-proxy')

// axiosRetry(axios, {
//     retries: 3,
//     // retryDelay: (retryCount) => {
//     //     return retryCount * 1000
//     // }
// })

function getCookie () {
    const str = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)

    const bid = str.slice(0, 11)

    return `bid=${bid}`
}

module.exports = (url) => {
    return new Promise(async resolve => {
        const proxy = await getProxy()
        console.log(proxy)
        const fetch = axios.create({
            timeout: 10000, // ms
            headers: {
                'User-Agent': userAgents(),
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'Accept-Language': 'zh-CN,zh;q=0.8',
                'Cookie': getCookie()
            },
            proxy
        })

        fetch(url).then(res => {
            try {
                console.log(res.data)
                const $ = cheerio.load(res.data)

                resolve([null, $])

            } catch (e) {
                resolve([e])
            }

        }).catch(error => {
            resolve([new Error(error.code)])
        })
    })
}