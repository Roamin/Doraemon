const cheerio = require('cheerio')

function parseChat (html) {
    const $ = cheerio.load(html)

    const date = $('.split-line i').text()
    const messages = []

    $('.chat').each(function (i, elem) {
        const $this = $(this)
        const $sender = $this.find('.sender a')
        const $content = $this.find('.sender').next()

        const id = $this.attr('data')
        const time = `${date} ${$this.find('.time').text()}`
        const user = $sender.text()
        const content = $content.html()

        console.log(i)

        console.log({
            id,
            time,
            user,
            content
        })
    })
}

module.exports = parseChat