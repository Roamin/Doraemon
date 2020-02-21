const cookie = `ll="118172"; bid=TyOrjZwkAao; douban-fav-remind=1; douban-profile-remind=1; _vwo_uuid_v2=D518A4465F2604001A798B6198DD11F83|f53143d35cd81048768b65de71627fcf; gr_user_id=514a52eb-9b5b-4251-aac7-9280c7308895; viewed="1940654_4279822"; __utmc=30149280; push_doumail_num=0; __utmv=30149280.13561; ap_v=0,6.0; __utmz=30149280.1568433993.3.2.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _pk_ses.100001.8cb4=*; __utma=30149280.1536254981.1568426412.1568433993.1568437436.4; __utmt=1; dbcl2="135617155:7g7mCN37eAM"; ck=EkPi; _pk_id.100001.8cb4=f3a0ba64393f21a0.1568426412.3.1568439102.1568435186.; __utmb=30149280.55.10.1568437436; push_noty_num=1`

module.exports = {
    ck: cookie.match(/ck=(\w+)/)[1],
    headers: {
        'Cookie': cookie,
        'Content-Type': `application/x-www-form-urlencoded`,
        'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36`
    }
}