class CalculatePackageProductSamples {
    /**
     * @param int product_price_max
     * @param int product_price_min
     * @param array sample_origin_list ['a':12.99,'b':13.99]
     * @param array sample_origin_weight_list ['a':0.01, 'b':0.15]
     */
    constructor( product_price_max, product_price_min, sample_origin_list, sample_origin_weight_list ) {
        // product_price_max = 0; // 最大价格
        // product_price_min = 0; // 最小价格
        // sample_origin_list; // 原始样品价格数据
        // sample_origin_weight_list; // 原始样品对应权重数据
        // sample_list; // 转换后样品价格数据
        // sample_weight_list; // 转换后样品对应权重数据
        // sample_origin_mapping; // 转换后样品与原始数据映射
        // weight_result = []; // 动态规划权重结果
        // max_weight;  // 最优权重
        // max_weight_coordinate; // 最优权重坐标
        // max_weight_plan; // 最优权重详细方案
        // max_weight_sample_plan; // 最优权重详细方案转化成样品方案

        // MAX_SINGLE_SAMPLE_NUM = 10;

        this.product_price_max = product_price_max;
        this.product_price_min = product_price_min;
        this.sample_origin_list = sample_origin_list;
        this.sample_origin_weight_list = sample_origin_weight_list;

        this.convertSampleList(); // 首先转换成01背包数据
        this.getResultByDynamicPlan(); // 动态规划得到全部解
        this.findAllMaxWeightAndPlan(); // 根据全部解获取最优解的权重值和坐标
        this.getPlanDetailByCoordinate(); // 根据坐标查询对应方案详情
        this.convertPlanToOriginSample(); // 方案转化成具体样品数据
    }

    /**
     * 获取最大权重
     * @return mixed
     */
    getMaxWeight () {
        return this.max_weight;
    }

    /**
     * 获取最大权重对应方案
     * @return mixed
     */
    getMaxWeightPlan () {
        return this.max_weight_sample_plan;
    }

    /**
     * 获取动态规划权重结果
     * @return mixed
     */
    getWeightResult () {
        return this.weight_result;
    }

    /**
     * 转化成新的样品数据（重复的完全背包转化成01背包）
     */
    convertSampleList () {
        this.sample_origin_mapping = [0];
        this.sample_list = [0];
        this.sample_weight_list = [0];
        this.sample_origin_list.forEach( ( { price } ) => {
            repeat_num = floor( this.product_price_max / price );
            repeat_num = repeat_num <= MAX_SINGLE_SAMPLE_NUM ? repeat_num : MAX_SINGLE_SAMPLE_NUM;

            for ( i = 0; i < repeat_num; i++ ) {
                this.sample_list[] = round( price );
                this.sample_weight_list[] = this.sample_origin_weight_list[sample_name];
                this.sample_origin_mapping[] = sample_name;
            }
        } )
    }

    /**
     * 方案转化成具体样品数据
     */
    convertPlanToOriginSample () {
        this.max_weight_sample_plan = [];
        unique_keys = [];
        foreach( this.max_weight_plan as plan_detail ) {
            sample_detail = [];
            price_total = 0;
            foreach( plan_detail as sample_index ) {
                sample_name = this.sample_origin_mapping[sample_index];
                sample_detail[sample_name] = isset( sample_detail[sample_name] ) ? sample_detail[sample_name] + 1 : 1;
                price_total += this.sample_origin_list[sample_name];
            }
            if ( price_total < this.product_price_min ) continue; // 方案价格小于最低折扣价，直接干掉
            unique_key = '';
            foreach( this.sample_origin_list as sample_name => sample_price ) {
                if ( array_key_exists( sample_name, sample_detail ) ) {
                    unique_key.= sample_name. '-'.sample_detail[sample_name].',';
                }
            }
            if ( in_array( unique_key, unique_keys ) ) continue;  // 如果方案重复，直接干掉
            unique_keys[] = unique_key;
            this.max_weight_sample_plan[] = sample_detail;
        }
    }

    /**
     * 动态规划获取解
     */
    getResultByDynamicPlan () {
        this.weight_result = [];
        foreach( this.sample_list as x_index => v ) {
            for ( c = 0; c <= this.product_price_max; c++ ) {
                if ( c == 0 || x_index == 0 ) {
                    this.weight_result[x_index][c] = 0;
                    continue;
                }
                w = this.sample_weight_list[x_index];
                if ( v > c ) {
                    this.weight_result[x_index][c] = this.weight_result[x_index - 1][c];
                    continue;
                }
                include_current_weight = this.weight_result[x_index - 1][c - v] + w;
                not_include_current_weight = this.weight_result[x_index - 1][c];
                this.weight_result[x_index][c] = max( include_current_weight, not_include_current_weight );
            }
        }
    }

    /**
     * 获取最优解权重和方案坐标
     */
    findAllMaxWeightAndPlan () {
        this.max_weight = 0;
        weight_coordinate = [];
        foreach( this.weight_result as kx => vx ) {
            foreach( vx as ky => vy ) {
                key = strval( vy );
                if ( !isset( weight_coordinate[key] ) ) weight_coordinate[key] = [];
                weight_coordinate[key][] = [kx, ky];
                this.max_weight = vy > this.max_weight ? vy : this.max_weight;
            }
        }
        this.max_weight_coordinate = weight_coordinate[strval( this.max_weight )];
    }

    /**
     * 根据坐标查询对应方案详细情况
     */
    getPlanDetailByCoordinate () {
        this.max_weight_plan = [];
        foreach( this.max_weight_coordinate as item ) {
            //            echo implode(',', $item), '<br>';
            //            if ($item[0] != 6 or $item[1] != 20 ) continue;
            sample_index = item[0];
            price_index = item[1];
            detail = [0 => []];
            this.findOneCoordinatePlanDetail( 0, sample_index, price_index, detail );
            //            print_r(detail);
            this.max_weight_plan = array_merge( this.max_weight_plan, detail );
        }
    }

    /**
     * 获取一个方案坐标对应的详细方案
     * @param current_route //当前方案编号（有多套方案时）
     * @param x //样品编号
     * @param y //价格编号
     * @param detail //方案详情
     */
    findOneCoordinatePlanDetail ( current_route, x, y, &detail ) {
        if ( x > 0 and y > 0) {
            if ( this.weight_result[x][y] == this.weight_result[x - 1][y] ) {
                if ( y >= this.sample_list[x] && this.weight_result[x][y] == this.weight_result[x - 1][y - this.sample_list[x]] + this.sample_weight_list[x] ) {
                    next_router_index = count( detail );
                    detail[next_router_index] = detail[current_route];
                    detail[next_router_index][] = x;
                    this.findOneCoordinatePlanDetail( next_router_index, x - 1, y - this.sample_list[x], detail );
                }
                this.findOneCoordinatePlanDetail( current_route, x - 1, y, detail );
            } elseif( y >= this.sample_list[x] && this.weight_result[x][y] == this.weight_result[x - 1][y - this.sample_list[x]] + this.sample_weight_list[x] ) {
                detail[current_route][] = x;
                this.findOneCoordinatePlanDetail( current_route, x - 1, y - this.sample_list[x], detail );
            }
        }
    }


}

// 样品列表
sample_list = [{ name: 'a', price: 12.99 }, { name: 'b', price: 13.99 }, { name: 'c', price: 14.55 }, { name: 'd', price: 17.99 }, { name: 'e', price: 12 }, { name: 'f', price: 18.6 }, { name: 'g', price: 29.9 }, { name: 'h', price: 129.9 }, { name: 'i', price: 99 }, { name: 'j', price: 49.9 }, { name: 'k', price: 50 }];

// 样品权重
weight_list = [{ name: 'a', weight: 0.0456 }, { name: 'b', weight: 0.1548 }, { name: 'c', weight: 0.16 }, { name: 'd', weight: 0.1884 }, { name: 'e', weight: 0.0776 }, { name: 'f', weight: 0.12 }, { name: 'g', weight: 0.1 }, { name: 'h', weight: 0.05 }, { name: 'i', weight: 0.176 }, { name: 'j', weight: 0.02 }, { name: 'k', weight: 0.01 }];

dpClass = new CalculatePackageProductSamples();
max = 199 * 0.3; //
min = 199 * 0.2;
dpClass.run( ceil( max ), floor( min ), sample_list, weight_list );
result = dpClass.getWeightResult();

// 得到最优方案
print_r( dpClass.getMaxWeightPlan() );

// 动态规划图表
console.log( "<table border='1'><tr><th>x/y</th>" );
for ( let i = 0; i <= Math.ceil( max ); i++ ) {
    console.log( `<th>${i}</th>` );
}
console.log( "</tr>" );
result.forEach( ( { vx } ) => {
    console.log( `<tr><th>${kx}(${dpClass.sample_origin_mapping[kx]}:${dpClass.sample_list[kx]})</th>` );
    vx.forEach( ( { vy } ) => {
        console.log( `<td>${vy}</td>` );
    } )
    console.log( `</tr>` );
} )
console.log( `</table>` );