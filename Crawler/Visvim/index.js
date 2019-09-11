const path = require( 'path' )
const Crawler = require( 'crawler' )

const Queue = require( './utils/queue' )
const wget = require( './utils/wget' )

const ORIGIN = 'https://visvim.tv'
const DIST = path.join( __dirname, 'dist' )
const LATEST_ARCHIVES_ENTRY = 'https://visvim.tv/lookbook/'
const queue = new Queue()

queue.load( [], 5, ( lookbookPhoto, next ) => {
    const { archive, url } = lookbookPhoto
    const filename = path.basename( url )
    const distPath = path.join( DIST, archive, filename )

    wget( url, distPath ).then( () => {
        next()
    } ).catch( ( error ) => {
        queue.push( lookbookPhoto )
        log( error, queue.length, length, archive + ' ' + url )
        next()
    } )
} ).finish( () => {
    console.log( 'done' )
} )

const archivesCrawler = new Crawler( {
    timeout: 15 * 1000,
    retries: 3,
    retryTimeout: 10 * 1000,
    callback ( error, res, done ) {
        if ( error ) {
            console.error( error )
        } else {
            const $ = res.$
            const $archives = $( '.archives-item-title a' )
            const archiveList = [LATEST_ARCHIVES_ENTRY]

            $archives.each( function () {
                const $this = $( this )

                archiveList.push( `${ORIGIN}${$this.attr( 'href' )}` )
            } )

            console.log( '\n===>\tarchiveList: ', archiveList, '\n<===\n' )
            loadArchiveCrawler( archiveList )
            done()
        }
    }
} )

const archiveCrawler = new Crawler( {
    timeout: 15 * 1000,
    retries: 3,
    retryTimeout: 10 * 1000,
    callback ( error, res, done ) {
        if ( error ) {
            console.error( error )
        } else {
            const $ = res.$
            const $covers = $( '.lookbook-top-cover-item a' )
            const lookbookList = []

            $covers.each( function () {
                const $this = $( this )

                lookbookList.push( `${ORIGIN}${$this.attr( 'href' )}` )
            } )

            console.log( '\n===>\tlookbookList: ', lookbookList, '\n<===\n' )
            loadLookbookPhotoCrawler( lookbookList )
            done()
        }
    }
} )

const lookbookPhotoCrawler = new Crawler( {
    timeout: 15 * 1000,
    retries: 3,
    retryTimeout: 10 * 1000,
    callback ( error, res, done ) {
        if ( error ) {
            console.error( error )
        } else {
            const $ = res.$
            const $images = $( '.lookbook-detail-photo-img img' )
            const title = $( '.contents-title' ).text().trim()
            const photoList = []

            $images.each( function () {
                const $this = $( this )

                photoList.push( {
                    archive: title,
                    url: `${ORIGIN}${$this.attr( 'src' )}`
                } )
            } )

            console.log( '\n===>\tphotoList: ', photoList, '\n<===\n' )
            if ( queue.length === 0 ) {
                queue.reload( photoList )
            } else {
                queue.push( photoList )
            }

            done()
        }
    }
} )

function loadArchivesCrawler ( list ) {
    archivesCrawler.queue( list )
}

function loadArchiveCrawler ( list ) {
    archiveCrawler.queue( list )
}

function loadLookbookPhotoCrawler ( list ) {
    lookbookPhotoCrawler.queue( list )
}

loadArchivesCrawler( LATEST_ARCHIVES_ENTRY )

// 监听全局错误
process.on( 'unhandledRejection', ( error ) => {
    console.error( error.stack )
} )

process.on( 'uncaughtException', console.error )