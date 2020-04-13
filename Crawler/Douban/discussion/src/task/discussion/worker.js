const loop = require('./index')
const sleep = require('../../utils/sleep')

async function init () {
    loop()
    await sleep(1000)
    loop()
    await sleep(1000)
    loop()
    await sleep(1000)
    loop()
    await sleep(1000)
    loop()
    // await sleep(1000)
    // loop()
}

module.exports = init




