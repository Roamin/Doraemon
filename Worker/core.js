onmessage = function ( e ) {
    const data = e.data

    console.log( data )

    start( data )
}

function start ( { i, data } ) {
    run( i, data )
}

function run ( i, data = [] ) {
    postMessage( {
        i,
        data: data.map( i => i * 2 )
    } )
    close()
}