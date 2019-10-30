onmessage = function ( e ) {
    const data = e.data

    console.log( 'start', data )

    start( data )
}

const THREAD_NUM = 3
const result = {}
let pendingNum = THREAD_NUM

function storeResult ( event ) {
    const { i, data } = event.data

    pendingNum--
    result[i] = data

    if ( pendingNum <= 0 )
        postMessage( result )
}

function start ( data = [] ) {

    for ( let i = 0; i < THREAD_NUM; i += 1 ) {
        const worker = new Worker( 'core.js' )

        worker.postMessage( {
            i,
            data: data.slice( i * 3, ( i + 1 ) * 3 )
        } )

        worker.onmessage = storeResult
    }
}