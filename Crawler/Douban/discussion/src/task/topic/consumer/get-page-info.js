const Crawler = require('crawler')
const cheerio = require('cheerio')
const { crawler: crawlerConfig } = require('../../../config')
const getFullUrl = require('../../../utils/get-full-url')

/**
 * 尝试拼凑下载标签
 * 因为有些附件下载地址是页面加载后 JS 生成的，比如：http://www.xxizhan.com/thread-1806-1-1.html
 * @param {Cheerio} $ 
 */
function makeAttachmentElement ($) {
	const $aList = $('#postlist a')
	let $a = null

	$aList.each(function () {
		const $this = $(this)
		const $script = $this.find('script')

		if ($script.length > 0) {
			const result = $script.text().match(/href\=('|")([^"']+)('|")/)


			if (result) {
				const href = result[2]
				const text = $this.html().match(/(.*)<script/)[1]

				$a = cheerio.load(`<a href="${href}">${text}</a>`)('a')

				return false
			}
		}
	})

	return $a
}

/**
 * 校验附件名称
 * @param {String} attachmentName
 */
function validateAttachmentName (attachmentName) {
	if (/(\.torrent)$/i.test(attachmentName)) return true

	// 干掉网页连接
	if (/^http/i.test(attachmentName)) return false

	const extension = attachmentName.match(/.(\w+)$/)

	// 无后缀还是可以试试
	if (!extension) return true

	// 干掉 zip exe 等等
	return !['exe', 'zip', 'rar'].includes(extension[1].toLowerCase())
}

function getPageInfo (uri) {
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
					const $pageTitle = $('#thread_subject')
					let $download = $('a[href*="download"]')

					if ($download.length === 0) {
						$download = makeAttachmentElement($)
					}

					if ($pageTitle.length === 0) {
						resolve([new Error('Page title missing')])
					} else if (!$download || $download.length === 0) {
						resolve([new Error('Attachment missing')])
					} else {
						const attachmentHref = $download.attr('href')
						const attachmentName = $download.text()

						if (!validateAttachmentName(attachmentName)) {
							resolve([new Error(`Invalid attachment extension: ${attachmentName}`)])
						} else {
							const attachmentUrl = getFullUrl(attachmentHref, uri)
							const pageTitle = $pageTitle.text()

							resolve([null, {
								pageTitle,
								attachmentUrl
							}])
						}
					}
				}

				done()
			}
		})
	})
}


module.exports = getPageInfo