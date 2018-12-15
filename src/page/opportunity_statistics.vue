<template>
    <div class="wrap">
        <el-form class="query-form" label-position="left" size="small" :model="formQuery" label-width='90px'>
            <el-form-item label="时间：">
                <el-date-picker 
                    v-model="formQuery.recent_follow_time"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="所属部门：">
                <el-select v-model="formQuery.follow_type" clearable>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="拥有者：">
                <el-input size="small" v-model="formQuery.phone" clearable placeholder=""></el-input>
            </el-form-item>
        </el-form>
        <div class="chart" id="chart">
            
        </div>
        <div class="table-box">
            <p>机会数量：20个&nbsp;&nbsp;&nbsp;&nbsp;赢单机会数量：20个&nbsp;&nbsp;&nbsp;&nbsp;赢单机会金额：20个</p>
            <el-table class="table" :data="tableData" max-height="500" border :header-cell-style="{'padding': '10px 0'}">
                <el-table-column prop="report_type" label="时间"></el-table-column>
                <el-table-column prop="summary" label="机会数量"></el-table-column>
                <el-table-column prop="" label="赢单机会数量"></el-table-column>
                <el-table-column prop="" label="赢单机会金额"></el-table-column>
                <el-table-column prop="" label="合同数"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions, mapMutations } from 'vuex'
    import echarts from 'echarts/lib/echarts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/toolbox'
    import 'echarts/lib/component/markPoint'
    import 'echarts/lib/component/tooltip'
    export default {
        data() {
            return {
                formQuery: {},
                tableData: [],
            }
        },
        mounted(){
            this.myChart = echarts.init(document.getElementById('chart'));
            this.initData();
        },
        methods: {
            initData(){
                const colors = ['#6699ff', '#99f', '#fc0', '#f69', '#f00'];
                const list1 = ['01-01','01-01','01-01','01-01','01-03','01-01','01-01','01-01','01-01','01-02',
                                '01-01','01-01','01-01','01-01','01-01','01-01','01-01','01-01','01-01','01-03',
                                '01-01','01-01','01-01','01-01','01-01','01-01','01-01','01-01','01-01','01-01']
                const data1 = [40, 49, 23, 45, 23, 86, 23, 56, 49, 23, 45, 23, 86, 23, 56, 49, 23,23, 45, 23, 86, 23, 56, 49, 23, 45, 23, 86, 23, 56]
                const data2 = [40, 49, 23, 45, 23, 86, 23, 56]
                const data3 = [40, 49, 23, 45, 23, 86, 23, 56]
                const data4 = [40, 49, 23, 45, 23, 86, 23, 56]
                const option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    color: ['#cc33cc', '#9ff', '#008000'],
                    legend: {
                        data:['机会数量','赢单机会数量','赢单机会金额']
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name : '赢单数',
                        },
                        {
                            type : 'value',
                            name : '金额(￥)',
                        }
                    ],
                    series : [

                        {
                            name:'机会数量',
                            type:'line',
                            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                        },
                        {
                            name:'赢单机会数量',
                            type:'line',
                            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                        },
                        {
                            name:'赢单机会金额',
                            type:'bar',
                            yAxisIndex: 1,
                            barWidth: 40,
                            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                        }
                    ]        
                };
                this.myChart.setOption(option);
            }
        }
    }
</script>
<style lang="less" scoped>
    .query-form{
        background: #fff;
        padding: 20px 20px 10px;
        margin-bottom: 20px;
        .el-input, .el-select, .el-date-editor{
            width: 250px;
        }
    }
    .chart{
        background: #fff;
        height: 520px;
        padding-top: 30px;
        padding-left: 20px;
    }
    .table-box{
        padding: 10px 20px 20px;
        background: #fff;
        margin: 30px 0 50px;
        >p{
            margin-bottom: 10px;
            font-size: 14px;
        }
    }
</style>

