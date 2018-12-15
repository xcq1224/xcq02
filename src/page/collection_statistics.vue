<template>
    <div class="wrap">
        <el-form class="query-form" label-position="left" size="small" label-width='120px'>
            <el-form-item label="时间：">
                <el-date-picker
                    @change="getData"
                    value-format="yyyy"
                    :clearable="false"
                    v-model="year"
                    type="year"
                    placeholder="选择年">
                </el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="时间：">
                <el-date-picker
                    v-model="value6"
                    @change="abc"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item> -->
            <el-form-item label="所属营销经理：">
                <el-select
                    v-model="userIds"
                    @visible-change="userChange"
                    @remove-tag="getData"
                    multiple
                    collapse-tags
                    placeholder="请选择">
                    <el-option
                        v-for="item in staffs"
                        :key="item.userName"
                        :label="item.cname"
                        :value="item.userName">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="chart" id="chart">
            
        </div>
        <div class="table-box">
            <p>计划收款金额：{{receiptPlanTotal}}(万元)&nbsp;&nbsp;&nbsp;&nbsp;已完成金额：{{receiptInfoTotal}}(万元)&nbsp;&nbsp;&nbsp;&nbsp;未完成金额：{{unReceiptInfoTotal}}(万元)&nbsp;&nbsp;&nbsp;&nbsp;已开票金额：{{invoiceInfoTotal}}(万元)</p>
            <el-table class="table" :data="tableData" max-height="500" border :header-cell-style="{'padding': '10px 0'}">
                <el-table-column label="时间">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}月</span>
                    </template>
                </el-table-column>
                <el-table-column prop="label1" label="计划收款金额(万元)">
                    <template slot-scope="scope">
                        <span>{{scope.row.label1 || "——"}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="label2" label="实际收款金额(万元)">
                    <template slot-scope="scope">
                        <span>{{scope.row.label2 || "——"}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="label3" label="未完成收款金额(万元)">
                    <template slot-scope="scope">
                        <span>{{scope.row.label3 || "——"}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="label4" label="已开票金额(万元)">
                    <template slot-scope="scope">
                        <span>{{scope.row.label4 || "——"}}</span>
                    </template>
                </el-table-column>
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
                year: '',
                staffs: [],             //  下属员工
                userIds: [],            //  选中的员工
                tableData: [],
                receiptPlans: [0,0,0,0,0,0,0,0,0,0,0,0],   //  计划收款
                receiptInfos: [0,0,0,0,0,0,0,0,0,0,0,0],   //  实际收款
                unReceiptInfos: [0,0,0,0,0,0,0,0,0,0,0,0], //  未完成收款
                invoiceInfos: [0,0,0,0,0,0,0,0,0,0,0,0],   //  已开票
                receiptPlanTotal: 0,    //  计划收款总和
                receiptInfoTotal: 0,    //  实际收款总和
                unReceiptInfoTotal: 0,    //  未完成收款总和
                invoiceInfoTotal: 0,    //  已开票总和
                
            }
        },
        mounted(){
            this.year = new Date().getFullYear() + ''
            this.myChart = echarts.init(document.getElementById('chart'));
            this.getData()
        },
        methods: {

            initData(){
                const colors = ['#6699ff', '#99f', '#fc0', '#f69'];
                const list1 = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                const data1 = this.receiptPlans
                const data2 = this.receiptInfos
                const data3 = this.unReceiptInfos
                const data4 = this.invoiceInfos
                const option = {
                    title : {
                        text: '',
                        subtext: ''
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['计划收款金额','已完成金额','未完成金额','已开票金额']
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
                            name:'计划收款金额',
                            type:'bar',
                            data:data1,
                            barWidth: 10,
                        },
                        {
                            name:'已完成金额',
                            type:'bar',
                            data:data2,
                            barWidth: 10,
                        },
                        {
                            name:'未完成金额',
                            type:'bar',
                            data:data3,
                            barWidth: 10,
                        },
                        {
                            name:'已开票金额',
                            type:'bar',
                            data:data4,
                            barWidth: 10,
                        },
                    ]
                };
                this.myChart.setOption(option);
            },

            getData(){
                let datetime = [this.year + '-01-01', this.year + '-12-31']
                this.$post("/crm/collectionSummaryPR/collectionSummary", {datetime: datetime, userIds: this.userIds}, (data) => {
                    this.staffs = data.staffs
                    this.receiptPlans = [0,0,0,0,0,0,0,0,0,0,0,0]
                    this.receiptInfos = [0,0,0,0,0,0,0,0,0,0,0,0]
                    this.unReceiptInfos = [0,0,0,0,0,0,0,0,0,0,0,0]
                    this.invoiceInfos = [0,0,0,0,0,0,0,0,0,0,0,0]
                    data.receiptPlans.map(receiptPlan => {
                        receiptPlan.receiptList.map(item => {
                            if(item.planReceiptTime.indexOf(this.year) != -1){
                                let index = item.planReceiptTime.split("-")[1] - 1
                                this.receiptPlans[index] += parseInt(item.planPaymentAmount * 10000) / 10000

                                let today = this.formatDate(new Date(), 'yyyy-MM-dd')
                                if(item.planReceiptTime < today && item.receiptstate == '未完成'){
                                    this.unReceiptInfos[index] += parseInt(item.planPaymentAmount * 10000) / 10000
                                }
                            }
                        })
                    })
                    data.receiptInfos.map(item => {
                        if(item.receiptActualTime.indexOf(this.year) != -1){
                            let index = item.receiptActualTime.split("-")[1] - 1
                            this.receiptInfos[index] += parseInt(item.receiptAmount * 10000) / 10000
                        }
                    })
                    data.invoiceInfos.map(item => {
                        if(item.invoiceTime.indexOf(this.year) != -1){
                            let index = item.invoiceTime.split("-")[1] - 1
                            this.invoiceInfos[index] += parseInt(item.invoiceAmount * 10000) / 10000
                        }
                    })
                    this.initData();
                    this.receiptPlanTotal = this.sum(this.receiptPlans)
                    this.receiptInfoTotal = this.sum(this.receiptInfos)
                    this.unReceiptInfoTotal = this.sum(this.unReceiptInfos)
                    this.invoiceInfoTotal = this.sum(this.invoiceInfos)
                    this.receiptPlans.map((item, index) => {
                        this.tableData.push({
                            label1: item,
                            label2: this.receiptInfos[index],
                            label3: this.unReceiptInfos[index],
                            label4: this.invoiceInfos[index]
                        })
                    })
                })
            },

            sum(arr){
                let num = 0
                arr.map(item => {
                    num += item
                })
                return num
            },

            userChange(flag){
                if(!flag){
                    this.getData()
                }
            },
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

