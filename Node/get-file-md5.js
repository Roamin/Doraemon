const fs = require('fs')
const crypto = require('crypto')

function getFileMd5 (path) {
    return new Promise(resolve => {
        const md5sum = crypto.createHash('md5')
        const stream = fs.createReadStream(path)

        stream.on('data', chunk => {
            md5sum.update(chunk)
        })

        stream.on('close', () => {
            const hash = md5sum.digest('hex')

            resolve([false, hash])
        })

        stream.on('error', error => {
            resolve([error])
        })
    })
}

module.exports = getFileMd5