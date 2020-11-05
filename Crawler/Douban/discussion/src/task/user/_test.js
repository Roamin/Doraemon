const getUserGender = require('./get-user-gender')

async function test () {
    // const id = 'zy820657961' // 已注销
    const id = '133966516' // 已注销
    const url = `https://m.douban.com/people/${id}/`

    const [err, res] = await getUserGender(url)

    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
}

test()