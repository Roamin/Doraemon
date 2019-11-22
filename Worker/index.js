import combination from './utils/combination'
import combinationDataList from './utils/data'

document.getElementById('startJS').addEventListener('click', () => {
    const results = {}
    const startTime = performance.now()

    combinationDataList.forEach((combinationData, index) => {
        results[index] = combination(combinationData.arr, combinationData.num)
    })

    const endTime = performance.now()

    console.log('cost: ', endTime - startTime, ', results:', results)
}, false)

document.getElementById('startWorker').addEventListener('click', () => {
    const worker = new Worker('worker.js')

    worker.onmessage = function (e) {
        const data = e.data

        worker.terminate()
    }

    worker.postMessage(combinationDataList)
}, false)

document.getElementById('ajax').addEventListener('click', () => {
    const worker = new Worker('ajax.worker.js')

    worker.onmessage = function (e) {
        const data = e.data

        console.log('main received: ', data)

        document.getElementById('ajaxResult').innerText = data

        worker.terminate()
    }

    worker.postMessage({ a: 123 })
}, false)