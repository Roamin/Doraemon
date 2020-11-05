const request = require('request')
const url = require('url')

function deleteProxy (proxy) {
    const { hostname, port } = url.parse(proxy)

    return new Promise(resolve => {
        request(`http://localhost:8321/api/proxy/delete?proxyStr=${JSON.stringify({
            protocol: 'http',
            hostname,
            port
        })}`, (error, response, body) => {
            if (error) {
                return resolve([error])
            }

            if (response && response.statusCode === 200) {
                resolve([null, true])
            } else {
                return resolve([new Error(`delete failed: ${response.statusCode || 'UNKNOWN_CODE'}`)])
            }
        })
    })
}

module.exports = deleteProxy