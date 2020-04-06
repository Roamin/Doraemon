const request = require('request')
const cheerio = require('cheerio')
const { request: config } = require('../../../config')
const getUrlParam = require('../../../utils/get-url-param')

function getCommentsFromPage (url, resolve, comments = [], to) {
    request({
        url,
        method: 'GET',
        headers: config.headers()
    }, (error, response, body) => {
        if (error) {
            return resolve([error])
        }

        if (response.statusCode === 200) {
            const $ = cheerio.load(body)
            const $comments = $('.comment-item')
            const $next = $('.next a')

            const topicId = getUrlParam(url, 'topic')
            const next = $next.length > 0 ? $next.attr('href') : false

            to = to ? to : getUrlParam($('.from a').attr('href'), 'people')


            $comments.each(function () {
                const $this = $(this)
                const $to = $this.find('.reply-quote .reply-quote-content')

                const id = $this.attr('id')
                const author = $this.attr('data-author-id')
                const content = $this.find('.reply-content').text().trim()
                const created = $this.find('.pubtime').text().trim()

                comments.push({
                    id,
                    topicId,
                    author,
                    to: $to.length > 0 ? $to.attr('data-author-id') : to,
                    content,
                    created
                })
            })

            if (next) return getCommentsFromPage(next, resolve, comments, to)

            resolve([null, comments])
        } else {
            resolve([new Error(body)])
        }
    })
}

function getTopicComments (url) {
    return new Promise(resolve => {
        getCommentsFromPage(url, resolve)
    })
}

module.exports = getTopicComments