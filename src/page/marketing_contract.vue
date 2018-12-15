<template>
    <div class="wrap">
        <!--查询表单-->
        <el-form class="query-form" label-position="left" size="small" :inline="true" :model="dsQuery" label-width='90px'>
            <el-form-item label="合同名称">
                <el-input v-model="dsQuery.contractName" clearable placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="initTableData(1)">查询</el-button>
                <el-button type="primary" @click="clearQuery">清空</el-button>
            </el-form-item>
            <el-form-item>
                &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base" @click='query_show = !query_show; '>更多查询条件<i :class="'iconfont icon-'+query_show"></i></a>
            </el-form-item>
            <div v-show="query_show">
                <div class="input-box">
                    <el-form-item label="合同状态">
                        <el-select v-model="dsQuery.contractState" clearable placeholder="请选择">
                          <el-option
                            v-for="item in htzt"
                            :key="item"
                            :label="item"
                            :value="item">
                          </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客户名称">
                        <el-input v-model="dsQuery.cus_name" clearable placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker
                            v-model="dsQuery.createTime"
                            type="daterange"
                            style="width: 250px; margin-right: 30px;"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <!-- <div class="input-box">
                    <el-form-item label="创建时间">
                        <el-date-picker
                            v-model="dsQuery.createTime"
                            type="daterange"
                            style="width: 250px; margin-right: 30px;"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-form-item>
                </div> -->
            </div>
        </el-form>
        <!-- 操作按钮 -->
        <el-row>
            <el-button type="primary" size="small" @click="add_contract()">新增</el-button>
            <el-button type="primary" size="small" @click="turnOther">转给他人</el-button>
            <el-button type="primary" size="small" @click="delete_contractAdd()">删除</el-button>
            <el-button type="primary" size="small" @click="importExcel">导入</el-button>
            <input type="file" ref="uploadExcel" v-show="false" accept=".xls,.xlsx" @change="readExcel">
        </el-row>
        <!--客户表格数据展示-->
        <el-table ref="table" class="table" :data="tableData"
                max-height="500" border style="width: 100%; margin: 20px 0 0;"
                :fit='true'
                @selection-change="handleSelectionChange"
                @sort-change="sortChange">
            <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
            <el-table-column prop="contractNo" label="合同编号" sortable="custom" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  <router-link class="text-base" :to="'./marketing_contract_detail?id=' + scope.row.id">{{scope.row.contractNo}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="contractName" sortable="custom" label="合同名称"></el-table-column>
            <el-table-column prop="customerName" min-width="100" sortable="custom" label="客户名称"></el-table-column>
            <el-table-column prop="contracAmount" sortable="custom" label="合同总金额"></el-table-column>
            <el-table-column prop="opportunityName" sortable="custom" label="营销机会"></el-table-column>
            <el-table-column prop="startTime" sortable="custom" label="合同开始时间"></el-table-column>
            <el-table-column prop="contractState" sortable="custom" label="合同状态"></el-table-column>
            <el-table-column prop="ownerCname" sortable="custom" label="合同负责人"></el-table-column>
            <el-table-column prop="createTime" sortable="custom" label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createTime.split(' ')[0]}}
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination v-show="count" background layout="total,prev, pager, next"
                        :page-size="pageSize"
                        @current-change="initTableData"
                        :current-page="currentPage"
                        :total="count" style="float: right;">
        </el-pagination>
        <!-- 新增合同模态框 -->
        <el-dialog title="新增合同" width="600px" class="dialogAdd"  @open="openModal" @close="closeAdd" :visible.sync="dialogAddVisible" :close-on-click-modal='false'>
            <el-tabs v-model="activeName">
                <!-- 基本信息 -->
                <el-tab-pane name="first">
                    <span class="tab-item" slot="label">基本信息</span>
                    <div class="first">
                      <el-form ref="contractAdd" :rules="contrac_rules" :model="contractAdd" label-width="120px" size="small">
                        <el-form-item  label="客户名称" prop="customerId">
                          <el-select v-model="contractAdd.customerId" size="small" filterable clearable placeholder="请输入客户名称">
                            <el-option
                              v-for="item in customers"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item  label="营销机会" prop="opportunityId">
                          <el-select v-model="contractAdd.opportunityId" size="small" filterable clearable placeholder="请输入机会名称">
                            <el-option
                              v-for="item in opportunitys"
                              :key="item.id"
                              :label="item.opportunityName"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </el-form-item>

                        <el-form-item v-for="(item,index) in contractAddLabel" :key="index" :label="item.label" :prop="item.name">

                            <el-input v-if="item.editorType == 'text'" v-model="contractAdd[item.name]"></el-input>
                            <el-date-picker v-if="item.editorType == 'date'" v-model="contractAdd[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                type="date" placeholder="选择日期时间">
                            </el-date-picker>

                            <el-select v-if="item.editorType == 'dict'" v-model="contractAdd[item.name]">
                                <el-option
                                  v-if="item.editorType == 'dict'"
                                  v-for="value in item.selectList"
                                  :key="value"
                                  :label="value"
                                  :value="value">
                                </el-option>
                            </el-select>
                            <el-cascader
                              v-if="item.editorType == 'cascade'"
                              size="small"
                              :options="options"
                              v-model="contractAdd[item.name]">
                            </el-cascader>
                        </el-form-item>
                        <el-form-item  label="财务经理" prop="financialManagerName">
                          <el-select v-model="contractAdd.financialManagerName" size="small" filterable clearable placeholder="请选择财务经理">
                            <el-option
                              v-for="item in financialManagers"
                              :key="item.userName"
                              :label="item.cname + '  ' + item.userName"
                              :value="item.userName + '/' + item.cname">
                              <span style="float: left">{{ item.cname }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
                            </el-option>
                          </el-select>
                        </el-form-item>

                        <el-form-item  label="合同负责人" prop="ownerCname">
                              <el-select v-model="contractAdd.ownerCname" size="small" filterable clearable placeholder="请输入员工姓名或工号">
                                  <el-option
                                      v-for="item in allStaff"
                                      :key="item.userName"
                                      :label="item.cname + '  ' + item.userName"
                                      :value="item.userName + '/' + item.cname">
                                      <span style="float: left">{{ item.cname }}</span>
                                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
                                  </el-option>
                              </el-select>
                        </el-form-item>
                      </el-form>

                    </div>

                </el-tab-pane>

                <!-- 开票信息 -->
                <el-tab-pane name="second">
                    <span class="tab-item" slot="label">开票信息</span>
                    <div class="second">
                      <el-form ref="openTicketAdd" :rules="ticket_rules" :model="openTicketAdd" label-width="120px" size="small">
                        <el-form-item v-for="(item,index) in openTicketAddLabel" :key="index" :label="item.label" :prop="item.name">

                            <el-input v-if="item.editorType == 'text'" v-model="openTicketAdd[item.name]"></el-input>
                            <el-date-picker v-if="item.editorType == 'date'" v-model="openTicketAdd[item.name]" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
                                type="datetime" placeholder="选择日期时间">
                            </el-date-picker>

                            <el-select v-if="item.editorType == 'dict'" v-model="openTicketAdd[item.name]">
                                <el-option
                                  v-if="item.editorType == 'dict'"
                                  v-for="value in item.selectList"
                                  :key="value"
                                  :label="value"
                                  :value="value">
                                </el-option>
                            </el-select>
                            <el-cascader
                              v-if="item.editorType == 'cascade'"
                              size="small"
                              :options="options"
                              v-model="openTicketAdd[item.name]">
                            </el-cascader>
                        </el-form-item>
                      </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="primary" @click="contractSave">确 定</el-button>
            </div>
        </el-dialog>
        <!--转给他人弹框-->
        <el-dialog title="转给他人" width="40%" :visible.sync="dialogTransferVisible" :close-on-click-modal='false'>
          <el-form ref="form" label-width="120px" size="small">
            <el-form-item label="新拥有者">
              <el-form-item>
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
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTransferVisible = false">取 消</el-button>
            <el-button type="primary" @click="turn_other_sava">确 定</el-button>
          </div>
        </el-dialog>
        <!--导入合同弹框-->
        <el-dialog title="导入" width="80%" :visible.sync="dialogImportVisible" :close-on-click-modal='false'>
            <!--导入数据展示-->
            <el-table class="table importTable" ref="importTable" :data="outputs" max-height="500" border style="width: 100%">
                <el-table-column width="30" type="index" label="序号" fixed></el-table-column>
                <el-table-column prop="contractType" label="合同类别" min-width="30">
                    <template slot-scope="scope">
                        <div :ref="scope.row.contractType?'' : 'importError'" :style="scope.row.contractType ? '' : 'color: red;'">{{ scope.row.contractType || '不能为空' }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="contractName" label="合同名称" min-width="30"></el-table-column>
                <el-table-column prop="implementDeptName" label="执行部门" min-width="30"></el-table-column>
                <el-table-column prop="contracAmount" label="合同金额(万元)" min-width="30">
                    <template slot-scope="scope" min-width="30">
                        
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始日期" min-width="30"></el-table-column>
                <el-table-column prop="endTime" label="结束日期" min-width="30"></el-table-column>
                <el-table-column prop="signatoryTime" label="签约日期" min-width="30"></el-table-column>
                <el-table-column prop="projectYear" label="项目年份" min-width="30"></el-table-column>
                <el-table-column prop="ownerId" label="合同负责人" min-width="30">
                    <template slot-scope="scope">
                        <div :ref="scope.row.ownerCname?'' : 'importError'" :style="scope.row.ownerCname ? '' : 'color: red;'">{{ (scope.row.ownerCname && scope.row.ownerCname.split("/")[1]) || '工号不存在' }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="customerName" label="客户名称" min-width="30"></el-table-column>
                <el-table-column prop="contractState" label="合同状态" min-width="30"></el-table-column>
                <el-table-column prop="projectType" label="项目类型" min-width="30"></el-table-column>
                <el-table-column prop="contractSource" label="项目总体" min-width="30"></el-table-column>
                <el-table-column prop="contractSource" label="合同来源" min-width="30"></el-table-column>
                <el-table-column prop="financialManagerId" label="财务经理" min-width="30"></el-table-column>
                <el-table-column prop="customerSignatory" label="客户签约人" min-width="30"></el-table-column>
                <el-table-column prop="selfSignatoryId" label="我方签约人" min-width="30"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogImportVisible = false">取 消</el-button>
                <el-button type="primary" @click="importSave">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script src="../js/marketing_contract.js">
</script>
<style lang="less" scoped>
    .query-form{
        .el-input, .el-select, .el-date-picker{
            width: 250px;
            margin-right: 30px;
        }
    }
    .dialogAdd, .dialogTransfer{
        .el-input, .el-select, .el-textarea{
            width: 330px;
        }
    }
</style>

