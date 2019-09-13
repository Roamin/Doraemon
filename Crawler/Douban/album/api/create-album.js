const qs = require( 'querystring' )
const request = require( 'request' )

const config = require( '../config' )

/**
 * 创建相册
 * @param {Object} formData 
 */

const DEFAULT_FORM_DATA = {
    ck: 'dxcD', // 不知道是啥
    album_name: '', // 相册名称
    album_intro: '', // 相册描述
    author_tags: '', // 相册 tag，逗号分割 'tag1,tag2'
    author_tags_clone: '', // 不知道
    order: 'False', // 显示顺序, True: 按上传时间顺序排列, False: 按上传时间倒序排列
    privacy: 'P', // 浏览权限: P：所有人可见； F：仅朋友可见 X：仅自己可见
    // reply_limit: 'on', // 不允许回复
    // need_watermark: 'on', // 开启照片水印
    // is_original: 'on' // 原创内容
}

function createAlbum ( formData ) {
    const formDataStr = qs.stringify( Object.assign( DEFAULT_FORM_DATA, formData ) )

    return new Promise( resolve => {
        request( {
            url: 'https://www.douban.com/photos/album/upload', // 请求路径
            method: 'POST',
            headers: config.headers,
            body: formDataStr
        }, function ( error, response, body ) {
            if ( error ) {
                return resolve( [error, null] )
            }

            const location = response.caseless.get( 'location' )

            if ( /\/photos\/album\/\d+/.test( location ) ) {
                const albumId = location.match( /\/photos\/album\/(\d+)/ )[1]

                resolve( [null, albumId] )
            } else {
                resolve( [new Error( body ), null] )
            }
        } )
    } )
}

module.exports = createAlbum