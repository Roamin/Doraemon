import combination from './utils/combination'
import combinationDataList from './utils/data'

document.getElementById( 'start' ).addEventListener( 'click', () => {
    const results = {}
    const startTime = performance.now()

    combinationDataList.forEach( ( combinationData, index ) => {
        results[index] = combination( combinationData.arr, combinationData.num )
    } )

    const endTime = performance.now()

    console.log( 'cost: ', endTime - startTime, ', results:', results )
}, false )

document.getElementById( 'startWorker' ).addEventListener( 'click', () => {
    const worker = new Worker( 'worker.js' )

    worker.onmessage = function ( e ) {
        const data = e.data

        worker.terminate()
    }

    worker.postMessage( combinationDataList )
}, false )