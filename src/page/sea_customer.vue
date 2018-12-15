<template>
    <div class="wrap">
        <el-row>
            <el-button type="primary" size="small" @click="turnOther">转给他人</el-button>
            <el-button type="primary" size="small" @click="del">删除</el-button>
        </el-row>
        <el-table class="table" ref="table" :data="tableData"
                max-height="500" border style="width: 100%; margin-top: 20px;"
                @selection-change="handleSelectionChange" @sort-change="sortChange"
                >
            <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
            <el-table-column prop="name" label="客户名称" sortable="custom" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="oldOwnerCname" sortable="custom" label="原拥有者"></el-table-column>
            <el-table-column prop="cusType" sortable label="客户类型"></el-table-column>
            <el-table-column prop="cusSize" sortable="custom" label="客户规模"></el-table-column>
            <el-table-column prop="industry" sortable="custom" label="所属行业"></el-table-column>
            <el-table-column prop="phone" sortable="custom" label="电话"></el-table-column>
            <el-table-column prop="followStatus" sortable="custom" label="跟进状态"></el-table-column>
            <el-table-column prop="lastFollowTime" sortable="custom" label="最近跟进时间" min-width="90"></el-table-column>
            <el-table-column prop="createTime" sortable="custom" label="转入时间">
                <template slot-scope="scope">
                <!-- {{scope.row.turnTime.split(' ')[0]}} -->
                </template>
            </el-table-column>
        </el-table>
        <!--表格数据分页-->
        <el-pagination v-if="count" background layout="total,prev, pager, next"
                    :page-size="pageSize"
                    @current-change="getCustomers"
                    :current-page="currentPage"
                    :total="count" style="float: right;">
        </el-pagination>
        <!--转给他人弹框-->
        <el-dialog title="转给他人" width="40%" :visible.sync="dialogTransferVisible" :close-on-click-modal='false'>
            <el-form ref="form" label-width="120px" size="small">
                <el-form-item label="新拥有者">
                    <el-select v-model="staff" size="small" filterable clearable placeholder="请输入员工姓名或工号">
                        <el-option
                            v-for="item in allStaff"
                            :key="item.userName"
                            :label="item.cname + '  ' + item.userName"
                            :value="item.userName">
                            <span style="float: left">{{ item.cname }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTransferVisible = false">取 消</el-button>
                <el-button type="primary" @click="turn_other_sava">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script src="../js/sea_customer.js">

</script>
<style lang="less" scoped>
    .dialogTransfer, .dialogEdit{
        .el-input, .el-select, .el-textarea, .el-cascader{
            width: 330px;
        }
    }
    .mergeTable{
        text-align: center;
        margin-top: 20px;
        td{
            // border: 1px solid #ddd;
            background: #fff;
        }
    }
    .dialogImport{
        p{
            margin-bottom: 5px;
        }
        .dialog-footer{
            margin-top: 30px;
        }
        .download{
            color: #0090ff;
            text-decoration: underline;
        }
        .import-history{
            float: left;
            line-height: 40px;
            font-size: 15px;
            color: #0090ff;
        }
    }
    .dialogSettings{
        a{
            color: #0090ff;
            margin-left: 10px;
        }
        .el-radio{
            margin-top: 10px;
        }
        .tip{
            margin-top: 10px;
            color: #f00;
        }
    }
</style>
