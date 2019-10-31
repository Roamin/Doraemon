onmessage = function ( e ) {
    const data = e.data

    start( data )
}

const results = {}
let pendingNum = 0
let startTime = 0
let endTime = 0

function storeResults ( event ) {
    const { index, data } = event.data

    pendingNum--
    results[index] = data

    if ( pendingNum <= 0 ) {
        endTime = performance.now()
        console.log( 'cost: ', endTime - startTime, ', results length:', results )
        postMessage( results )
    }
}

function start ( combinationDataList ) {
    startTime = performance.now()

    pendingNum = combinationDataList.length
    combinationDataList.forEach( ( combinationData, index ) => {
        const worker = new Worker( 'core.js' )


        worker.postMessage( {
            index,
            combinationData
        } )

        worker.onmessage = storeResults
    } )
}