const { service } = require('../../db')
const fetch = require('../../utils/fetch')
const getUrlParam = require('../../utils/get-url-param')

async function getMembers (resolve, url, memberCount = 0) {
	const [fetchErr, $] = await fetch(url)

	if (fetchErr) {
		return getMembers(resolve, url, memberCount)
	}

	try {
		const $members = $('.member-list').last().find('li')
		const $next = $('.paginator .next a')
		const members = []

		$members.each(function () {
			const $this = $(this)
			const $user = $this.find('.name a')

			const id = getUrlParam($user.attr('href'), 'people')
			const name = $user.text().trim()
			const avatar = $this.find('img').attr('src')

			members.push({
				id,
				name,
				avatar
			})
		})

		const [createError] = await service.User.bulkCreate(members, { updateOnDuplicate: ['avatar'] })

		if (createError) {
			return resolve([createError])
		}

		memberCount += members.length

		console.log(url, `insert ${members.length}, total ${memberCount}`)

		if ($next.length > 0) {
			const next = $next.attr('href')

			return getMembers(resolve, next, memberCount)
		}

		resolve([null, memberCount])
	} catch (err) {
		return resolve([new Error(`${url}: ${err.message}`)])
	}
}

function getGroupMembers (url) {
	return new Promise(resolve => {
		getMembers(resolve, url)
	})
}

module.exports = getGroupMembers