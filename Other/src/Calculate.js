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
        this.sample_origin_list.forEach( ( { name, price, weight, stock } ) => {
            const max_limit = Math.min( stock, this.MAX_SINGLE_SAMPLE_NUM )
            let repeat_num = Math.floor( this.product_price_max / price )

            repeat_num = repeat_num <= max_limit
                ? repeat_num
                : max_limit

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
     * 动态规划获取解
     */
    getResultByDynamicPlan () {
        this.weight_result = this.sample_list.map( () => {
            const result = []

            for ( let p = 0; p <= this.product_price_max; p++ ) {
                result.push( 0 )
            }

            return result
        } )

        this.sample_list.forEach( ( { name, price, weight }, index ) => {
            for ( let p = 0; p <= this.product_price_max; p++ ) {
                if ( p === 0 || index === 0 ) {
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

                this.max_weight = weight > this.max_weight ? weight : this.max_weight
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
            const [sample_index, price_index] = item

            const detail = [[]]

            this.findOneCoordinatePlanDetail( 0, sample_index, price_index, detail )

            if ( detail[0].length > 0 ) this.max_weight_plan = this.max_weight_plan.concat( detail )
        } )

        this.max_weight_plan = Array.from( new Set( this.max_weight_plan.map( item => item.join( ',' ) ) ) ).map( item => item.split( ',' ) )
    }

    /**
     * 获取一个方案坐标对应的详细方案
     * @param current_route //当前方案编号（有多套方案时）
     * @param x //样品编号
     * @param y //价格编号
     * @param detail //方案详情
     */
    findOneCoordinatePlanDetail ( current_route, x, y, detail ) {
        // 0 行，0 列不考虑
        if ( x > 0 && y > 0 ) {
            const sampleX = this.sample_list[x]
            const currentWeight = this.weight_result[x][y]
            const isNode = y >= sampleX.price && currentWeight === this.weight_result[x - 1][y - sampleX.price] + sampleX.weight

            // 如果当前行等于上一行，则判断是否是并列级别
            // 否则，就是 节点，保险一点，再加了节点判断
            if ( currentWeight === this.weight_result[x - 1][y] ) {
                if ( isNode ) {
                    const next_router_index = detail.length

                    // 拷贝当前，新建一个路径
                    detail[next_router_index] = [...detail[current_route]]
                    detail[next_router_index].push( x )
                    this.findOneCoordinatePlanDetail( next_router_index, x - 1, y - sampleX.price, detail )
                }
                this.findOneCoordinatePlanDetail( current_route, x - 1, y, detail )
            } else if ( isNode ) {
                detail[current_route].push( x )
                this.findOneCoordinatePlanDetail( current_route, x - 1, y - sampleX.price, detail )
            }
        }
    }

    /**
     * 方案转化成具体样品数据
     */
    convertPlanToOriginSample () {
        this.max_weight_sample_plan = []

        const plan_key_map = {}

        console.log( JSON.stringify( this.max_weight_plan ) )

        this.max_weight_plan.forEach( plan_detail => {
            const plan = {}

            let price_total = 0

            plan_detail.forEach( sample_index => {
                const sample = this.sample_list[sample_index]

                if ( typeof plan[sample.name] === 'undefined' ) {
                    plan[sample.name] = {
                        count: 1,
                        sample
                    }
                } else {
                    plan[sample.name].count++
                }

                price_total += sample.price
            } )

            if ( price_total >= this.product_price_min ) {
                const keys = Object.keys( plan ).map( key => {
                    return `${key}_${plan[key].count}`
                } )

                if ( typeof plan_key_map[keys] === 'undefined' ) {
                    plan_key_map[keys] = true
                    this.max_weight_sample_plan.push( plan )
                }
            }
        } )
    }

    run () {
        this.getResultByDynamicPlan()
        this.findAllMaxWeightAndPlan()
        this.getPlanDetailByCoordinate()
        this.convertPlanToOriginSample()
    }
}
