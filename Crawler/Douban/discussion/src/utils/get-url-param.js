function getUrlParam (url, param) {
    const result = url.match(`${param}\\/(\\d+)`)

    if (result) return result[1]

    return null
}

module.exports = getUrlParam