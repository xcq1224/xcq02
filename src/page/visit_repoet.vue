<template>
    <div class="wrap">
        <el-form class="query-form" label-position="left" size="small" :inline="true" :model="formQuery" label-width='100px'>
            <el-form-item label="签到时间：">
                <span>全部</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>本日</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style="margin-right: 120px;">本月</span>
            </el-form-item>
            <el-form-item label="自定义时间：">
                <el-date-picker 
                    v-model="formQuery.recent_follow_time"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <br>
            <el-form-item label="签到部门：">
                <el-select v-model="formQuery.follow_type" clearable>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="签到员工：">
                <el-select v-model="formQuery.follow_type" clearable>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="chart" id="chart">
            
        </div>
        <div class="table-box">
            <p>签到次数：10次</p>
            <el-table class="table" :data="tableData" max-height="500" border :header-cell-style="{'padding': '10px 0'}">
                <el-table-column prop="report_type" label="员工姓名"></el-table-column>
                <el-table-column prop="summary" label="部门"></el-table-column>
                <el-table-column prop="" label="签到次数"></el-table-column>
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
                const colors = ['#cc33cc'];
                const list1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
                const data1 = [40, 49, 23, 45, 23, 86, 23, 56, 23, 86, 23, 56]
                const option = {
                    title : {
                        text: '',
                        subtext: ''
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['签到次数']
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
                        }
                    ],
                    series : [
                        {
                            name:'签到次数',
                            type:'bar',
                            data:data1,
                            barWidth: '50%',
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

