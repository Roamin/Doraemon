const fs = require( 'fs' )
const request = require( 'request' )
const cheerio = require( 'cheerio' )
const qs = require( 'querystring' )

const config = require( '../config' )

/**
 * 获取 UPLOAD_AUTH_TOKEN
 * @param {Number} albumId 
 */
function getUploadAuthToken ( albumId ) {
    return new Promise( resolve => {
        request( {
            url: `https://www.douban.com/photos/album/${albumId}/upload`, // 请求路径
            headers: config.headers
        }, function ( error, response, body ) {
            if ( error ) {
                return resolve( [error, null] )
            }

            const $ = cheerio.load( body )

            $( 'script' ).each( function ( i, el ) {
                const match = $( el ).html().match( /UPLOAD_AUTH_TOKEN: "(.+)"/ )

                if ( match ) {
                    resolve( [null, match[1]] )

                    return false
                }
            } )

            resolve( [new Error( 'Get Upload Auth Token Failed' ), null] )
        } )
    } )
}

function addPhotoDraft ( albumId, filePath ) {
    return new Promise( async resolve => {
        const [getUploadAuthTokenErr, uploadAuthToken] = await getUploadAuthToken( albumId )

        if ( getUploadAuthTokenErr ) {
            return resolve[getUploadAuthTokenErr, null]
        }

        request.post( {
            url: 'https://www.douban.com/j/photos/addphoto_draft',
            headers: Object.assign( config.headers, {
                'Content-Type': `multipart/form-data`
            } ),
            formData: {
                ck: 'dxcD', // 不知道
                category: 'photo', // 类别
                file: fs.createReadStream( filePath ),
                albumid: albumId,
                upload_auth_token: uploadAuthToken
            }
        }, ( error, response, body ) => {
            if ( error ) {
                return resolve( [error, null] )
            }

            if ( response.statusCode === 200 ) {
                console.log( body )
                resolve[null, JSON.parse( body ).id]
            } else {
                resolve[new Error( body ), null]
            }
        } )
    } )
}

function uploadPhotoToAlbum ( albumId, filesPath ) {
    return new Promise( async resolve => {
        const formData = {
            ck: 'dxcD'
        }
        const photoIdList = []

        filesPath.forEach( async filePath => {
            const [draftErr, photoId] = await addPhotoDraft( albumId, filePath )

            if ( draftErr ) {
                return resolve[draftErr, null]
            }

            photoIdList.push( photoId )
        } )

        photoIdList.forEach( photoId => {
            formData[`tags_${photoId}`] = ''
            formData[`desc_${photoId}`] = ''
        } )

        request( {
            url: `https://www.douban.com/photos/album/${albumId}/upload`,
            headers: config.headers,
            body: qs.stringify( formData )
        }, ( error, response, body ) => {
            if ( error ) {
                console.log( error )
                return resolve( [error, null] )
            }

            fs.writeFileSync( './response.html', body )

            const location = response.caseless.get( 'location' )

            console.log( location )
            if ( /\/photos\/album\/\d+/.test( location ) ) {
                console.log( 'success' )
                resolve( [null, albumId] )
            } else {
                resolve( [new Error( body ), null] )
            }
        } )
    } )
}

const files = [
    '../../../VISVIM/dist/WMV - Lookbook SS19/9_wmv2019ss_img018.jpg',
    '../../../VISVIM/dist/WMV - Lookbook SS19/8_wmv2019ss_img019.jpg',
    '../../../VISVIM/dist/WMV - Lookbook SS19/7_wmv2019ss_img066.jpg'
]

uploadPhotoToAlbum( 1692996781, files )

module.exports = uploadPhotoToAlbum