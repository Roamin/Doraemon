const request = require('request')
const cheerio = require('cheerio')
const { request: config } = require('../../../config')

function getGroupDiscussions (url) {
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
				const $discussions = $('.olt .title a')
				const $next = $('.paginator .next a')
				const discussions = []
				let next = false

				$discussions.each(function () {
					const $this = $(this)
					const href = $this.attr('href')

					discussions.push({
						title: $this.text().trim(),
						url: href
					})
				})

				if ($next.length > 0) {
					next = $next.attr('href')
				}

				resolve([null, {
					next,
					discussions
				}])
			} else {
				resolve([new Error(body)])
			}
		})
	})
}

module.exports = getGroupDiscussions