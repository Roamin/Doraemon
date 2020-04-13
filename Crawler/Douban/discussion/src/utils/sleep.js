function sleep (ms = 6000) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

module.exports = sleep