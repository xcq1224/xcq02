<template>
    <div class="wrap">
        <el-form class="query-form" label-position="left" size="small" :model="formQuery" label-width='100px'>
            <el-form-item label="统计汇总：">
                按创建时间
            </el-form-item>
            <el-form-item label="时间维度：">
                日&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;年
            </el-form-item>
            <el-form-item label="创建人：">
                <el-select v-model="formQuery.follow_type" clearable>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="chart" id="chart">
            
        </div>
        <div class="table-box">
            <p>线索数：20个&nbsp;&nbsp;&nbsp;&nbsp;客户数：20个&nbsp;&nbsp;&nbsp;&nbsp;商机数：20个&nbsp;&nbsp;&nbsp;&nbsp;合同数：20个</p>
            <el-table class="table" :data="tableData" max-height="500" border :header-cell-style="{'padding': '10px 0'}">
                <el-table-column prop="report_type" label="时间"></el-table-column>
                <el-table-column prop="summary" label="线索数"></el-table-column>
                <el-table-column prop="" label="客户数"></el-table-column>
                <el-table-column prop="" label="商机数"></el-table-column>
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
                    title : {
                        text: '',
                        subtext: ''
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['线索数','客户数','商机数','合同数']
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
                            data : list1,
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'线索数',
                            type:'line',
                            data:data1,
                            // markPoint : {
                            //     data : [
                            //         {type : 'max', name: '最大值'},
                            //         {type : 'min', name: '最小值'}
                            //     ]
                            // },
                            // markLine : {
                            //     data : [
                            //         {type : 'average', name: '平均值'}
                            //     ]
                            // }
                        },
                        {
                            name:'客户数',
                            type:'line',
                            data:data2,
                            // markPoint : {
                            //     data : [
                            //         {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
                            //         {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                            //     ]
                            // },
                            // markLine : {
                            //     data : [
                            //         {type : 'average', name : '平均值'}
                            //     ]
                            // }
                        },
                        {
                            name:'商机数',
                            type:'line',
                            data:data3,
                        },
                        {
                            name:'合同数',
                            type:'line',
                            data:data4,
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

