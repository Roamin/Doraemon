import combination from './utils/combination'

const worker = new Worker( 'worker.js' )

worker.onmessage = function ( e ) {
    const data = e.data

    end( data )
}

function start () {
    worker.postMessage( {
        discounts: [0.5, 0.6],
        products: [
            { id: 'A', name: 'A', price: 10 },
            { id: 'B', name: 'B', price: 20 },
            { id: 'C', name: 'C', price: 30 },
            { id: 'D', name: 'D', price: 20 },
            { id: 'E', name: 'E', price: 40 },
            { id: 'F', name: 'F', price: 10 },
            { id: 'G', name: 'G', price: 10 },
            { id: 'H', name: 'H', price: 20 },
            { id: 'I', name: 'I', price: 10 },
            { id: 'J', name: 'J', price: 20 },
            { id: 'K', name: 'K', price: 30 },
            { id: 'L', name: 'L', price: 25 },
            { id: 'M', name: 'M', price: 15 },
            { id: 'N', name: 'N', price: 35 },
            { id: 'O', name: 'O', price: 40 },
            { id: 'P', name: 'p', price: 20 },
            { id: 'Q', name: 'Q', price: 5 },
            { id: 'R', name: 'R', price: 25 },
            { id: 'S', name: 'S', price: 10 },
            { id: 'T', name: 'T', price: 20 },
            { id: 'U', name: 'U', price: 10 },
            { id: 'V', name: 'V', price: 25 },
            { id: 'W', name: 'W', price: 15 },
            { id: 'X', name: 'X', price: 20 },
            { id: 'Y', name: 'Y', price: 20 },
            { id: 'Z', name: 'Z', price: 20 }
        ],
        gifts: [
            { id: 'a', name: 'a', price: 5 },
            { id: 'b', name: 'b', price: 6 },
            { id: 'c', name: 'c', price: 3 },
            { id: 'd', name: 'd', price: 2 },
            { id: 'e', name: 'e', price: 4 },
            { id: 'f', name: 'f', price: 1 },
            { id: 'g', name: 'g', price: 10 },
            { id: 'h', name: 'h', price: 12 },
            { id: 'i', name: 'i', price: 6 },
            { id: 'j', name: 'j', price: 8 },
            { id: 'k', name: 'k', price: 12 },
            { id: 'l', name: 'l', price: 15 },
            { id: 'm', name: 'm', price: 20 },
            { id: 'n', name: 'n', price: 10 },
            { id: 'o', name: 'o', price: 5 },
            { id: 'p', name: 'p', price: 9 },
            { id: 'q', name: 'q', price: 7 },
            { id: 'r', name: 'r', price: 3 },
            { id: 's', name: 's', price: 10 },
            { id: 't', name: 't', price: 13 },
            { id: 'u', name: 'u', price: 10 },
            { id: 'v', name: 'v', price: 11 },
            { id: 'w', name: 'w', price: 14 },
            { id: 'x', name: 'x', price: 16 },
            { id: 'y', name: 'y', price: 18 },
            { id: 'z', name: 'z', price: 19 }
        ]
    } )
}

function end ( data ) {
    console.log( data )

    document.getElementById( 'result' ).textContent = JSON.stringify( data, null, 4 )
}

function getGiftPriceByDiscount ( discount, productPrice ) {
    return productPrice / discount - productPrice
}

function compute ( { discounts, products, gifts } ) {
    const [minDiscount, maxDiscount] = discounts

    products = products.map( product => {
        return {
            ...product,
            minDiscountPrice: getGiftPriceByDiscount( minDiscount, product.price ),
            maxDiscountPrice: getGiftPriceByDiscount( maxDiscount, product.price )
        }
    } )

    gifts = gifts.sort( ( from, to ) => from.price - to.price )

}

document.getElementById( 'start' ).addEventListener( 'click', () => {
    // start()
    combination( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 3 )
}, false )