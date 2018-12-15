<template>
    <div class="wrap">
        <el-form class="query-form" label-position="left" size="small" :model="formQuery" label-width='90px'>
            <el-form-item label="报告类型：">
                <span :class="formQuery.type == 0 ? 'active' : ''" @click="chooseDaily">日报</span>&nbsp;&nbsp;&nbsp;&nbsp;
                <span :class="formQuery.type == 1 ? 'active' : ''" @click="chooseWeekly">周报</span>&nbsp;&nbsp;&nbsp;&nbsp;
                <span :class="formQuery.type == 2 ? 'active' : ''" @click="chooseMonthly">月报</span>
            </el-form-item>
            <el-form-item label="部门：">
                <el-select v-model="formQuery.follow_type" clearable>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="员工：">
                <el-select v-model="formQuery.follow_type" clearable>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="table-box">
            <el-date-picker v-show="formQuery.type == 0" v-model="week" type="week" :picker-options='pickerOptions' format="yyyy 第 WW 周" placeholder="选择周"></el-date-picker>
            <el-date-picker v-show="formQuery.type == 1" v-model="month" type="month" format="yyyy-MM" value-format="yyyy-MM-dd" placeholder="选择月"></el-date-picker>
            <el-date-picker v-show="formQuery.type == 2" v-model="year" type="year" placeholder="选择年"></el-date-picker>
            <el-table v-show="formQuery.type == 0" class="table" :data="tableData" max-height="500" border :header-cell-style="{'padding': '10px 0'}">
                <el-table-column prop="report_type" label="员工姓名"></el-table-column>
                <el-table-column prop="summary" label="提交数量"></el-table-column>
                <el-table-column prop="" label="未提数量"></el-table-column>
                <el-table-column prop="" label="周一"></el-table-column>
                <el-table-column prop="" label="周二"></el-table-column>
                <el-table-column prop="" label="周三"></el-table-column>
                <el-table-column prop="" label="周四"></el-table-column>
                <el-table-column prop="" label="周五"></el-table-column>
                <el-table-column prop="" label="周六"></el-table-column>
                <el-table-column prop="" label="周日"></el-table-column>
            </el-table>
            <table v-show="formQuery.type == 1" class="table" cellpadding="0" cellspacing="0">
                <tr>
                    <th width="80">员工姓名</th>
                    <th width="80">提交数量</th>
                    <th width="80">未提数量</th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>5</th>
                    <th>6</th>
                    <th>7</th>
                    <th>8</th>
                    <th>9</th>
                    <th>10</th>
                    <th>11</th>
                    <th>12</th>
                    <th>13</th>
                    <th>14</th>
                    <th>15</th>
                    <th>16</th>
                    <th>17</th>
                    <th>18</th>
                    <th>19</th>
                    <th>20</th>
                    <th>21</th>
                    <th>22</th>
                    <th>23</th>
                    <th>24</th>
                    <th>25</th>
                    <th>26</th>
                    <th>27</th>
                    <th>28</th>
                    <th>29</th>
                    <th>30</th>
                    <th>31</th>
                </tr>
                <tr>
                    <td class="empty" colspan="40">暂无数据</td>
                </tr>
                <tr style="display: none;">
                    <td>暗示法</td>
                    <td>23</td>
                    <td>43</td>
                    <td>x</td>
                    <td>x</td>
                    <td>x</td>
                    <td>x</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
            <table v-show="formQuery.type == 2" class="table" cellpadding="0" cellspacing="0">
                <tr>
                    <th width="80">员工姓名</th>
                    <th width="80">提交数量</th>
                    <th width="80">未提数量</th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>5</th>
                    <th>6</th>
                    <th>7</th>
                    <th>8</th>
                    <th>9</th>
                    <th>10</th>
                    <th>11</th>
                    <th>12</th>
                </tr>
                <tr>
                    <td class="empty" colspan="40">暂无数据</td>
                </tr>
                <tr style="display: none;">
                    <td>暗示法</td>
                    <td>23</td>
                    <td>43</td>
                    <td>x</td>
                    <td>x</td>
                    <td>x</td>
                    <td>x</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
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
                formQuery: {type: 0},
                tableData: [],
                week: '',
                month: '',
                year: '',
                pickerOptions: {
                    firstDayOfWeek: 1, 
                },
            }
        },
        methods: {
            chooseDaily(){
                this.formQuery.type = 0;
                let week_list = [];
                let day = this.week;
                day.setDate(day.getDate() - 1)
                week_list.push(this.formatDate(day, 'yyyy-MM-dd'));
                for(var i=0; i<6; i++){
                    day.setDate(day.getDate() +1)
                    week_list.push(this.formatDate(day, 'yyyy-MM-dd'));
                }
                console.log(week_list)
            },  
            chooseWeekly(){
                this.formQuery.type = 1
            },
            chooseMonthly(){
                this.formQuery.type = 2
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
        span{
            cursor: pointer;
        }
        span.active{
            color: #2db7f5;
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
    .table{
        width: 100%;
        font-size: 14px;
        color: #909399;
        margin-top: 20px;
        border-top: 1px solid #ebeef5;
        border-left: 1px solid #ebeef5;
        th{
            height: 35px;
            line-height: 34px;
            border-right: 1px solid #ebeef5;
            border-bottom: 1px solid #ebeef5;
        }
        td{
            border-right: 1px solid #ebeef5;
            border-bottom: 1px solid #ebeef5;
            line-height: 23px;
        }
        .empty{
            height: 47px;
        }
    }
</style>


