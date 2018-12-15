<template>
    <div class="wrap">
        <el-form class="query-form" label-position="left" size="small" :model="formQuery" label-width='60px'>
            <el-form-item label="分类：">
                <span>个人</span>&nbsp;&nbsp;&nbsp;&nbsp;
                <span>部门</span>
            </el-form-item>
            <el-form-item label="部门：">
                <el-select v-model="formQuery.follow_type" clearable>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
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
            <el-form-item label="排序：">
                <el-input size="small" v-model="formQuery.phone" clearable placeholder=""></el-input>
            </el-form-item>
        </el-form>
        <div class="table-box">
            <p>客户数：20个</p>
            <el-table class="table" :data="tableData" max-height="500" border :header-cell-style="{'padding': '10px 0'}">
                <el-table-column prop="report_type" label="排名"></el-table-column>
                <el-table-column prop="summary" label="姓名"></el-table-column>
                <el-table-column prop="" label="所在部门"></el-table-column>
                <el-table-column prop="" label="客户数"></el-table-column>
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

