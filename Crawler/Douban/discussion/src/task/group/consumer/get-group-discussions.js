const fetch = require('../../../utils/fetch')

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
	return new Promise(async resolve => {
		const [fetchErr, $] = await fetch(url)

		if (fetchErr) {
			return resolve([fetchErr])
		}

		try {
			const $discussions = $('.olt .title a')
			const $next = $('.paginator .next a')
			const discussions = []
			let next = false

			console.log($.html().slice(0, 1000))
			console.log($discussions.length)

			if ($discussions.length === 0) {
				resolve([new Error('getGroupDiscussions parse error')])
			}

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
		} catch (parseErr) {
			console.log(parseErr)
			return resolve([parseErr])
		}
	})
}

module.exports = getGroupDiscussions