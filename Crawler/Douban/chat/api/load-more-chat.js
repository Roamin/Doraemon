const qs = require('querystring')
const request = require('request')

const config = require('../config')

/**
 * 创建相册
 * @param {Object} formData 
 */

const DEFAULT_FORM_DATA = {
    ck: config.ck // 不知道是啥
}

function loadMoreChat (formData) {
    const formDataStr = qs.stringify(Object.assign({}, DEFAULT_FORM_DATA, formData))

    return new Promise(resolve => {
        request({
            url: 'https://www.douban.com/j/doumail/loadmore', // 请求路径
            method: 'POST',
            headers: config.headers,
            body: formDataStr
        }, function (error, response, body) {
            if (error) {
                return resolve([error, null])
            }

            if (response.statusCode === 200) {
                const res = JSON.parse(body)

                resolve([null, res])
            } else {
                resolve([new Error(body), null])
            }
        })
    })
}

module.exports = loadMoreChat