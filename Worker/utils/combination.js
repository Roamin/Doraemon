export function factorial ( n ) {
    let result = 1

    while ( n > 1 ) {
        result *= n
        n--
    }
    return result
}

// C(6,3)
// ---
// [1, 2, 3, 4, 5, 6,]
// [1] [2, 3, 4, 5, 6,]
//     [2, 3, 4, 5, 6,] 
//     [2] [3, 4, 5, 6,]
//         [3, 4, 5, 6,]
//         [3]
//         [4]
//         [5]
//         [6]
// [2, 3, 4, 5, 6,]
// ...
export default function combination ( arr, num ) {
    console.log( JSON.stringify( arr ), 'should return ', factorial( arr.length ) / ( factorial( num ) * factorial( arr.length - num ) ) )
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

    console.log( 'results length:', results.length )
    console.log( JSON.stringify( results, null, 4 ) )
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