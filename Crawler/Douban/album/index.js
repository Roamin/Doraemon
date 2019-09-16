const path = require( 'path' )

const api = require( './api' )
const sleep = require( './utils/sleep' )
const scanDir = require( './utils/scan-dir' )

const PHOTOS_PATH = path.join( __dirname, '../../Visvim/dist' )

async function uploadLook ( lookbookDirs = [] ) {
    if ( lookbookDirs.length === 0 ) {
        console.log( 'done' )

        return
    } else {
        console.log( 'Remains: ', lookbookDirs.length )
    }

    const lookbookDir = lookbookDirs.pop()

    const { name: lookbookName, path: lookbookPath } = lookbookDir
    const lookbookPhotos = scanDir( lookbookPath ).map( ( { path } ) => path )

    const [createAlbumErr, albumId] = await api.createAlbum( {
        album_name: lookbookName,
        album_intro: lookbookName,
        author_tags: `visvim,VISVIM,${lookbookName.split( ' ' ).pop()}`,
    } )

    if ( createAlbumErr ) {
        console.error( 'createAlbumErr' )
        return createAlbumErr
    }

    await sleep( 3000 )

    const [uploadPhotosToAlbumErr, uploadRes] = await api.uploadPhotosToAlbum( albumId, lookbookPhotos )

    if ( uploadPhotosToAlbumErr ) {
        console.error( 'uploadPhotosToAlbumErr' )

        return uploadPhotosToAlbumErr
    }

    console.log( 'success', uploadRes )

    await sleep( 3000 )

    uploadLook( lookbookDirs )
}

function start () {
    const lookbookList = scanDir( PHOTOS_PATH )

    uploadLook( lookbookList )
}

start()