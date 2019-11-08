export default class Calculate {
    constructor( product_price_max, product_price_min, sample_origin_list, MAX_SINGLE_SAMPLE_NUM = 10 ) {
        this.product_price_max = product_price_max
        this.product_price_min = product_price_min
        this.sample_origin_list = sample_origin_list

        this.MAX_SINGLE_SAMPLE_NUM = MAX_SINGLE_SAMPLE_NUM

        this.sample_origin_mapping = {}
        this.sample_list = []

        this.convertSampleList()
    }

    /**
     * 获取最大权重
     */
    getMaxWeight () {
        return this.max_weight
    }

    /**
     * 获取最大权重对应方案
     */
    getMaxWeightPlan () {
        return this.max_weight_plan
    }

    /**
     * 获取动态规划权重结果
     */
    getWeightResult () {
        return this.weight_result
    }

    /**
     * 转化成新的样品数据（重复的完全背包转化成01背包）
     */
    convertSampleList () {
        this.sample_origin_list.forEach( ( { name, price, weight } ) => {
            let repeat_num = Math.floor( this.product_price_max / price )

            repeat_num = repeat_num <= this.MAX_SINGLE_SAMPLE_NUM
                ? repeat_num
                : this.MAX_SINGLE_SAMPLE_NUM

            for ( let i = 0; i < repeat_num; i++ ) {
                this.sample_list.push( {
                    name,
                    weight,
                    price: Math.round( price )
                } )
            }

            this.sample_origin_mapping[name] = {
                name,
                weight,
                price: Math.round( price )
            }
        } )

        this.sample_list.unshift( [0] )
    }

    /**
     * 方案转化成具体样品数据
     */
    convertPlanToOriginSample () {
        this.max_weight_sample_plan = []
        unique_keys = [];

        this.max_weight_plan.forEach( plan_detail => {
            sample_detail = []
            price_total = 0

            plan_detail.forEach( sample_index => {
                sample_name = this.sample_origin_mapping[sample_index]
                sample_detail[sample_name] = sample_detail.includes( sample_name ) ? sample_detail[sample_name] + 1 : 1
                price_total += this.sample_origin_list[sample_name]
            } )

            if ( price_total < this.product_price_min ) return // 方案价格小于最低折扣价，直接干掉

            unique_key = ''

            this.sample_origin_list.foreach( ( { name } ) => {
                if ( array_key_exists( name, sample_detail ) ) {
                    unique_key += name + '-' + sample_detail[name] + ','
                }
            } )

            if ( unique_keys.includes( unique_key ) ) return  // 如果方案重复，直接干掉

            unique_keys.push( unique_key )
            this.max_weight_sample_plan.push( sample_detail )
        } )
    }

    /**
     * 动态规划获取解
     */
    getResultByDynamicPlan () {
        this.weight_result = this.sample_list.map( () => {
            const result = []

            for ( let p = 0; p <= this.product_price_max; p++ ) {
                result.push( 0 )
            }

            return result
        } );

        console.log( this.sample_list.length, this.weight_result.length, this.weight_result[0].length )

        this.sample_list.forEach( ( { name, price, weight }, index ) => {
            for ( let p = 0; p <= this.product_price_max; p++ ) {
                if ( p == 0 || index == 0 ) {
                    this.weight_result[index][p] = 0
                    continue
                }

                if ( price > p ) {
                    this.weight_result[index][p] = this.weight_result[index - 1][p]
                    continue
                }

                const include_current_weight = ( this.weight_result[index - 1][p - price] + weight ).toFixed( 6 )
                const not_include_current_weight = this.weight_result[index - 1][p]

                this.weight_result[index][p] = Math.max( include_current_weight, not_include_current_weight )
            }
        } )

        return this.weight_result
    }

    print () {
        let sampleTable = `
        <table class="sample-table">
        `

        this.weight_result.forEach( ( result, index ) => {
            const sample = this.sample_list[index]

            sampleTable += `
            <tr>
                <th>
                    <div>${index}(${sample.name || ''} : ${sample.price || ''})</div>
                </th>
            </tr>
            `
        } )
        sampleTable += `
        </table>
        `

        let priceTable = `
        <table class="price-table">
            <tr>
                <th>
                    <div>x/y</div>
                </th>
        `

        for ( let i = 0; i <= this.product_price_max; i++ ) {
            priceTable += `<th><div>${i}</div></th>`
        }

        priceTable += `
            </tr>
        </table>
        `
        let dpTable = `
        <table class="dp-table">
        `

        this.weight_result.forEach( ( result, index ) => {
            dpTable += `<tr>`

            result.forEach( item => {
                dpTable += `
                <td>
                    <div>${item}</div>
                </td>
                `
            } )

            dpTable += `</tr>`
        } )

        dpTable += `
        </table>
        `

        return `
        <div class="layout">
            <div class="layout__header">
                <div class="table-wrapper price">
                    ${priceTable}
                </div>
            </div>
            <div class="layout__content">
                <div class="layout__aside">
                    <div class="table-wrapper sample">
                        ${sampleTable}
                    </div>
                </div>
                <div class="table-wrapper dp">
                    ${dpTable}
                </div>
            </div>
        </div>
        `
    }

    /**
    * 获取最优解权重和方案坐标
    */
    findAllMaxWeightAndPlan () {
        const weight_coordinate_map = {}

        this.max_weight = 0

        this.weight_result.forEach( ( row, x ) => {
            row.forEach( ( weight, y ) => {
                if ( typeof weight_coordinate_map[weight] === 'undefined' ) {
                    weight_coordinate_map[weight] = []
                }

                weight_coordinate_map[weight].push( [x, y] )

                this.max_weight = weight > this.max_weight ? weight : this.max_weight;
            } )
        } )

        this.max_weight_coordinate = weight_coordinate_map[this.max_weight]
    }

    /**
     * 根据坐标查询对应方案详细情况
     */
    getPlanDetailByCoordinate () {
        this.max_weight_plan = []

        this.max_weight_coordinate.forEach( item => {
            let [sample_index, price_index] = item

            let detail = [[]]

            this.findOneCoordinatePlanDetail( 0, sample_index, price_index, detail )

            this.max_weight_plan = detail
        } )
    }

    /**
     * 获取一个方案坐标对应的详细方案
     * @param current_route //当前方案编号（有多套方案时）
     * @param x //样品编号
     * @param y //价格编号
     * @param detail //方案详情
     */
    findOneCoordinatePlanDetail ( current_route, x, y, detail ) {
        if ( x > 0 && y > 0 ) {
            if ( this.weight_result[x][y] === this.weight_result[x - 1][y] ) {
                if ( y >= this.sample_list[x] && this.weight_result[x][y] == this.weight_result[x - 1][y - this.sample_list[x]] + this.sample_weight_list[x] ) {
                    next_router_index = count( detail )
                    detail[next_router_index] = detail[current_route]
                    detail[next_router_index].push( x )
                    this.findOneCoordinatePlanDetail( next_router_index, x - 1, y - this.sample_list[x], detail )
                }
                this.findOneCoordinatePlanDetail( current_route, x - 1, y, detail )
            } else if ( y >= this.sample_list[x] && this.weight_result[x][y] == this.weight_result[x - 1][y - this.sample_list[x]] + this.sample_weight_list[x] ) {
                detail[current_route].push( x )
                this.findOneCoordinatePlanDetail( current_route, x - 1, y - this.sample_list[x], detail )
            }
        }
    }
}