<template>
    <div class="wrap">
        <el-form class="query-form" label-position="left" size="small" :model="formQuery" label-width='100px'>
            <el-form-item label="跟进时间：">
                <el-date-picker 
                    v-model="formQuery.recent_follow_time"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="部门：">
                <el-select v-model="formQuery.follow_type" clearable>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="跟进人：">
                <el-input size="small" v-model="formQuery.phone" clearable placeholder=""></el-input>
            </el-form-item>
        </el-form>
        <div class="chart" id="chart"></div>
        <div class="table-box">
            <p>跟进次数：20&nbsp;&nbsp;&nbsp;&nbsp;跟进线索次数：20&nbsp;&nbsp;&nbsp;&nbsp;跟进客户次数：20&nbsp;&nbsp;&nbsp;&nbsp;跟进机会次数：20
                &nbsp;&nbsp;&nbsp;&nbsp;跟进合同次数：20
            </p>
            <el-table class="table" :data="tableData" max-height="500" border :header-cell-style="{'padding': '10px 0'}">
                <el-table-column prop="report_type" label="员工姓名"></el-table-column>
                <el-table-column prop="summary" label="所在部门"></el-table-column>
                <el-table-column prop="" label="跟进次数"></el-table-column>
                <el-table-column prop="" label="跟进线索次数"></el-table-column>
                <el-table-column prop="" label="跟进客户次数"></el-table-column>
                <el-table-column prop="" label="跟进机会次数"></el-table-column>
                <el-table-column prop="" label="跟进合同次数"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions, mapMutations } from 'vuex'
    import echarts from 'echarts/lib/echarts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/funnel'
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
        },
        activated(){
            this.getData()
        },
        methods: {
            initData(data){
                const colors = ['#6699ff', '#99f', '#fc0', '#f69', '#f00'];
                const option = {
                    title : {
                        text: '营销漏斗',
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: function (params, ticket, callback) {
                            return params.data.name + ' : ' + params.data.value + '</br>总金额 : ' + params.data.money
                        }
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    color: colors,
                    legend: {
                        data : data.values
                    },
                    calculable : true,
                    series : [
                        {
                            name:'漏斗图',
                            type:'funnel',
                            width: '40%',
                            data:data.infosList
                        }
                    ]
                };
                this.myChart.setOption(option);
            },
            getData(){
                this.$post("/crm/benchPR/queryBench", {}, (data) => {
                    console.log(data)
                    this.initData(data)
                })
            },
        }
    }
</script>
// initData(data){
//     const colors = ['#6699ff', '#99f', '#fc0', '#f69', '#f00'];
//     const list1 = ['员工A', '员工B', '员工C', '员工D', '员工E', '员工F', '员工G', '员工H']
//     const data1 = [40, 49, 23, 45, 23, 86, 23, 56]
//     const data2 = [40, 49, 23, 45, 23, 86, 23, 56]
//     const data3 = [40, 49, 23, 45, 23, 86, 23, 56]
//     const data4 = [40, 49, 23, 45, 23, 86, 23, 56]
//     const data5 = [40, 49, 23, 45, 23, 86, 23, 56]
//     const option = {
//         title : {
//             text: '跟进记录报表',
//             subtext: ''
//         },
//         tooltip : {
//             trigger: 'axis'
//         },
//         legend: {
//             data:['跟进次数','跟进线索次数','跟进客户次数','跟进机会次数','跟进合同次数']
//         },
//         toolbox: {
//             show : true,
//             feature : {
//                 mark : {show: true},
//                 dataView : {show: true, readOnly: false},
//                 magicType : {show: true, type: ['line', 'bar']},
//                 restore : {show: true},
//                 saveAsImage : {show: true}
//             }
//         },
//         color: colors,
//         lineStyle: {
//             type: 'dotted',
//             width: 2
//         },
//         calculable : true,
//         xAxis : [
//             {
//                 type : 'category',
//                 data : list1
//             }
//         ],
//         yAxis : [
//             {
//                 type : 'value'
//             }
//         ],
//         series : [
//             {
//                 name:'跟进次数',
//                 type:'bar',
//                 data:data1,
//                 barWidth: 10,
//                 // markPoint : {
//                 //     data : [
//                 //         {type : 'max', name: '最大值'},
//                 //         {type : 'min', name: '最小值'}
//                 //     ]
//                 // },
//                 // markLine : {
//                 //     data : [
//                 //         {type : 'average', name: '平均值'}
//                 //     ]
//                 // }
//             },
//             {
//                 name:'跟进线索次数',
//                 type:'bar',
//                 data:data2,
//                 barWidth: 10,
//                 // markPoint : {
//                 //     data : [
//                 //         {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
//                 //         {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
//                 //     ]
//                 // },
//                 // markLine : {
//                 //     data : [
//                 //         {type : 'average', name : '平均值'}
//                 //     ]
//                 // }
//             },
//             {
//                 name:'跟进客户次数',
//                 type:'bar',
//                 data:data3,
//                 barWidth: 10,
//             },
//             {
//                 name:'跟进机会次数',
//                 type:'bar',
//                 data:data4,
//                 barWidth: 10,
//             },
//             {
//                 name:'跟进合同次数',
//                 type:'bar',
//                 data:data5,
//                 barWidth: 10,
//             }
//         ]
//     };
//     this.myChart.setOption(option);
// },
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

