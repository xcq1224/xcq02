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
            <el-form-item label="经办人：">
                <el-select v-model="formQuery.follow_type" clearable>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="chart" id="chart">
            
        </div>
        <div class="table-box">
            <p>计划付款金额：￥200000&nbsp;&nbsp;&nbsp;&nbsp;已付款金额：￥20000&nbsp;&nbsp;&nbsp;&nbsp;未付款金额：￥20000&nbsp;&nbsp;&nbsp;&nbsp;已收票金额：￥2000</p>
            <el-table class="table" :data="tableData" max-height="500" border :header-cell-style="{'padding': '10px 0'}">
                <el-table-column prop="report_type" label="时间"></el-table-column>
                <el-table-column prop="summary" label="计划付款金额"></el-table-column>
                <el-table-column prop="" label="已付款金额"></el-table-column>
                <el-table-column prop="" label="未付款金额"></el-table-column>
                <el-table-column prop="" label="已收票金额"></el-table-column>
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
                const colors = ['#6699ff', '#99f', '#fc0', '#f69'];
                const list1 = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                const data1 = [40, 49, 23, 45, 23, 86, 23, 56, 23, 86, 23, 56]
                const data2 = [40, 49, 23, 45, 23, 86, 23, 56, 23, 86, 23, 56]
                const data3 = [40, 49, 23, 45, 23, 86, 23, 56, 23, 86, 23, 56]
                const data4 = [40, 49, 23, 45, 23, 86, 23, 56, 23, 86, 23, 56]
                const option = {
                    title : {
                        text: '',
                        subtext: ''
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['计划付款金额','已付款金额','未付款金额','已收票金额']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    color: colors,
                    lineStyle: {
                        type: 'dotted',
                        width: 2
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : list1
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name: '单位：万元(以月份显示数据)'
                        }
                    ],
                    series : [
                        {
                            name:'计划付款金额',
                            type:'bar',
                            data:data1,
                            barWidth: 10,
                        },
                        {
                            name:'已付款金额',
                            type:'bar',
                            data:data2,
                            barWidth: 10,
                        },
                        {
                            name:'未付款金额',
                            type:'bar',
                            data:data3,
                            barWidth: 10,
                        },
                        {
                            name:'已收票金额',
                            type:'bar',
                            data:data4,
                            barWidth: 10,
                        },
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

