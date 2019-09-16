const fs = require( 'fs' )
const request = require( 'request' )
const cheerio = require( 'cheerio' )
const qs = require( 'querystring' )

const config = require( '../config' )
const sleep = require( '../utils/sleep' )

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
            console.error( 'getUploadAuthTokenErr error', albumId )

            return resolve( [getUploadAuthTokenErr, null] )
        }

        await sleep( 10000 )

        request.post( {
            url: 'https://www.douban.com/j/photos/addphoto_draft',
            headers: Object.assign( {}, config.headers, {
                'Content-Type': `multipart/form-data`
            } ),
            formData: {
                ck: config.ck, // 不知道
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
                resolve( [null, JSON.parse( body ).id] )
            } else {
                resolve( [new Error( body ), null] )
            }
        } )
    } )
}

function autoSave ( albumId, filesPath ) {
    return new Promise( async resolve => {
        const formData = {
            ck: config.ck,
            albumid: albumId
        }
        const draftPromises = filesPath.map( filePath =>
            addPhotoDraft( albumId, filePath )
        )

        const results = await Promise.all( draftPromises )

        results.forEach( result => {
            const [err, photoId] = result

            if ( !err ) {
                formData[`tags_${photoId}`] = ''
                formData[`desc_${photoId}`] = ''
            }
        } )

        await sleep( 10000 )

        request( {
            url: `https://www.douban.com/j/photos/autosave`,
            method: 'POST',
            headers: config.headers,
            body: qs.stringify( formData )
        }, ( error, response, body ) => {
            if ( error ) {
                return resolve( [error, null] )
            }

            if ( response.statusCode === 200 ) {
                if ( JSON.parse( body ).r === 0 ) {
                    resolve( [null, formData] )
                } else {
                    resolve( [new Error( body ), null] )
                }
            } else {
                resolve( [new Error( body ), null] )
            }
        } )
    } )
}

function uploadPhotosToAlbum ( albumId, filesPath ) {
    return new Promise( async resolve => {
        const [err, formData] = await autoSave( albumId, filesPath )

        if ( err ) {
            console.error( 'autoSave error', albumId )
            return resolve( [err, null] )
        }

        await sleep( 10000 )

        request( {
            url: `https://www.douban.com/photos/album/${albumId}/upload`,
            method: 'POST',
            headers: config.headers,
            body: qs.stringify( formData )
        }, ( error, response, body ) => {
            if ( error ) {
                return resolve( [error, null] )
            }

            if ( response.statusCode === 302 ) {
                const location = response.caseless.get( 'location' )

                if ( /\/photos\/album\/(\d+)/.test( location ) ) {
                    resolve( [null, body] )
                } else {
                    resolve( [new Error( body ), null] )
                }
            } else {
                resolve( [new Error( body ), null] )
            }
        } )
    } )
}

// const files = [
//     '../../../VISVIM/dist/WMV - Lookbook SS19/9_wmv2019ss_img018.jpg',
//     '../../../VISVIM/dist/WMV - Lookbook SS19/8_wmv2019ss_img019.jpg',
//     '../../../VISVIM/dist/WMV - Lookbook SS19/7_wmv2019ss_img066.jpg'
// ]

// uploadPhotosToAlbum( 1693027701, files )

module.exports = uploadPhotosToAlbum