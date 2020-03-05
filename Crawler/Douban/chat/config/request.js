const cookie = ``

module.exports = {
    ck: cookie.match(/ck=(\w+)/)[1],
    headers: {
        'Cookie': cookie,
        'Content-Type': `application/x-www-form-urlencoded`,
        'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36`
    }
}