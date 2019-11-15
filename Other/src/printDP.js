function printDynamicPlan ( selector, worker ) {
    let sampleTableHTML = `
          <table class="sample-table">
      `

    worker.weight_result.forEach( ( result, index ) => {
        const sample = worker.sample_list[index]

        sampleTableHTML += `
              <tr>
                  <th>
                      <div>${index}(${sample.name || ''} : ${sample.price || ''})</div>
                  </th>
              </tr>
          `
    } )
    sampleTableHTML += `
          </table>
      `

    let priceTableHTML = `
          <table class="price-table">
              <tr>
                  <th>
                      <div>x/y</div>
                  </th>
      `

    for ( let i = 0; i <= worker.product_price_max; i++ ) {
        priceTableHTML += `<th><div>${i}</div></th>`
    }

    priceTableHTML += `
              </tr>
          </table>
      `

    let dpTableHTML = `
          <table class="dp-table">
      `

    worker.weight_result.forEach( ( result, index ) => {
        dpTableHTML += `<tr>`

        result.forEach( item => {
            dpTableHTML += `
                  <td>
                      <div>${item}</div>
                  </td>
              `
        } )

        dpTableHTML += `</tr>`
    } )

    dpTableHTML += `
          </table>
      `

    selector.innerHTML = `
         <style>
            .layout {
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .layout table {
                text-align: left;
                border-collapse: separate;
                border-spacing: 0;
                border: 1px solid #e8e8e8;
                border-right: none;
                border-bottom: none;
                
            }
            .layout table tr:hover {
                background-color: orange;
            }
            .layout table tr > th,
            .layout table tr > td {
                padding: 16px 16px;
                overflow-wrap: break-word;
                white-space: nowrap;
                border-right: 1px solid #e8e8e8;
                border-bottom: 1px solid #e8e8e8;
            }
            .layout table tr > th > div,
            .layout table tr > td > div {
                width: 80px;
            }
            .layout table tr > th {
                font-weight: 500;
                color: rgba(0, 0, 0, 0.85);
            }
            .layout__header {
                overflow: hidden;
                flex-shrink: 0;
            }
            .layout__aside {
                overflow: hidden;
                flex-shrink: 0;
            }
            .layout__content {
                flex: auto;
                display: flex;
                overflow: hidden;
            }
    
            .table-wrapper {
                overflow: auto;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.6);
                backdrop-filter: saturate(120%) blur(6px);
            }
         </style>
          <div class="layout">
              <div class="layout__header">
                  <div class="table-wrapper price">
                      ${priceTableHTML}
                  </div>
              </div>
              <div class="layout__content">
                  <div class="layout__aside">
                      <div class="table-wrapper sample">
                          ${sampleTableHTML}
                      </div>
                  </div>
                  <div class="table-wrapper dp">
                      ${dpTableHTML}
                  </div>
              </div>
          </div>
      `

    const priceTable = getDOM( selector.querySelector( '.table-wrapper.price' ) )
    const sampleTable = getDOM( selector.querySelector( '.table-wrapper.sample' ) )
    const dpTable = getDOM( selector.querySelector( '.table-wrapper.dp' ) )

    dpTable.dom.onscroll = function () {
        const vPercent = 1 - ( dpTable.availableScrollHeight - dpTable.dom.scrollTop ) / dpTable.availableScrollHeight
        const hPercent = 1 - ( dpTable.availableScrollWidth - dpTable.dom.scrollLeft ) / dpTable.availableScrollWidth

        sampleTable.dom.scrollTop = sampleTable.availableScrollHeight * vPercent
        priceTable.dom.scrollLeft = priceTable.availableScrollWidth * hPercent
    }
}

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

export default printDynamicPlan