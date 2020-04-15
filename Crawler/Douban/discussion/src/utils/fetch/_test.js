const fetch = require('./index')

async function test () {
    const [err, $] = await fetch('https://www.douban.com/group/')

    if (err) console.log(err)
    else console.log($('#footer').text())
}

test()