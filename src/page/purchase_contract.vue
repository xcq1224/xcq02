<template>
    <div class="wrap">
        <!--查询表单-->
        <el-form class="query-form" label-position="left" size="small" :inline="true" :model="dsQuery" label-width='70px'>
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
                    <el-form-item label="分包项目">
                        <el-input v-model="dsQuery.purchaseProject" clearable placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="分包商">
                        <el-input v-model="dsQuery.sub_contract" clearable placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class="input-box">
                  <el-form-item label="合同负责人">
                        <el-select v-model="dsQuery.ownerCname" clearable placeholder="请选择">
                          <el-option value="0" label="全部"></el-option>
                          <el-option value="1" label="我拥有的"></el-option>
                          <el-option value="2" label="我参与的"></el-option>
                        </el-select>
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
            </div>
        </el-form>
        <!-- 操作按钮 -->
        <el-row>
            <el-button type="primary" size="small" @click="add_purchase_contract">新增</el-button>
            <el-button type="primary" size="small" @click="turnOther">转给他人</el-button>
            <!-- <el-button type="primary" size="small" @click="handleSubmit">提交审批</el-button> -->
            <!-- <el-button type="primary" size="small" @click="dialogImportVisible = true">导入</el-button> -->
            <el-button type="primary" size="small" @click="delete_purchase_contract">删除</el-button>
            <!-- <el-button type="primary" size="small">导出合同</el-button> -->
        </el-row>
        <!--客户表格数据展示-->
        <keep-alive>
        <el-table ref="table" class="table"  :data="tableData"
                max-height="500" border style="width: 100%; margin: 20px 0 0;"
                header-cell-class-name='text-center'
                cell-class-name='text-center' :fit='true'
                @selection-change="handleSelectionChange"
                @sort-change="sortChange">
            <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
            <el-table-column prop="contractNo" label="合同编号" sortable="custom" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  <router-link class="text-base" :to="'./purchase_contract_detail?id=' + scope.row.id">{{scope.row.contractNo}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="contractName" label="合同名称" sortable="custom"></el-table-column>
            <el-table-column prop="purchaseProject" label="分包项目" sortable="custom"></el-table-column>
            <el-table-column prop="purchasers" min-width="100" label="分包商" sortable="custom"></el-table-column>
            <el-table-column prop="contracAmount" label="合同总金额" sortable="custom"></el-table-column>
            <el-table-column prop="startTime" label="合同开始时间" sortable="custom"></el-table-column>
            <el-table-column prop="contractState" label="合同状态" sortable="custom"></el-table-column>
            <el-table-column prop="ownerCname" label="合同负责人" sortable="custom"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" sortable="custom">
                <template slot-scope="scope">
                    {{scope.row.createTime.split(' ')[0]}}
                </template>
            </el-table-column>
        </el-table>
        </keep-alive>
        <!--分页-->
        <el-pagination v-show="count" background layout="total,prev, pager, next"
                        :page-size="pageSize"
                        @current-change="initTableData"
                        :current-page="currentPage"
                        :total="count" style="float: right;">
        </el-pagination>
        <!-- 新增合同模态框 -->
        <el-dialog title="新增合同" @open="openModal" @close="closeAdd" width="600px" class="dialogAdd" :visible.sync="dialogAddVisible" :close-on-click-modal='false'>
            <el-form ref="purchaseContractAdd" :rules="purchase_contract_rules" :model="purchaseContractAdd" label-width="120px" size="small">
                <!-- 基本信息 -->
                <span class="tab-item" slot="label">基本信息</span>
                <div class="first">

                  <el-form-item v-for="(item,index) in purchaseContractAddLable" :key="index" :label="item.label" :prop="item.name">

                      <el-input v-if="item.editorType == 'text'" v-model="purchaseContractAdd[item.name]"></el-input>
                      <el-date-picker v-if="item.editorType == 'date'" v-model="purchaseContractAdd[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                          type="date" placeholder="选择日期时间">
                      </el-date-picker>

                      <el-select v-if="item.editorType == 'dict'" v-model="purchaseContractAdd[item.name]">
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
                        v-model="purchaseContractAdd[item.name]">
                      </el-cascader>
                  </el-form-item>
                  <el-form-item label="分包商：" prop="purchasersId">
                      <el-select v-model="purchaseContractAdd.purchasersId" size="small" filterable clearable placeholder="请选择分包商">
                        <el-option
                          v-for="item in subContractors"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item  label="财务经理" prop="financialManagerName">
                          <el-select v-model="purchaseContractAdd.financialManagerName" size="small" filterable clearable placeholder="请选择财务经理">
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
                    <el-form-item>
                        <el-select v-model="purchaseContractAdd.ownerCname" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
                  </el-form-item>
              </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="primary" @click="purchaseContractSave">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 转给他人模态框 -->
        <el-dialog title="转给他人" width="600px" class="dialogTransfer" :visible.sync="dialogTransferVisible" :close-on-click-modal='false'>
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
                <el-button @click="dialogTransferVisible = false" size="small">取消</el-button>
                <el-button type="primary" @click="turn_other_sava" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!--导入客户弹框-->
        <el-dialog title="导入客户" class="dialogImport" width="40%" :visible.sync="dialogImportVisible" :close-on-click-modal='false'>
            <p style="margin-top: 30px;">1.将要导入的数据填写到模板文件中：</p>
            <p><a href="" class="download">点击下载导入模板</a></p>
            <p>注意：模板表头不能更改，也不能删除；客户名称、拥有者为必填，必须保留；单次数据不能超过500条。</p>
            <p style="margin-top: 20px;">2.请选择数据重复的操作方式：</p>
            <el-select v-model="formImport.type" placeholder="" size="small">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <p>查重规则：客户名称</p>
            <p style="margin-top: 20px;">3.选择要导入的数据文件</p>
            <el-upload
                class="upload-demo"
                ref="upload"
                action=""
                :file-list="formImport.fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <a href="" class="import-history">查看历史导入记录</a>
                <el-button @click="dialogImportVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogImportVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script src="../js/purchase_contract.js">
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
    .dialogImport {
        p {
            margin-bottom: 5px;
        }
        .dialog-footer {
            margin-top: 30px;
        }
        .download {
            color: #0090ff;
            text-decoration: underline;
        }
        .import-history {
            float: left;
            line-height: 40px;
            font-size: 15px;
            color: #0090ff;
        }
    }
</style>

