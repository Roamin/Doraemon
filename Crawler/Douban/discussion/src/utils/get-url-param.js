function getUrlParam (url, param) {
    const result = url.match(`${param}\\/(\\w+)`)

    if (result) return result[1]

    return null
}

module.exports = getUrlParam