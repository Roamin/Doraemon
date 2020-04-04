const Crawler = require('crawler')
const { crawler: crawlerConfig } = require('../../../config')
const getFullUrl = require('../../../utils/get-full-url')

function getAttachmentDownloadUrl (uri) {
	return new Promise((resolve) => {
		const crawler = new Crawler()

		crawler.queue({
			uri,
			timeout: crawlerConfig.timeout,
			retries: crawlerConfig.retries,
			retryTimeout: crawlerConfig.retryTimeout,
			callback (error, res, done) {
				if (error) {
					resolve([error])
				} else {
					const $ = res.$
					const $download = $('[href*="mod=attachment"]')
					const href = $download.attr('href')
					const url = getFullUrl(href, uri)

					resolve([null, url])
				}

				done()
			}
		})
	})
}


module.exports = getAttachmentDownloadUrl