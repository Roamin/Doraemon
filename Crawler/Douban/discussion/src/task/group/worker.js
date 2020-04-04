const loop = require('./index')
const reset = require('./reset')

async function init () {
    // 重置 category 的状态，DONE => PENDING
    await reset()

    loop()
}

module.exports = init




