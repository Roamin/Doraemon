
const api = require('./api')
const sleep = require('./utils/sleep')
const parseChat = require('./utils/parse-chat')

function saveChat (html) {
    parseChat(html)
}

async function run (start = 0) {
    const [err, { more, html }] = await api.loadMoreChat({
        start,
        target_id: 85506874
    })

    if (err) {
        return console.error(err)
    }

    saveChat(html)

    console.log(start, more)

    if (!more) {
        return console.log('done.')
    }

    await sleep(3000)

    run(start + 20)
}

run(7540)