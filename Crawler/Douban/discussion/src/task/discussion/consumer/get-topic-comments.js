const fetch = require('../../../utils/fetch')
const getUrlParam = require('../../../utils/get-url-param')

async function getCommentsFromPage (resolve, url, comments = [], users = [], to) {
    const [fetchErr, $] = await fetch(url)

    if (fetchErr) {
        return resolve([fetchErr])
    }

    try {
        const $comments = $('#comments .comment-item')
        const $next = $('.next a')

        const topicId = getUrlParam(url, 'topic')
        const next = $next.length > 0 ? $next.attr('href') : false

        to = to ? to : getUrlParam($('#topic-content .user-face a').attr('href'), 'people')

        $comments.each(function () {
            const $this = $(this)
            const $to = $this.find('.reply-quote .reply-quote-content .pubdate a')
            const $user = $this.find('.user-face img')

            const id = $this.attr('id')
            const author = $this.attr('data-author-id')
            const content = $this.find('.reply-content').text().trim()
            const createdAt = $this.find('.pubtime').text().trim()

            const comment = {
                id,
                topicId,
                author,
                to,
                content,
                createdAt
            }

            if ($to.length > 0) {
                const toUser = {
                    id: getUrlParam($to.attr('href'), 'people'),
                    name: $to.text().trim()
                }

                comment.to = toUser.id
                users.push(toUser)
            }

            users.push({
                id: author,
                name: $user.attr('alt').trim(),
                avatar: $user.attr('src')
            })

            comments.push(comment)
        })

        if (next) {
            return getCommentsFromPage(resolve, next, comments, users, to)
        }

        resolve([null, {
            comments,
            users
        }])
    } catch (parseErr) {
        resolve([parseErr])
    }
}

function getTopicComments (url) {
    return new Promise(resolve => {
        getCommentsFromPage(resolve, url)
    })
}

module.exports = getTopicComments