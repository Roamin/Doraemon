const getPageInfo = require('./get-page-info')
const getAttachmentDownloadUrl = require('./get-attachment-download-url')
const getTorrent = require('./get-torrent')
const convertTorrentToMagnet = require('./convert-torrent-to-magnet')

function getMagnetFromPage (url) {
    return new Promise(async (resolve) => {
        // 获取附件下载页面地址
        const [getPageInfoErr, res] = await getPageInfo(url)

        if (getPageInfoErr) return resolve([getPageInfoErr])

        const { pageTitle, attachmentUrl } = res

        // 获取附件下载地址
        const [getAttachmentDownloadUrlErr, torrentDownloadUrl] = await getAttachmentDownloadUrl(attachmentUrl)

        if (getAttachmentDownloadUrlErr) return resolve([getAttachmentDownloadUrlErr])

        // 获取附件内容
        const [getTorrentErr, torrentBuf] = await getTorrent(torrentDownloadUrl)

        if (getTorrentErr) return resolve([getTorrentErr])

        // 附件转换（torrent => magnet）
        // {
        //     infoHash,
        //     name,
        //     magnet,
        //     created,
        //     size
        // }
        const [convertTorrentToMagnetErr, magnet] = convertTorrentToMagnet(torrentBuf)

        if (convertTorrentToMagnetErr) return resolve([convertTorrentToMagnetErr])

        // {
        //     title,
        //     origin,
        //     infoHash,
        //     name,
        //     magnet,
        //     created,
        //     size
        // }
        resolve([null, {
            title: pageTitle,
            origin: url,
            ...magnet
        }])
    })
}

module.exports = getMagnetFromPage
