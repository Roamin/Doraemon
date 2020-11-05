const fetch = require('../../utils/fetch')

function getUserGender (url, proxy) {
	return new Promise(async resolve => {
		const [fetchErr, $] = await fetch(url, proxy)

		if (fetchErr) {
			if (fetchErr.message.includes('STATUS_CODE: 404'))
				return resolve([null, {
					status: 0
				}])
			else
				return resolve([new Error(`${url}: ${fetchErr.message}`)])
		}

		try {
			const $gender = $('.gender')
			let gender = 'UNKNOWN'

			if ($gender.hasClass('m')) {
				gender = 'MALE'
			} else if ($gender.hasClass('f')) {
				gender = 'FEMALE'
			}

			resolve([null, {
				gender
			}])
		} catch (err) {
			return resolve([new Error(`${url}: ${err.message}`)])
		}
	})
}

module.exports = getUserGender