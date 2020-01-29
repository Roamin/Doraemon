const fs = require('fs')
const createTorrent = require('create-torrent')
const parseTorrent = require('parse-torrent')

function renameTorrent (originFilePath, filePath) {
    const torrent = parseTorrent(fs.readFileSync(originFilePath))

    if (torrent && torrent.infoHash) {
        torrent.info.files = torrent.info.files.map((file, index) => {
            file.path[file.path.length - 1] = Buffer.from(file.path[file.path.length - 1].toString().replace(/^(.+)(\.\w+)$/, 'A' + index + '$2'))
            console.log(file.path.toString())
            return file
        })

        fs.writeFileSync(`${filePath}`, parseTorrent.toTorrentFile(torrent))
    }

}
function saveFile (path = './', filename = 'converted.torrent', opts) {
    createTorrent(path, opts, (err, torrent) => {
        if (!err) {
            // `torrent` is a Buffer with the contents of the new .torrent file
            fs.writeFile(filename, torrent)
        } else {
            console.error(err)
        }
    })
}

module.exports = renameTorrent
