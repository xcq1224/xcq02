<template>
    <div class="wrap">
        <!-- 标签页内容 -->
        <div class="main">
            <el-tabs v-model="activeName">
                <!-- 收款计划 -->
                <el-tab-pane name="first">
                    <span class="tab-item" slot="label">收款计划</span>
                    <div class="first">
                        <!--查询表单-->
                        <el-form class="query-form" label-position="left" size="small" :inline="true" :model="dsQuery" label-width='70px' style="margin-top: 10px;">
                            <el-form-item label="合同名称">
                                <el-input v-model="dsQuery.contractName" clearable placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="initTableData(1)">查询</el-button>
                                <el-button type="primary" @click="clearQueryReceiptPlan">清空</el-button>
                            </el-form-item>
                            <el-form-item>
                                &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base" @click='queryShow1 = !queryShow1; '>更多查询条件<i :class="'iconfont icon-'+queryShow1"></i></a>
                            </el-form-item>
                            <div v-show="queryShow1">
                                <div class="input-box">
                                    <el-form-item label="客户名称">
                                        <el-input v-model="dsQuery.cus_name" clearable placeholder=""></el-input>
                                    </el-form-item>
                                    <!-- <el-form-item label="收款状态">
                                        <el-select v-model="dsQuery.state" clearable placeholder="请选择">
                                          <el-option
                                            v-for="item in skzt"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                          </el-option>
                                        </el-select>
                                    </el-form-item> -->
                                    <!-- <el-form-item label="计划收款日期" label-width="120">
                                        <el-date-picker
                                            v-model="dsQuery.plan_receipt_time"
                                            type="daterange"
                                            style="width: 250px; margin-right: 30px;"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd"
                                            :default-time="['00:00:00', '23:59:59']">
                                        </el-date-picker>
                                    </el-form-item> -->
                                </div>
                            </div>
                        </el-form>
                        <!-- 操作按钮 -->
                        <el-row>
                            <el-button type="primary" size="small" @click="dialogPaymentPlanVisible = true">新增</el-button>
                            <el-button type="primary" size="small" @click="edit_receipt_plan">编辑</el-button>
                            <!-- <el-button type="primary" size="small" @click="setupFinishSave">设置完成</el-button> -->
                            <el-button type="primary" size="small" @click="delReceiptPlan">删除</el-button>
                        </el-row>
                        <!--收款计划表格数据展示-->
                        <el-table ref="table" class="table" :data="tableData1"
                                max-height="500" border style="width: 100%; margin: 20px 0 0;"
                                header-cell-class-name='text-center'
                                cell-class-name='text-center' :fit='true'
                                @selection-change="handleSelectionChange"
                                @sort-change="sortChange">

                            <el-table-column type="expand">
                              <template slot-scope="props">
                                <table width="100%">
                                  <tr>
                                    <th>期数</th>
                                    <th>计划付款日期</th>
                                    <th>计划付款金额</th>
                                    <th>付款状态</th>
                                    <th>备注</th>
                                    <th width="60px">操作</th>
                                  </tr>
                                  <tr v-for="(item, index) in props.row.receiptList" :key="index">
                                    <td>{{item.receiptNum}}</td>
                                    <td>{{item.planReceiptTime}}</td>
                                    <td>{{item.planPaymentAmount}}</td>
                                    <td>{{item.receiptstate}}</td>
                                    <td>{{item.remark}}</td>
                                    <el-button type="primary" @click="setupFinishSave(props.row.id, item.receiptId)">设置完成</el-button>
                                  </tr>
                                </table>

                              </template>
                            </el-table-column>

                            <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
                            <el-table-column prop="contractName" min-width="100" label="合同名称" sortable="custom"></el-table-column>
                            <el-table-column prop="customerName" label="客户名称" sortable="custom"></el-table-column>
                            <el-table-column prop="contractAmount" label="计划收款金额" sortable="custom"></el-table-column>
                            <el-table-column prop="notReceiptAmount" label="未收款金额" sortable="custom">
                              <template slot-scope="scope">
                                {{getUnAmount(scope.row)}}
                              </template>
                            </el-table-column>
                            <el-table-column prop="ownerCname" label="合同负责人" sortable="custom"></el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-pagination v-show="count1" background layout="total,prev, pager, next"
                                        :page-size="pageSize1"
                                        @current-change="initTableData"
                                        :current-page="currentPage1"
                                        :total="count1" style="float: right;">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <!-- 收款记录 -->
                <el-tab-pane name="second">
                    <span class="tab-item" slot="label">收款记录</span>
                    <div class="second">
                        <!--查询表单-->
                        <el-form class="query-form" label-position="left" size="small" :inline="true" :model="dsQuery_1" label-width='70px' style="margin-top: 10px;">
                            <el-form-item label="合同名称">
                                <el-input v-model="dsQuery_1.contractName" clearable placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="initTableDataReceiptInfo(1)">查询</el-button>
                                <el-button type="primary" @click="clearQueryReceiptInfo">清空</el-button>
                            </el-form-item>
                            <el-form-item>
                                &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base" @click='queryShow2 = !queryShow2; '>更多查询条件<i :class="'iconfont icon-'+queryShow2"></i></a>
                            </el-form-item>
                            <div v-show="queryShow2">
                                <div class="input-box">
                                    <el-form-item label="客户名称">
                                        <el-input v-model="dsQuery_1.cus_name" clearable placeholder=""></el-input>
                                    </el-form-item>
                                    <el-form-item label="实际收款日期" label-width="120">
                                        <el-date-picker
                                            v-model="dsQuery_1.plan_receipt_time"
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
                            <el-button type="primary" size="small" @click="add_receipt_record">新增</el-button>
                            <el-button type="primary" size="small" @click="edit_receipt_info">编辑</el-button>
                            <el-button type="primary" size="small" @click="delReceiptRecord">删除</el-button>
                        </el-row>
                        <!--付款记录数据展示-->
                        <el-table ref="table1" class="table" :data="tableData2"
                                max-height="500" border style="width: 100%; margin: 20px 0 0;"
                                header-cell-class-name='text-center'
                                cell-class-name='text-center' :fit='true'
                                @selection-change="handleSelectionChange"
                                @sort-change="sortChange1">
                            <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
                            <el-table-column prop="receiptActualTime" label="实际收款日期" sortable="custom">
                              <template slot-scope="scope">
                                  {{scope.row.receiptActualTime.split(' ')[0]}}
                              </template>
                            </el-table-column>
                            <el-table-column prop="receiptAmount" label="收款金额" sortable="custom"></el-table-column>
                            <el-table-column prop="contractName" min-width="100" label="合同名称" sortable="custom"></el-table-column>
                            <el-table-column prop="customerName" label="客户名称" sortable="custom"></el-table-column>
                            <el-table-column prop="receiptNum" label="收款期数" sortable="custom"></el-table-column>
                            <el-table-column prop="receiptType" label="收款方式" sortable="custom"></el-table-column>
                            <el-table-column prop="receipterCname" label="收款人" sortable="custom"></el-table-column>
                            <el-table-column prop="createUserCname" label="创建人" sortable="custom"></el-table-column>
                            <el-table-column prop="remark" label="备注" sortable="custom"></el-table-column>
                            <el-table-column prop="createTime" label="创建时间" sortable="custom">
                              <template slot-scope="scope">
                                  {{scope.row.createTime.split(' ')[0]}}
                              </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-pagination v-show="count2" background layout="total,prev, pager, next"
                                        :page-size="pageSize2"
                                        @current-change="initTableDataReceiptInfo"
                                        :current-page="currentPage2"
                                        :total="count2" style="float: right;">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <!-- 开票记录 -->
                <el-tab-pane name="third">
                    <span class="tab-item" slot="label">开票记录</span>
                    <div class="third">
                        <!--查询表单-->
                        <el-form class="query-form" label-position="left" size="small" :inline="true" :model="dsQuery_2" label-width='70px' style="margin-top: 10px;">
                            <el-form-item label="合同名称">
                                <el-input v-model="dsQuery_2.contractName" clearable placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="initTableDataInvoiceInfo(1)">查询</el-button>
                                <el-button type="primary" @click="clearQueryInvoiceInfo">清空</el-button>
                            </el-form-item>
                            <el-form-item>
                                &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base" @click='queryShow3 = !queryShow3; '>更多查询条件<i :class="'iconfont icon-'+queryShow3"></i></a>
                            </el-form-item>
                            <div v-show="queryShow3">
                                <div class="input-box">
                                    <el-form-item label="客户名称">
                                        <el-input v-model="dsQuery_2.cus_name" clearable placeholder=""></el-input>
                                    </el-form-item>
                                    <el-form-item label="票据类型">
                                        <el-select v-model="dsQuery_2.type" clearable placeholder="请选择">
                                          <el-option
                                            v-for="item in pjlx"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                          </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="开票日期" label-width="120">
                                        <el-date-picker
                                            v-model="dsQuery_2.invoice_time"
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
                            <el-button type="primary" size="small" @click="add_invoice_info">新增</el-button>
                            <el-button type="primary" size="small" @click="edit_invoice_info">编辑</el-button>
                            <el-button type="primary" size="small" @click="delInvoiceInfo">删除</el-button>
                        </el-row>
                        <!--收票表格数据展示-->
                        <el-table ref="table2" class="table" :data="tableData3"
                                max-height="500" border style="width: 100%; margin: 20px 0 0;"
                                header-cell-class-name='text-center'
                                cell-class-name='text-center' :fit='true'
                                @selection-change="handleSelectionChange"
                                @sort-change="sortChange2">
                            <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
                            <el-table-column prop="invoiceTime" label="开票日期" sortable="custom">
                              <template slot-scope="scope">
                                  {{scope.row.invoiceTime.split(' ')[0]}}
                              </template>
                            </el-table-column>
                            <el-table-column prop="invoiceContent" label="票据内容" sortable="custom"></el-table-column>
                            <el-table-column prop="invoiceAmount" label="开票金额" sortable="custom"></el-table-column>
                            <el-table-column prop="customerName" min-width="100" label="客户名称" sortable="custom"></el-table-column>
                            <el-table-column prop="contractName" label="合同名称" sortable="custom"></el-table-column>
                            <el-table-column prop="invoiceType" label="票据类型" sortable="custom"></el-table-column>
                            <el-table-column prop="invoiceNo" label="发票号码" sortable="custom"></el-table-column>
                            <el-table-column prop="agent" label="经办人" sortable="custom"></el-table-column>
                            <el-table-column prop="ownerCname" label="合同负责人" sortable="custom"></el-table-column>
                            <el-table-column prop="remark" label="备注" sortable="custom"></el-table-column>
                            <el-table-column prop="createTime" label="创建时间">
                              <template slot-scope="scope">
                                  {{scope.row.createTime.split(' ')[0]}}
                              </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-pagination v-show="count3" background layout="total,prev, pager, next"
                                        :page-size="pageSize3"
                                        @current-change="initTableDataInvoiceInfo"
                                        :current-page="currentPage3"
                                        :total="count3" style="float: right;">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 新增收款计划模态框 -->
        <el-dialog title="新增收款计划" @open="openModal" @close="closePaymentRecord" width="600px" class="dialogPaymentRecord" :visible.sync="dialogPaymentPlanVisible" :close-on-click-modal='false'>
            <el-form ref="paymentRecordAdd" :rules="plan_receipt_rules" :model="paymentRecordAdd" label-width="120px" size="small">
                <el-form-item  label="合同名称" prop="contractId">
                  <el-select v-model="paymentRecordAdd.contractId" size="small" @change="changeContract" filterable clearable placeholder="请输入合同名称">
                    <el-option
                      v-for="item in contracts"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.id + '/' + item.contracAmount + '/' + item.signatoryTime + '/' + item.customerId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="客户名称" prop="customerId">
                  <el-select disabled v-model="paymentRecordAdd.customerId" size="small" filterable clearable placeholder="">
                    <el-option
                      v-for="item in customers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="收款总金额" prop="contractAmount">
                  <el-input disabled v-model="paymentRecordAdd.contractAmount"></el-input>
                </el-form-item>
                <el-form-item label="签约日期：" prop="signingTime">
                  <el-input disabled v-model="paymentRecordAdd.signingTime"></el-input>
                </el-form-item>
            </el-form>

            <table>
              <tr>
                <th>期数</th>
                <th>计划付款日期</th>
                <th>计划付款金额</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
              <tr>
                <td><el-input v-model="receiptObj.receiptNum" style="width: 80px;"></el-input></td>
                <td><el-date-picker v-model="receiptObj.planReceiptTime" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 180px;"></el-date-picker></td>
                <td><el-input v-model="receiptObj.planPaymentAmount" style="width: 120px;"></el-input></td>
                <td><el-input v-model="receiptObj.remark" style="width: 80px;"></el-input></td>
                <td @click="save_add">确定</td>
              </tr>
              <tr v-for="(item, index) in tableData1_1" :key="index">
                <td>{{item.receiptNum}}</td>
                <td>{{item.planReceiptTime}}</td>
                <td>{{item.planPaymentAmount}}</td>
                <td>{{item.remark}}</td>
                <td>
                  <a class="operating iconfont el-icon-remove" @click="del_receipt_plan(index)"></a>
                </td>
              </tr>
              <tr>
                <td>合计</td>
                <td colspan="4">{{totalAmountAdd() || ''}}</td>
              </tr>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPaymentPlanVisible = false">取 消</el-button>
                <el-button type="primary" @click="receiptSave('paymentRecordAdd')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑收款计划模态框 -->
        <el-dialog title="编辑收款计划" @open="openModal" width="600px" class="dialogPaymentRecord" :visible.sync="dialogEditPaymentPlanVisible" :close-on-click-modal='false'>
            <el-form ref="receiptPlanEdit" :model="receiptPlanEdit" label-width="120px" size="small">

                <el-form-item  label="合同名称" prop="contractName">
                  <el-select disabled v-model="receiptPlanEdit.contractName" size="small" filterable clearable placeholder="请输入合同名称">
                    <el-option
                      v-for="item in contracts"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.contractName + '/' + item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="客户名称" prop="customerId">
                    <el-select disabled v-model="receiptPlanEdit.customerId" size="small" filterable clearable placeholder="请输入客户名称">
                      <el-option
                        v-for="item in customers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item  label="收款总金额" prop="contractAmount">
                    <el-input disabled v-model="receiptPlanEdit.contractAmount"></el-input>
                  </el-form-item>
                  <el-form-item label="签约日期：" prop="signingTime">
                      <el-date-picker disabled
                          v-model="receiptPlanEdit.signingTime"
                          type="date"
                          placeholder="选择日期">
                      </el-date-picker>
                  </el-form-item>
            </el-form>
            <table>
              <tr>
                <th>期数</th>
                <th>计划付款日期</th>
                <th>计划付款金额</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
              <tr>
                <td><el-input v-model="receiptObj.receiptNum" style="width: 80px;"></el-input></td>
                <td><el-date-picker v-model="receiptObj.planReceiptTime" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 180px;"></el-date-picker></td>
                <td><el-input v-model="receiptObj.planPaymentAmount" style="width: 120px;"></el-input></td>
                <td><el-input v-model="receiptObj.remark" style="width: 80px;"></el-input></td>
                <td @click="save_edit">确定</td>
              </tr>
              <tr v-for="(item, index) in tableData1_2" :key="index">
                <td>{{item.receiptNum}}</td>
                <td>{{item.planReceiptTime}}</td>
                <td>{{item.planPaymentAmount}}</td>
                <td>{{item.remark}}</td>
                <td>
                  <!-- <a class="operating iconfont el-icon-circle-plus"></a> -->
                  <a class="operating iconfont el-icon-remove" @click="del_receipt_plan_edit(index)"></a>
                </td>
              </tr>
              <tr>
                <td>合计</td>
                <td colspan="4">{{totalAmountEdit() || ''}}</td>
              </tr>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditPaymentPlanVisible = false">取 消</el-button>
                <el-button type="primary" @click="receiptPlanEditSave('receiptPlanEdit')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增收款记录模态框 -->
        <el-dialog title="新增收款记录" @open="openModal" @close="closeReceiptRecord" width="600px" class="dialogPaymentRecord" :visible.sync="dialogReceiptRecordVisible" :close-on-click-modal='false'>
            <el-form ref="receiptRecordAdd" :rules="receipt_record_rules" :model="receiptRecordAdd" label-width="120px" size="small">

                <el-form-item  label="合同名称" prop="contractId">
                  <el-select v-model="receiptRecordAdd.contractId" size="small" @change="changeContract" filterable clearable placeholder="请输入合同名称">
                    <el-option
                      v-for="item in contracts"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.id + '/' + item.customerId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="客户名称" prop="customerId">
                  <el-select disabled v-model="receiptRecordAdd.customerId" size="small" filterable clearable placeholder="">
                    <el-option
                      v-for="item in customers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-for="(item,index) in receiptRecordAddLabel" :key="index" :label="item.label" :prop="item.name">

                    <el-input v-if="item.editorType == 'text'" v-model="receiptRecordAdd[item.name]"></el-input>
                    <el-date-picker v-if="item.editorType == 'date'" v-model="receiptRecordAdd[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        type="date" placeholder="选择日期时间">
                    </el-date-picker>

                    <el-select v-if="item.editorType == 'dict'" v-model="receiptRecordAdd[item.name]">
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
                      v-model="receiptRecordAdd[item.name]">
                    </el-cascader>
                </el-form-item>
                <el-form-item  label="收款人" prop="receipterCname">
                  <el-form-item>
                      <el-select v-model="receiptRecordAdd.receipterCname" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogReceiptRecordVisible = false">取 消</el-button>
                <el-button type="primary" @click="receiptRecordSave('receiptRecordAdd')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑收款记录模态框 -->
        <el-dialog title="编辑收款记录" @open="openModal" width="600px" class="dialogPaymentRecord" :visible.sync="dialogEditReceiptRecordVisible" :close-on-click-modal='false'>
            <el-form ref="receiptRecordEdit" :rules="receipt_record_rules" :model="receiptRecordEdit" label-width="120px" size="small">
                <el-form-item  label="合同名称" prop="contractId">
                  <el-select disabled v-model="receiptRecordEdit.contractId" size="small" filterable clearable placeholder="请输入合同名称">
                    <el-option
                      v-for="item in contracts"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="客户名称" prop="customerId">
                  <el-select disabled v-model="receiptRecordEdit.customerId" size="small" filterable clearable placeholder="请输入客户名称">
                    <el-option
                      v-for="item in customers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-for="(item,index) in receiptRecordFieldList" :key="index" :label="item.label" :prop="item.name">

                    <el-input v-if="item.editorType == 'text'" v-model="receiptRecordEdit[item.name]"></el-input>
                    <el-date-picker v-if="item.editorType == 'date'" v-model="receiptRecordEdit[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        type="date" placeholder="选择日期时间">
                    </el-date-picker>

                    <el-select v-if="item.editorType == 'dict'" v-model="receiptRecordEdit[item.name]">
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
                      v-model="receiptRecordEdit[item.name]">
                    </el-cascader>
                </el-form-item>
                <el-form-item  label="收款人" prop="receipterCname">
                  <el-form-item>
                      <el-select v-model="receiptRecordEdit.receipterCname" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditReceiptRecordVisible = false">取 消</el-button>
                <el-button type="primary" @click="receiptRecordEditSave('receiptRecordEdit')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增开票记录模态框 -->
        <el-dialog title="新增开票记录" @open="openModal" @close="closeInvoiceInfo" width="600px" class="dialogPaymentRecord" :visible.sync="dialogInvoiceInfoVisible" :close-on-click-modal='false'>
            <el-form ref="invoiceInfoAdd" :rules="invoice_info_rules" :model="invoiceInfoAdd" label-width="120px" size="small">
                <el-form-item  label="合同名称" prop="contractId">
                  <el-select v-model="invoiceInfoAdd.contractId" size="small" @change="changeContract" filterable clearable placeholder="请输入合同名称">
                    <el-option
                      v-for="item in contracts"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.id + '/' + item.customerId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="客户名称" prop="customerId">
                  <el-select disabled v-model="invoiceInfoAdd.customerId" size="small" filterable clearable placeholder="请输入客户名称">
                    <el-option
                      v-for="item in customers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-for="(item,index) in invoiceInfoAddLabel" :key="index" :label="item.label" :prop="item.name">

                    <el-input v-if="item.editorType == 'text'" v-model="invoiceInfoAdd[item.name]"></el-input>
                    <el-date-picker v-if="item.editorType == 'date'" v-model="invoiceInfoAdd[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        type="date" placeholder="选择日期时间">
                    </el-date-picker>

                    <el-select v-if="item.editorType == 'dict'" v-model="invoiceInfoAdd[item.name]">
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
                      v-model="invoiceInfoAdd[item.name]">
                    </el-cascader>
                </el-form-item>
                <el-form-item  label="经办人" prop="agent">
                  <el-form-item>
                      <el-select v-model="invoiceInfoAdd.agent" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogInvoiceInfoVisible = false">取 消</el-button>
                <el-button type="primary" @click="invoiceInfoSave('invoiceInfoAdd')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑开票记录模态框 -->
        <el-dialog title="新增开票记录" @open="openModal" width="600px" class="dialogPaymentRecord" :visible.sync="dialogEditInvoiceInfoVisible" :close-on-click-modal='false'>
            <el-form ref="invoiceInfoEdit" :rules="invoice_info_rules" :model="invoiceInfoEdit" label-width="120px" size="small">
                <el-form-item  label="合同名称" prop="contractId">
                  <el-select disabled v-model="invoiceInfoEdit.contractId" size="small" filterable clearable placeholder="请输入合同名称">
                    <el-option
                      v-for="item in contracts"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="客户名称" prop="customerId">
                  <el-select disabled v-model="invoiceInfoEdit.customerId" size="small" filterable clearable placeholder="请输入客户名称">
                    <el-option
                      v-for="item in customers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-for="(item,index) in invoiceInfoFieldList" :key="index" :label="item.label" :prop="item.name">

                    <el-input v-if="item.editorType == 'text'" v-model="invoiceInfoEdit[item.name]"></el-input>
                    <el-date-picker v-if="item.editorType == 'date'" v-model="invoiceInfoEdit[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        type="datetime" placeholder="选择日期时间">
                    </el-date-picker>

                    <el-select v-if="item.editorType == 'dict'" v-model="invoiceInfoEdit[item.name]">
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
                      v-model="invoiceInfoEdit[item.name]">
                    </el-cascader>
                </el-form-item>
                <el-form-item  label="经办人" prop="agent">
                  <el-form-item>
                      <el-select v-model="invoiceInfoEdit.agent" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditInvoiceInfoVisible = false">取 消</el-button>
                <el-button type="primary" @click="invoiceInfoEditSave('invoiceInfoEdit')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script src="../js/receipt.js">
</script>
<style lang="less" scoped>
    .el-main{
        padding-top: 10px;
    }
    .main{
        .el-tabs{
            height: 100%;
        }
        .tab-item{
            display: block;
            width: 100px;
            text-align: center;
        }
    }
    .query-form{
        .el-input, .el-select, .el-date-picker{
            width: 250px;
            margin-right: 30px;
        }
    }
    .dialogReceipt, .dialogDeploy, .dialogPaymentPlan, .dialogPaymentRecord, .dialogReceiptRecord{
        .el-input, .el-select, .el-textarea{
            width: 330px;
        }
    }
</style>
