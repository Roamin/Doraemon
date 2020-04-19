const loop = require('./index')
const sleep = require('../../utils/sleep')

async function init (limits = 5) {
    for (let i = 0; i < limits; i++) {
        loop()
        await sleep(Math.random() * 5000)
    }
}

module.exports = init




