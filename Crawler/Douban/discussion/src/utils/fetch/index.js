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

module.exports = (url) => {
  return new Promise(async resolve => {
    const proxy = await getProxy()

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
        await deleteProxy(proxy)
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
        await deleteProxy(proxy)
        return resolve([new Error(`STATUS_CODE: ${response.statusCode || 'UNKNOWN_CODE'}`)])
      }
    })
  })
}