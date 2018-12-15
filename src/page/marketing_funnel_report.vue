<template>
    <div class="wrap">
        <el-form class="query-form" label-position="left" size="small" :model="formQuery" label-width='100px'>
            <el-form-item label="所属部门：">
                <el-select v-model="formQuery.follow_type" clearable>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="拥有者：">
                <el-input size="small" v-model="formQuery.phone" clearable placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="创建日期：">
                <el-date-picker 
                    v-model="formQuery.recent_follow_time"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <div class="funnel">
            <div class="funnel-item">
                <div class="funnel1"></div>     
                <div class="line" style="background: #f4b93b;margin-top: 50px;"></div>
                <div class="desc" style="line-height: 100px;color: #f4b93b">初步接洽(30)</div>
            </div>
            <div class="funnel-item">
                <div class="funnel2"></div>     
                <div class="line" style="background: #e7e3a2;margin-top: 40px;"></div>
                <div class="desc" style="color: #e7e3a2">方案和报价(8)</div>
            </div>
            <div class="funnel-item">
                <div class="funnel3"></div>     
                <div class="line" style="background: #86df79;margin-top: 40px;"></div>
                <div class="desc" style="color: #86df79">现场踏勘(10)</div>
            </div>
            <div class="funnel-item">
                <div class="funnel4"></div>     
                <div class="line" style="background: #7c8dc1;margin-top: 40px;"></div>
                <div class="desc" style="color: #7c8dc1">委托中标(20)</div>
            </div>
            <div class="funnel-item">
                <div class="funnel5"></div>     
                <div class="line" style="background: #39a9cf;margin-top: 40px;"></div>
                <div class="desc" style="color: #39a9cf">赢单(30)</div>
            </div>
        </div>
        <div class="table-box">
            <p>机会数量：20 &nbsp;&nbsp;&nbsp;&nbsp;预计营销金额：￥20000000</p>
            <el-table class="table" :data="tableData" max-height="500" border :header-cell-style="{'padding': '10px 0'}">
                <el-table-column prop="report_type" label="营销阶段"></el-table-column>
                <el-table-column prop="summary" label="机会数量"></el-table-column>
                <el-table-column prop="" label="预计营销金额"></el-table-column>
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
        methods: {
            initData(arr){
                const colors = ['#5793f3', '#675bba', '#d14a61'];
                const option = {
                    color: colors,
                    title: {
                        text: '走势图',
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['新注册用户', '新增订单', '新增管理员']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            // dataZoom: {
                            //     yAxisIndex: 'none'
                            // },
                            // dataView: {readOnly: false},
                            magicType: {type: ['bar', 'line']},
                            // restore: {},
                        }
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                        data: ['a', 'b', 'c', 'd', 'e']
                    },
                    yAxis: [
                        {
                          type: 'value',
                          name: '用户',
                          min: 0,
                          max: 200,
                          position: 'left',
                          axisLine: {
                              lineStyle: {
                                  color: '#999'
                              }
                          },
                        //   axisLabel: {
                        //       formatter: '{value}'
                        //   }
                        },
                        {
                          type: 'value',
                          name: '订单',
                          min: 0,
                          max: 400,
                          position: 'right',
                          axisLine: {
                              lineStyle: {
                                  color: '#999'
                              }
                          },
                          axisLabel: {
                              formatter: '{value}'
                          }
                        },
                    ],
                    series: [
                        {
                            name:'新注册用户',
                            type:'line',
                            data:arr[0],
                            yAxisIndex: 0,
                            // markPoint: {
                            //     data: [
                            //         {type: 'max', name: '最大值'},
                            //         {type: 'min', name: '最小值'}
                            //     ]
                            // },
                        },
                        {
                            name:'新增订单',
                            type:'line',
                            data:arr[1],
                            yAxisIndex: 1,
                            // markPoint: {
                            //     data: [
                            //         {type: 'max', name: '最大值'},
                            //         {type: 'min', name: '最小值'}
                            //     ]
                            // },
                        },
                        {
                            name:'新增管理员',
                            type:'line',
                            data:arr[2],
                            yAxisIndex: 0,
                            // markPoint: {
                            //     data: [
                            //         {type: 'max', name: '最大值'},
                            //         {type: 'min', name: '最小值'}
                            //     ]
                            // },
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
    .funnel{
        background: #fff;
        height: 520px;
        padding-top: 30px;
        padding-left: 40px;
        .funnel-item{
            display: flex;
            max-width: 1300px;
            margin: 0 auto;
        }
        .line{
            flex: 1;
            height: 1px;
        }
        .desc{
            width: 180px;
            line-height: 80px;
            padding-left: 10px;
            font-weight: bold;
        }
        .funnel1{
            position: relative;
            width: 520px;
            height: 100px;
            background: #f4b93b;
            margin-left: 100px;
            &:before{
                position: absolute;
                content: '';
                display: block;
                width: 0;
                height: 0;
                left: -74px;
                border-right: 37px solid #f4b93b;
                border-top: 50px solid #f4b93b;
                border-bottom: 50px solid transparent;
                border-left: 37px solid transparent;
            }
            &:after{
                position: absolute;
                content: '';
                display: block;
                width: 0;
                height: 0;
                top: 0;
                right: -74px;
                border-left: 37px solid #f4b93b;
                border-top: 50px solid #f4b93b;
                border-bottom: 50px solid transparent;
                border-right: 37px solid transparent;
            }
        }
        .funnel2{
            position: relative;
            width: 400px;
            height: 80px;
            background: #e7e3a2;
            margin-left: 160px;
            &:before{
                position: absolute;
                content: '';
                display: block;
                width: 0;
                height: 0;
                left: -60px;
                border-right: 30px solid #e7e3a2;
                border-top: 40px solid #e7e3a2;
                border-bottom: 40px solid transparent;
                border-left: 30px solid transparent;
            }
            &:after{
                position: absolute;
                content: '';
                display: block;
                width: 0;
                height: 0;
                top: 0;
                right: -60px;
                border-left: 30px solid #e7e3a2;
                border-top: 40px solid #e7e3a2;
                border-bottom: 40px solid transparent;
                border-right: 30px solid transparent;
            }
        }
        .funnel3{
            position: relative;
            width: 280px;
            height: 80px;
            background: #86df79;
            margin-left: 220px;
            &:before{
                position: absolute;
                content: '';
                display: block;
                width: 0;
                height: 0;
                left: -60px;
                border-right: 30px solid #86df79;
                border-top: 40px solid #86df79;
                border-bottom: 40px solid transparent;
                border-left: 30px solid transparent;
            }
            &:after{
                position: absolute;
                content: '';
                display: block;
                width: 0;
                height: 0;
                top: 0;
                right: -60px;
                border-left: 30px solid #86df79;
                border-top: 40px solid #86df79;
                border-bottom: 40px solid transparent;
                border-right: 30px solid transparent;
            }
        }
        .funnel4{
            position: relative;
            width: 160px;
            height: 80px;
            background: #7c8dc1;
            margin-left: 280px;
            &:before{
                position: absolute;
                content: '';
                display: block;
                width: 0;
                height: 0;
                left: -60px;
                border-right: 30px solid #7c8dc1;
                border-top: 40px solid #7c8dc1;
                border-bottom: 40px solid transparent;
                border-left: 30px solid transparent;
            }
            &:after{
                position: absolute;
                content: '';
                display: block;
                width: 0;
                height: 0;
                top: 0;
                right: -60px;
                border-left: 30px solid #7c8dc1;
                border-top: 40px solid #7c8dc1;
                border-bottom: 40px solid transparent;
                border-right: 30px solid transparent;
            }
        }
        .funnel5{
            width: 160px;
            height: 80px;
            background: #39a9cf;
            margin-left: 280px;
        }
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

