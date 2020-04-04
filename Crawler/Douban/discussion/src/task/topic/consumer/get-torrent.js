const get = require('simple-get')

function getTorrent (torrentUrl, options = {}) {
	const defaultOptions = {
		timeout: 30 * 1000,
		headers: {
			'Connection': 'keep-alive',
			'Cache-Control': 'max-age=0',
			'Upgrade-Insecure-Requests': '1',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko)',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding': 'gzip, deflate, sdch',
			'Accept-Language': 'zh-CN,zh;q=0.8',
		}
	}

	return new Promise((resolve) => {
		get.concat({
			url: torrentUrl,
			...Object.assign(defaultOptions, options)
		}, (err, res, torrentBuf) => {
			if (err) {
				return resolve([new Error(`Attachment download failed: ${err.message}`)])
			}

			resolve([null, torrentBuf])
		})
	})
}

module.exports = getTorrent

