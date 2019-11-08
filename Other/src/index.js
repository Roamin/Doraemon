import Calculate from './Calculate'

// 样品列表
const sample_list = [
    { name: 'a', weight: 0.0456, price: 12.99 },
    { name: 'b', weight: 0.1548, price: 13.99 },
    { name: 'c', weight: 0.16, price: 14.55 },
    { name: 'd', weight: 0.1884, price: 17.99 },
    { name: 'e', weight: 0.0776, price: 12 },
    { name: 'f', weight: 0.12, price: 18.6 },
    { name: 'g', weight: 0.1, price: 29.9 },
    { name: 'h', weight: 0.05, price: 129.9 },
    { name: 'i', weight: 0.176, price: 99 },
    { name: 'j', weight: 0.02, price: 49.9 },
    { name: 'k', weight: 0.01, price: 50 }
]

const max = 199 * 0.3;
const min = 199 * 0.2;

const cal = new Calculate( Math.ceil( max ), Math.floor( min ), sample_list )

cal.getResultByDynamicPlan()
cal.findAllMaxWeightAndPlan()
cal.getPlanDetailByCoordinate()
document.getElementById( 'result' ).innerHTML = cal.print()

console.log( JSON.stringify( cal.max_weight_coordinate, null, 4 ) )
console.log( JSON.stringify( cal.max_weight_plan, null, 4 ) )

const priceTable = getDOM( document.querySelector( '.table-wrapper.price' ) )
const sampleTable = getDOM( document.querySelector( '.table-wrapper.sample' ) )
const dpTable = getDOM( document.querySelector( '.table-wrapper.dp' ) )

function getDOM ( dom ) {
    const { offsetWidth, offsetHeight, scrollWidth, scrollHeight } = dom

    return {
        dom,
        offsetHeight,
        scrollHeight,
        availableScrollWidth: scrollWidth - offsetWidth,
        availableScrollHeight: scrollHeight - offsetHeight
    }
}

// 元素对象的onscroll事件,当元素内容发生滚动时触发,它是一个频繁触发的事件
dpTable.dom.onscroll = function () {
    const vPercent = 1 - ( dpTable.availableScrollHeight - dpTable.dom.scrollTop ) / dpTable.availableScrollHeight
    const hPercent = 1 - ( dpTable.availableScrollWidth - dpTable.dom.scrollLeft ) / dpTable.availableScrollWidth

    sampleTable.dom.scrollTop = sampleTable.availableScrollHeight * vPercent
    priceTable.dom.scrollLeft = priceTable.availableScrollWidth * hPercent
}


