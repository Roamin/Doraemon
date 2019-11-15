import Calculate from './Calculate'
import printDP from './printDP'

// 样品列表
const sample_list = [
    { name: 'a', price: 12.99, stock: 999, weight: 0.0456, },
    { name: 'b', price: 13.99, stock: 999, weight: 0.1548, },
    { name: 'c', price: 14.55, stock: 999, weight: 0.16, },
    { name: 'd', price: 17.99, stock: 999, weight: 0.1884, },
    { name: 'e', price: 12, stock: 999, weight: 0.0776, },
    { name: 'f', price: 18.6, stock: 999, weight: 0.12, },
    { name: 'g', price: 29.9, stock: 999, weight: 0.1, },
    { name: 'h', price: 129.9, stock: 999, weight: 0.05, },
    { name: 'i', price: 99, stock: 999, weight: 0.176, },
    { name: 'j', price: 49.9, stock: 999, weight: 0.02, },
    { name: 'k', price: 50, stock: 999, weight: 0.01 }
]
// const sample_list = [
//     { name: 'a', price: 10, weight: 1, stock: 30 },
//     { name: 'b', price: 30, weight: 3, stock: 30 },
//     { name: 'c', price: 20, weight: 2, stock: 30 },
//     { name: 'd', price: 60, weight: 6, stock: 30 }
// ]

const min = 199 * 0.2
const max = 199 * 0.8

const cal = new Calculate( Math.ceil( max ), Math.floor( min ), sample_list )

cal.run()

console.log( JSON.stringify( cal, null, 4 ) )

printDP( document.getElementById( 'result' ), cal )

// console.log( JSON.stringify( cal.max_weight_coordinate, null, 4 ) )
// console.log( JSON.stringify( cal.max_weight_plan.map( item => item.join( ',' ) ), null, 4 ) )
// console.log( JSON.stringify( cal.max_weight_sample_plan, null, 4 ) )
console.log( JSON.stringify( cal.max_weight_sample_plan.map( plan => {
    return Object.keys( plan ).map( key => `${key}: ${plan[key].count}` )
} ), null, 4 ) )
