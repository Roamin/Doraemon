const request = require('request')
const cheerio = require('cheerio')
const { request: config } = require('../../../config')

function getUpdatedAt (time) {
	// '04-07 21:30'
	// '2019-06-15'
	if (time.indexOf(':') !== -1) {
		const now = new Date()
		const year = now.getFullYear()
		const [mm_dd, hh_mm] = time.split(' ')

		return `${year}-${mm_dd} ${hh_mm}:00`
	}

	return `${time} 00:00:00`
}

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
					const time = $this.parent().parent().find('.time').text().trim()

					discussions.push({
						title: $this.text().trim(),
						url: href,
						updatedAt: getUpdatedAt(time)
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