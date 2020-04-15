const fetch = require('../../../utils/fetch')
const getUrlParam = require('../../../utils/get-url-param')

function getTopicPageInfo (url) {
    return new Promise(async resolve => {
        const [fetchErr, $] = await fetch(url)

        if (fetchErr) {
            return resolve([fetchErr])
        }

        try {
            const $richtext = $('.topic-content')
            const $user = $('#topic-content .user-face a')

            if ($richtext.length === 0) {
                resolve([new Error('getTopicPageInfo parse error')])
            }

            const user = {
                id: getUrlParam($user.attr('href'), 'people'),
                name: $('.from a').text().trim(),
                avatar: $user.find('img').attr('src')
            }

            const id = getUrlParam(url, 'topic')
            const author = user.id
            const info = JSON.parse($('script[type^="application"]').html().replace(/\s/g, '').replace(/("text":"[^"]+",)/g, ''))

            const title = info.name
            const text = $richtext.text().trim()
            const content = $richtext.html().trim()
            const commentCount = info.commentCount
            const likeCount = info.interactionStatistic.userInteractionCount
            const collectCount = $('.action-collect .react-num').text().trim() || 0
            const createdAt = $('.topic-doc .color-green').text().trim()

            const topic = {
                id,
                author,
                title,
                text,
                content,
                commentCount,
                likeCount,
                collectCount,
                createdAt
            }

            resolve([null, {
                user,
                topic
            }])
        } catch (parseErr) {
            return resolve([parseErr])
        }
    })
}

module.exports = getTopicPageInfo