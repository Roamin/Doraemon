onmessage = function ( e ) {
    const data = e.data

    start( data )
}

function start ( { index, combinationData } ) {
    run( index, combinationData )
}

function run ( index, combinationData ) {
    const result = combination( combinationData.arr, combinationData.num )

    postMessage( {
        index,
        data: result
    } )
    close()
}

function factorial ( n ) {
    let result = 1

    while ( n > 1 ) {
        result *= n
        n--
    }
    return result
}

function combination ( arr, num ) {
    const results = []

    arr.forEach( ( item, index ) => {
        let nextArr = arr.slice( index + 1 )

        while ( nextArr.length >= num - 1 ) {
            arrangement( nextArr, num - 1 ).forEach( ( result => {
                results.push( [
                    item,
                    ...result
                ].join( ',' ) )
            } ) )

            nextArr.shift()
        }
    } )

    return results
}

function arrangement ( arr, n, result = [] ) {
    if ( n > 1 ) {
        result.push( arr[0] )
        n--

        return arrangement( arr.slice( 1 ), n, result )
    }

    return arr.map( item => {
        return [...result, item]
    } )
}