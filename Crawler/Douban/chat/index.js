
const api = require('./api')
const models = require('./models')
const sleep = require('./utils/sleep')
const parseChat = require('./utils/parse-chat')

function saveChat (html) {
    return new Promise((resolve) => {
        const messages = parseChat(html)

        models.Message.bulkCreate(messages).then(() => {
            resolve([null])
        }).catch(error => {
            resolve([error])
        })
    })
}

async function run (start = 0) {
    const [err, { more, html }] = await api.loadMoreChat({
        start,
        target_id: 85506874
    })

    if (err) {
        return console.error(err)
    }

    const [insertErr] = await saveChat(html)

    if (insertErr) {
        return console.error(insertErr)
    }

    console.log(start, more)

    if (!more) {
        return console.log('done.')
    }

    await sleep(5000)

    run(start + 20)
}

run()