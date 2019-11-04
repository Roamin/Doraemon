function makeDP () {
    const w = [0, 2, 3, 4, 5]
    const v = [0, 3, 4, 5, 6]
    const bagV = 8
    const dp = [[]]

    for ( let i = 0; i < w.length; i++ ) {
        dp.push( [] )
    }

    w.forEach( ( wi, i ) => {
        for ( let j = 0; j <= bagV; j++ ) {
            if ( i === 0 || j === 0 ) {
                dp[i][j] = 0
            } else if ( j < wi ) {
                dp[i][j] = dp[i - 1][j]
            } else {
                dp[i][j] = Math.max( dp[i - 1][j], dp[i - 1][j - wi] + v[i] )
            }
        }
    } )

    dp.forEach( item => {
        console.log( item.join( '\t' ) )
    } )
}

makeDP()