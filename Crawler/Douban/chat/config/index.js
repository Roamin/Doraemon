const cookie = `_vwo_uuid_v2=D501BC7E26730B66FB639779991FD2F3B|886dc89cb70a0f040e2ebb600602cb4e; _ga=GA1.2.1576566587.1519202742; douban-fav-remind=1; douban-profile-remind=1; __utmv=30149280.13561; ll="118172"; bid=KydjpW8bOag; push_noty_num=0; ct=y; push_doumail_num=0; __utmz=30149280.1581764752.92.9.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1581847083%2C%22https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DF3SPZAuKFKUIpprY52WpahVDXIFrEfQIcyFUUBJptxSSjDtVJOE_TaXTLiGtsGxh-HFMXAhSpSZRUjP6zweNUa%26wd%3D%26eqid%3Dfadc8d5100026d7c000000065e47d087%22%5D; _pk_ses.100001.8cb4=*; __utma=30149280.1576566587.1519202742.1581764752.1581847085.93; __utmc=30149280; __utmt=1; dbcl2="135617155:hyBsBxhQOfA"; ck=KC5S; ap_v=0,6.0; _pk_id.100001.8cb4=0f45bee21a8d5bea.1519202737.47.1581847131.1581764752.; __utmb=30149280.7.10.1581847085`

module.exports = {
    ck: cookie.match(/ck=(\w+)/)[1],
    headers: {
        'Cookie': cookie,
        'Content-Type': `application/x-www-form-urlencoded`,
        'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36`
    }
}