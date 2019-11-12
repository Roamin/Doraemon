import Calculate from './Calculate'

// 样品列表
// const sample_list = [
//     { name: 'a', price: 12.99, weight: 0.0456, },
//     { name: 'b', price: 13.99, weight: 0.1548, },
//     { name: 'c', price: 14.55, weight: 0.16, },
//     { name: 'd', price: 17.99, weight: 0.1884, },
//     { name: 'e', price: 12, weight: 0.0776, },
//     { name: 'f', price: 18.6, weight: 0.12, },
//     { name: 'g', price: 29.9, weight: 0.1, },
//     { name: 'h', price: 129.9, weight: 0.05, },
//     { name: 'i', price: 99, weight: 0.176, },
//     { name: 'j', price: 49.9, weight: 0.02, },
//     { name: 'k', price: 50, weight: 0.01 }
// ]
const sample_list = [
    { name: 'a', price: 10, weight: 1 },
    { name: 'b', price: 30, weight: 3 },
    { name: 'c', price: 20, weight: 2 },
    { name: 'd', price: 60, weight: 6 }
]

const max = 199 * 0.3;
const min = 199 * 0.2;

const cal = new Calculate( Math.ceil( max ), Math.floor( min ), sample_list )

cal.run()

cal.printDynamicPlan( document.getElementById( 'result' ) )

// console.log( JSON.stringify( cal.max_weight_coordinate, null, 4 ) )
// console.log( JSON.stringify( cal.max_weight_plan.map( item => item.join( ',' ) ), null, 4 ) )
console.log( JSON.stringify( cal.max_weight_sample_plan, null, 4 ) )
console.log( JSON.stringify( cal.max_weight_sample_plan.map( plan => {
    return Object.keys( plan ).map( key => `${key}: ${plan[key].count}` )
} ), null, 4 ) )


