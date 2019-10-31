const combinationDataList = []

const arr = []

for ( let i = 1; i <= 200; i++ ) {
    arr.push( i )
}

for ( let i = 2; i <= 20; i++ ) {
    combinationDataList.push( {
        arr,
        num: i
    } )
}

export default combinationDataList