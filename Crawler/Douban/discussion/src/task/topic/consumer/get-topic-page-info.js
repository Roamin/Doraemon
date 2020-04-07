const request = require('request')
const cheerio = require('cheerio')
const { request: config } = require('../../../config')
const getUrlParam = require('../../../utils/get-url-param')

function getTopicPageInfo (url) {
    return new Promise(resolve => {
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
                const $richtext = $('.topic-richtext')
                const $user = $('#topic-content .user-face a')

                const user = {
                    id: getUrlParam($user.attr('href'), 'people'),
                    name: $('.from a').text().trim(),
                    avatar: $user.find('img').attr('src')
                }


                const id = getUrlParam(url, 'topic')
                const author = user.id
                const info = JSON.parse($('script[type^="application"]').html().replace(/\s/g, ''))

                const title = info.name
                const text = $richtext.text().trim()
                const content = $richtext.html().trim()
                const commentCount = info.commentCount
                const likeCount = info.interactionStatistic.userInteractionCount
                const collectCount = $('.action-collect .react-num').text().trim() || 0
                const created = $('.topic-doc .color-green').text().trim()

                const topic = {
                    id,
                    author,
                    title,
                    text,
                    content,
                    commentCount,
                    likeCount,
                    collectCount,
                    created
                }

                resolve([null, {
                    user,
                    topic
                }])
            } else {
                resolve([new Error(body)])
            }
        })
    })
}

module.exports = getTopicPageInfo