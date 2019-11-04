function helper ( coins, amount, memory = {} ) {
    if ( amount === 0 ) return 0

    if ( typeof memory[amount] !== 'undefined' ) {
        console.log( 'old', amount, memory[amount] )

        return memory[amount]
    }

    let ans = Infinity

    for ( let coin in coins ) {
        if ( amount - coin < 0 ) continue

        // 金额不可达
        const subProb = helper( coins, amount - coin, memory )

        // 无解
        if ( subProb === -1 ) continue

        ans = Math.min( ans, subProb + 1 )
    }

    memory[amount] = ans === Infinity ? - 1 : ans

    console.log( 'new', amount )

    return memory[amount]
}

function coinChange ( coins, amount ) {
    return helper( coins, amount )
}

const start = Date.now()
const result = coinChange( { 1: 1, 2: 2, 5: 5 }, 100 )
const end = Date.now()
console.log( 'cost time:', end - start, ', result:', result )