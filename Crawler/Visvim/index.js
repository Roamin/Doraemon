const path = require( 'path' )
const Crawler = require( 'crawler' )

const Queue = require( './utils/queue' )
const wget = require( './utils/wget' )

const ORIGIN = 'https://visvim.tv'
const DIST = path.join( __dirname, 'dist' )
const queue = new Queue()

queue.load( [], 5, ( lookbookPhoto, next ) => {
    const { archive, url } = lookbookPhoto
    const filename = path.basename( url )
    const distPath = path.join( DIST, filename )

    console.log( distPath )

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

const pageCrawler = new Crawler( {
    timeout: 15 * 1000,
    retries: 3,
    retryTimeout: 10 * 1000,
    callback ( error, res, done ) {
        if ( error ) {
            console.error( error )
        } else {
            const $ = res.$
            const $currentLookbook = $( '.lookbook-top-cover-item a' )
            const $archives = $( '.archives-item-title a' )
            const detailList = []

            $currentLookbook.each( function () {
                const $this = $( this )

                detailList.push( `${ORIGIN}${$this.attr( 'href' )}` )
            } )
            $archives.each( function () {
                const $this = $( this )

                detailList.push( `${ORIGIN}${$this.attr( 'href' )}` )
            } )

            console.log( detailList )

            loadDetail( detailList, () => {
                done()
            } )
            done()
        }
    }
} )

const detailCrawler = new Crawler( {
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
            const lookbookPhotoList = []

            console.log( $images.length )

            $images.each( function () {
                const $this = $( this )

                lookbookPhotoList.push( {
                    archive: title,
                    url: `${ORIGIN}${$this.attr( 'src' )}`
                } )
            } )

            if ( queue.length === 0 ) {
                console.log( lookbookPhotoList )
                queue.reload( lookbookPhotoList )
            } else {
                queue.push( lookbookPhotoList )
            }

            done()
        }
    }
} )

detailCrawler.on( 'schedule', function ( options ) {
    console.log( '\tstart ', options.uri )
} )

function loadPage () {
    const url = `https://visvim.tv/lookbook/`

    pageCrawler.queue( url )
}

function loadDetail ( detailList, cb ) {
    detailCrawler.queue( detailList )

    detailCrawler.once( 'drain', cb )
}

loadPage()

// detailCrawler.queue( 'https://visvim.tv/lookbook/fw19-20/wmv/' )

// 监听全局错误
process.on( 'unhandledRejection', ( error ) => {
    console.error( error.stack )
} )

process.on( 'uncaughtException', console.error )