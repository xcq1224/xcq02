<template>
    <div class="wrap">
        <el-form class="query-form" label-position="left" size="small" :model="formQuery" label-width='100px'>
            <el-form-item label="跟进时间：">
                <el-date-picker 
                    v-model="formQuery.recent_follow_time"
                    type="year"
                    value-format="yyyy">
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
            <p>线索数量：20个&nbsp;&nbsp;&nbsp;&nbsp;转化客户数量：20个</p>
            <el-table class="table" :data="tableData" max-height="500" border :header-cell-style="{'padding': '10px 0'}">
                <el-table-column prop="report_type" label="时间"></el-table-column>
                <el-table-column prop="summary" label="线索数量"></el-table-column>
                <el-table-column prop="" label="转化客户数量"></el-table-column>
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
                const colors = ['#86df79', '#ff9900'];
                const list1 = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                const data1 = [40, 49, 23, 45, 23, 86, 23, 56]
                const data2 = [40, 49, 23, 45, 23, 86, 23, 56]
                const option = {
                    title : {
                        text: '',
                        subtext: ''
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['线索数量','转化客户数量']
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
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'线索数量',
                            type:'bar',
                            data:data1,
                            barWidth: 20,
                        },
                        {
                            name:'转化客户数量',
                            type:'bar',
                            data:data2,
                            barWidth: 20,
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

