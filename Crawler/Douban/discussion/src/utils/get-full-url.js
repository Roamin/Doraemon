function getFullUrl (path, uri) {
    return new URL(path, uri).href
}

module.exports = getFullUrl