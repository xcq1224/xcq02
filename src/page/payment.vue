<template>
    <div class="wrap">
        <!-- 标签页内容 -->
        <div class="main">
            <el-tabs v-model="activeName">
                <!-- 付款计划 -->
                <el-tab-pane name="first">
                    <span class="tab-item" slot="label">付款计划</span>
                    <div class="first">
                        <!--查询表单-->
                        <el-form class="query-form" label-position="left" size="small" :inline="true" :model="dsQuery_1" label-width='70px' style="margin-top: 10px;">
                            <el-form-item label="合同名称">
                                <el-input v-model="dsQuery_1.contractName" clearable placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base" @click='queryShow1 = !queryShow1; '>更多查询条件<i :class="'iconfont icon-'+queryShow1"></i></a>
                            </el-form-item>
                            <div v-show="queryShow1">
                                <div class="input-box">
                                    <el-form-item label="分包商">
                                        <el-input v-model="dsQuery_1.sub_contract" clearable placeholder=""></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                        </el-form>
                        <!-- 操作按钮 -->
                        <el-row>
                            <el-button type="primary" size="small" @click="dialogPaymentPlanVisible = true">新增</el-button>
                            <el-button type="primary" size="small" @click="edit_payment_plan">编辑</el-button>
                            <el-button type="primary" size="small" @click="delPaymentPlan">删除</el-button>
                        </el-row>
                        <!--付款计划表格数据展示-->
                        <el-table ref="table" class="table" :data="tableData1"
                                max-height="500" border style="width: 100%; margin: 20px 0 0;"
                                header-cell-class-name='text-center'
                                cell-class-name='text-center' :fit='true'
                                @selection-change="handleSelectionChange"
                                :default-sort="{prop: '', order: 'descending'}">

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
                                  <tr v-for="(item, index) in props.row.paymentList" :key="index">
                                    <td>{{item.paymentNum}}</td>
                                    <td>{{item.planPaymentTime}}</td>
                                    <td>{{item.planPaymentAmount}}</td>
                                    <td>{{item.paymentState}}</td>
                                    <td>{{item.remark}}</td>
                                    <el-button type="primary" @click="setupFinishSave(props.row.id, item.paymentId)">设置完成</el-button>
                                  </tr>
                                </table>
                              </template>
                            </el-table-column>


                            <el-table-column type="selection" width="40"></el-table-column>
                            <el-table-column prop="subContractName" min-width="100" sortable label="合同名称"></el-table-column>
                            <el-table-column prop="subContractorName" label="分包商"></el-table-column>
                            <el-table-column prop="contractAmount" label="计划付款金额"></el-table-column>
                            <el-table-column prop="unContractAmount" label="未付款金额">
                              <template slot-scope="scope">
                                {{getUnAmount(scope.row)}}
                              </template>
                            </el-table-column>
                            <el-table-column prop="ownerCname" label="合同负责人"></el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-pagination v-show="count1" background layout="total,prev, pager, next"
                                        :page-size="pageSize1"
                                        @current-change="initTableDataPaymentPlan"
                                        :current-page="currentPage1"
                                        :total="count1" style="float: right;">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <!-- 付款记录 -->
                <el-tab-pane name="second">
                    <span class="tab-item" slot="label">付款记录</span>
                    <div class="second">
                        <!--查询表单-->
                        <el-form class="query-form" label-position="left" size="small" :inline="true" :model="dsQuery_2" label-width='70px' style="margin-top: 10px;">
                            <el-form-item label="合同名称">
                                <el-input v-model="dsQuery_2.clue_name" clearable placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="initTableDataPaymentInfo(1)">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base" @click='queryShow2 = !queryShow2; '>更多查询条件<i :class="'iconfont icon-'+queryShow2"></i></a>
                            </el-form-item>
                            <div v-show="queryShow2">
                                <div class="input-box">
                                    <el-form-item label="采购商">
                                        <el-input v-model="dsQuery_2.clue_owner" clearable placeholder=""></el-input>
                                    </el-form-item>
                                    <el-form-item label="逾期状态">
                                        <el-select v-model="dsQuery_2.follow_type" clearable>
                                            <el-option label="全部" value="shanghai"></el-option>
                                            <el-option label="区域二" value="beijing"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="计划付款日期" label-width="120">
                                        <el-date-picker
                                            v-model="dsQuery_2.recent_follow_time"
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
                            <el-button type="primary" size="small" @click="add_payment_record">新增</el-button>
                            <el-button type="primary" size="small" @click="edit_payment_info">编辑</el-button>
                            <el-button type="primary" size="small" @click="delPaymentRecord">删除</el-button>
                        </el-row>
                        <!--付款记录数据展示-->
                        <el-table ref="table1" class="table" :data="tableData2"
                                max-height="500" border style="width: 100%; margin: 20px 0 0;"
                                header-cell-class-name='text-center'
                                cell-class-name='text-center' :fit='true'
                                @selection-change="handleSelectionChange"
                                :default-sort="{prop: '', order: 'descending'}">
                            <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
                            <el-table-column prop="paymentActualTime" label="实际付款日期"></el-table-column>
                            <el-table-column prop="paymentAmount" sortable label="付款金额"></el-table-column>
                            <el-table-column prop="subContractName" min-width="100" sortable label="分包合同"></el-table-column>
                            <el-table-column prop="subContractorName" label="分包商"></el-table-column>
                            <el-table-column prop="paymentNum" label="付款期数"></el-table-column>
                            <el-table-column prop="payType" label="付款方式"></el-table-column>
                            <el-table-column prop="paymentType" label="付款类型"></el-table-column>
                            <el-table-column prop="ownerCname" label="付款人"></el-table-column>
                            <el-table-column prop="createUserCname" label="创建人"></el-table-column>
                            <el-table-column prop="createTime" label="创建时间">
                              <template slot-scope="scope">
                                  {{scope.row.createTime.split(' ')[0]}}
                              </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-pagination v-show="count2" background layout="total,prev, pager, next"
                                        :page-size="pageSize2"
                                        @current-change="initTableDataPaymentPlan"
                                        :current-page="currentPage1"
                                        :total="count1" style="float: right;">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <!-- 收票记录 -->
                <el-tab-pane name="third">
                    <span class="tab-item" slot="label">收票记录</span>
                    <div class="third">
                        <!--查询表单-->
                        <el-form class="query-form" label-position="left" size="small" :inline="true" :model="dsQuery_3" label-width='70px' style="margin-top: 10px;">
                            <el-form-item label="合同名称">
                                <el-input v-model="dsQuery_3.contractName" clearable placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="initTableDataCollectTicket(1)">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base" @click='queryShow3 = !queryShow3; '>更多查询条件<i :class="'iconfont icon-'+queryShow3"></i></a>
                            </el-form-item>
                            <div v-show="queryShow3">
                                <div class="input-box">
                                    <el-form-item label="分包商">
                                        <el-input v-model="dsQuery_3.sub_contract" clearable placeholder=""></el-input>
                                    </el-form-item>
                                    <el-form-item label="票据类型">
                                        <el-select v-model="dsQuery_3.type" clearable placeholder="请选择">
                                          <el-option
                                            v-for="item in pjlx"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                          </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="收票日期" label-width="120">
                                        <el-date-picker
                                            v-model="dsQuery_3.collect_ticket_time"
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
                            <el-button type="primary" size="small" @click="add_collect_ticket">新增</el-button>
                            <el-button type="primary" size="small" @click="edit_collect_ticket">编辑</el-button>
                            <el-button type="primary" size="small" @click="delCollectTicket">删除</el-button>
                        </el-row>
                        <!--收票表格数据展示-->
                        <el-table ref="table2" class="table" :data="tableData3"
                                max-height="500" border style="width: 100%; margin: 20px 0 0;"
                                header-cell-class-name='text-center'
                                cell-class-name='text-center' :fit='true'
                                @selection-change="handleSelectionChange"
                                :default-sort="{prop: '', order: 'descending'}">
                            <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
                            <el-table-column prop="collectTicketTime" label="收票日期">
                              <template slot-scope="scope">
                                  {{scope.row.collectTicketTime.split(' ')[0]}}
                              </template>
                            </el-table-column>
                            <el-table-column prop="subContractName" label="分包合同"></el-table-column>
                            <el-table-column prop="subContractorName" min-width="100" sortable label="分包商"></el-table-column>
                            <el-table-column prop="collectTicketContent" label="票据内容"></el-table-column>
                            <el-table-column prop="collectTicketAmount" sortable label="收票金额"></el-table-column>
                            <el-table-column prop="collectTicketType" label="票据类型"></el-table-column>
                            <el-table-column prop="collectTicketNo" label="发票编号"></el-table-column>
                            <el-table-column prop="agent" label="经办人"></el-table-column>
                            <el-table-column prop="ownerCname" label="合同负责人"></el-table-column>
                            <el-table-column prop="remark" label="备注"></el-table-column>
                            <el-table-column prop="createTime" label="创建日期">
                              <template slot-scope="scope">
                                  {{scope.row.createTime.split(' ')[0]}}
                              </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-pagination v-show="count3" background layout="total,prev, pager, next"
                                        :page-size="pageSize3"
                                        @current-change="initTableDataPaymentPlan"
                                        :current-page="currentPage1"
                                        :total="count1" style="float: right;">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 新增付款计划模态框 -->
        <el-dialog title="新增付款计划" width="600px" @open="openModal" @close="closePaymentPlan" class="dialogPaymentPlan" :visible.sync="dialogPaymentPlanVisible" :close-on-click-modal='false'>
            <el-form ref="formPaymentPlan" :rules="payment_plan_rules" :model="formPaymentPlan" label-width="120px" size="small">
                <el-form-item label="分包合同：" prop="subContractId">
                    <el-select v-model="formPaymentPlan.subContractId" size="small" @change="changeContract" filterable clearable placeholder="请选择分包合同">
                    <el-option
                      v-for="item in purchaseContracts"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.id + '/' + item.contracAmount + '/' + item.signatoryTime + '/' + item.purchasersId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分包商：" prop="subContractorId">
                    <el-select disabled v-model="formPaymentPlan.subContractorId" size="small" filterable clearable placeholder="">
                    <el-option
                      v-for="item in subContractors"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="合同总金额：" prop="contractAmount">
                    <el-input disabled v-model="formPaymentPlan.contractAmount"></el-input>
                </el-form-item>
                <el-form-item label="签约日期：" prop="signingTime">
                  <el-input disabled v-model="formPaymentPlan.signingTime"></el-input>
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
                <td><el-input v-model="receiptObj.paymentNum" style="width: 80px;"></el-input></td>
                <td><el-date-picker v-model="receiptObj.planPaymentTime" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 180px;"></el-date-picker></td>
                <td><el-input v-model="receiptObj.planPaymentAmount" style="width: 120px;"></el-input></td>
                <td><el-input v-model="receiptObj.remark" style="width: 80px;"></el-input></td>
                <td @click="save_add">确定</td>
              </tr>
              <tr v-for="(item, index) in tableData1_1" :key="index">
                <td>{{item.paymentNum}}</td>
                <td>{{item.planPaymentTime}}</td>
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
                <el-button type="primary" @click="paymentSave('formPaymentPlan')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑收款计划模态框 -->
        <el-dialog title="编辑付款计划" @open="openModal" width="600px" class="dialogPaymentRecord" :visible.sync="dialogEditPaymentPlanVisible" :close-on-click-modal='false'>
            <el-form ref="paymentPlanEdit" :model="paymentPlanEdit" label-width="120px" size="small">

                <el-form-item label="分包合同：" prop="subContractName">
                    <el-select disabled v-model="paymentPlanEdit.subContractName" size="small" @change="changeContract" filterable clearable placeholder="请选择分包合同">
                    <el-option
                      v-for="item in purchaseContracts"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.contractName + '/' + item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分包商：" prop="subContractorId">
                    <el-select disabled v-model="paymentPlanEdit.subContractorId" size="small" filterable clearable placeholder="请选择分包商">
                    <el-option
                      v-for="item in subContractors"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="合同总金额：" prop="contractAmount">
                    <el-input disabled v-model="paymentPlanEdit.contractAmount"></el-input>
                </el-form-item>
                <el-form-item label="签约日期：" prop="signingTime">
                    <el-date-picker disabled
                        v-model="paymentPlanEdit.signingTime"
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
                <td><el-input v-model="receiptObj.paymentNum" style="width: 80px;"></el-input></td>
                <td><el-date-picker v-model="receiptObj.planPaymentTime" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 180px;"></el-date-picker></td>
                <td><el-input v-model="receiptObj.planPaymentAmount" style="width: 120px;"></el-input></td>
                <td><el-input v-model="receiptObj.remark" style="width: 80px;"></el-input></td>
                <td @click="save_edit">确定</td>
              </tr>
              <tr v-for="(item, index) in tableData1_2" :key="index">
                <td>{{item.paymentNum}}</td>
                <td>{{item.planPaymentTime}}</td>
                <td>{{item.planPaymentAmount}}</td>
                <td>{{item.remark}}</td>
                <td>
                  <a class="operating iconfont el-icon-remove" @click="del_payment_plan_edit(index)"></a>
                </td>
              </tr>
              <tr>
                <td>合计</td>
                <td colspan="4">{{totalAmountEdit() || ''}}</td>
              </tr>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditPaymentPlanVisible = false">取 消</el-button>
                <el-button type="primary" @click="paymentPlanEditSave('paymentPlanEdit')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增付款记录模态框 -->
        <el-dialog title="新增付款记录" width="600px" @open="openModal" @close="closePaymentRecord" class="dialogPaymentRecord" :visible.sync="dialogPaymentRecordVisible" :close-on-click-modal='false'>
            <el-form ref="formPaymentRecord" :rules="payment_record_rules" :model="formPaymentRecord" label-width="120px" size="small">

                <el-form-item label="分包合同：" prop="subContractId">
                    <el-select v-model="formPaymentRecord.subContractId" size="small" @change="changeContract" filterable clearable placeholder="请选择分包合同">
                    <el-option
                      v-for="item in purchaseContracts"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.id + '/' + item.purchasersId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分包商：" prop="subContractorId">
                    <el-select disabled v-model="formPaymentRecord.subContractorId" size="small" filterable clearable placeholder="">
                    <el-option
                      v-for="item in subContractors"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-for="(item,index) in formPaymentRecordLabel" :key="index" :label="item.label" :prop="item.name">

                    <el-input v-if="item.editorType == 'text'" v-model="formPaymentRecord[item.name]"></el-input>
                    <el-date-picker v-if="item.editorType == 'date'" v-model="formPaymentRecord[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        type="date" placeholder="选择日期时间">
                    </el-date-picker>

                    <el-select v-if="item.editorType == 'dict'" v-model="formPaymentRecord[item.name]">
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
                      v-model="formPaymentRecord[item.name]">
                    </el-cascader>
                </el-form-item>
                <el-form-item  label="付款人" prop="paymentCname">
                  <el-form-item>
                      <el-select v-model="formPaymentRecord.paymentCname" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
                <el-button @click="dialogPaymentRecordVisible = false">取 消</el-button>
                <el-button type="primary" @click="paymentRecordSave('formPaymentRecord')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑付款记录模态框 -->
        <el-dialog title="编辑收款记录" @open="openModal" width="600px" class="dialogPaymentRecord" :visible.sync="dialogEditPaymentRecordVisible" :close-on-click-modal='false'>
            <el-form ref="paymentRecordEdit" :rules="payment_record_rules" :model="paymentRecordEdit" label-width="120px" size="small">
                <el-form-item label="分包合同：" prop="subContractId">
                    <el-select disabled v-model="paymentRecordEdit.subContractId" size="small" @change="changeContract" filterable clearable placeholder="请选择分包合同">
                    <el-option
                      v-for="item in purchaseContracts"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分包商：" prop="subContractorId">
                    <el-select disabled v-model="paymentRecordEdit.subContractorId" size="small" filterable clearable placeholder="请选择分包商">
                    <el-option
                      v-for="item in subContractors"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-for="(item,index) in paymentRecordFieldList" :key="index" :label="item.label" :prop="item.name">

                    <el-input v-if="item.editorType == 'text'" v-model="paymentRecordEdit[item.name]"></el-input>
                    <el-date-picker v-if="item.editorType == 'date'" v-model="paymentRecordEdit[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        type="date" placeholder="选择日期时间">
                    </el-date-picker>

                    <el-select v-if="item.editorType == 'dict'" v-model="paymentRecordEdit[item.name]">
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
                      v-model="paymentRecordEdit[item.name]">
                    </el-cascader>
                </el-form-item>
                <el-form-item  label="付款人" prop="paymentCname">
                  <el-form-item>
                      <el-select v-model="paymentRecordEdit.paymentCname" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
                <el-button @click="dialogEditPaymentRecordVisible = false">取 消</el-button>
                <el-button type="primary" @click="paymentRecordEditSave">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增收票记录模态框 -->
        <el-dialog title="新增收票记录" @open="openModal" @close="closeCollectTicket" width="600px" class="dialogReceiptRecord" :visible.sync="dialogCollectTicketVisible" :close-on-click-modal='false'>
            <el-form ref="collectTicketAdd" :rules="collect_ticket_rules" :model="collectTicketAdd" label-width="120px" size="small">
                <el-form-item label="分包合同：" prop="subContractId">
                    <el-select v-model="collectTicketAdd.subContractId" size="small" @change="changeContract" filterable clearable placeholder="请选择分包合同">
                    <el-option
                      v-for="item in purchaseContracts"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.id + '/' + item.purchasersId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分包商：" prop="subContractorId">
                    <el-select disabled v-model="collectTicketAdd.subContractorId" size="small" filterable clearable placeholder="">
                    <el-option
                      v-for="item in subContractors"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-for="(item,index) in collectTicketAddLabel" :key="index" :label="item.label" :prop="item.name">

                    <el-input v-if="item.editorType == 'text'" v-model="collectTicketAdd[item.name]"></el-input>
                    <el-date-picker v-if="item.editorType == 'date'" v-model="collectTicketAdd[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        type="date" placeholder="选择日期时间">
                    </el-date-picker>

                    <el-select v-if="item.editorType == 'dict'" v-model="collectTicketAdd[item.name]">
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
                      v-model="collectTicketAdd[item.name]">
                    </el-cascader>
                </el-form-item>
                <el-form-item  label="经办人" prop="agent">
                  <el-form-item>
                      <el-select v-model="collectTicketAdd.agent" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
                <el-button @click="dialogCollectTicketVisible = false">取 消</el-button>
                <el-button type="primary" @click="collectTicketSave('collectTicketAdd')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑开票记录模态框 -->
        <el-dialog title="新增收票记录" @open="openModal" width="600px" class="dialogPaymentRecord" :visible.sync="dialogEditCollectTicketVisible" :close-on-click-modal='false'>
            <el-form ref="collectTicketEdit" :rules="collect_ticket_rules" :model="collectTicketEdit" label-width="120px" size="small">
                <el-form-item label="分包合同：" prop="subContractId">
                    <el-select disabled v-model="collectTicketEdit.subContractId" size="small" @change="changeContract" filterable clearable placeholder="请选择分包合同">
                    <el-option
                      v-for="item in purchaseContracts"
                      :key="item.id"
                      :label="item.contractName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分包商：" prop="subContractorId">
                    <el-select disabled v-model="collectTicketEdit.subContractorId" size="small" filterable clearable placeholder="请选择分包商">
                    <el-option
                      v-for="item in subContractors"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-for="(item,index) in collectTicketFieldList" :key="index" :label="item.label" :prop="item.name">

                    <el-input v-if="item.editorType == 'text'" v-model="collectTicketEdit[item.name]"></el-input>
                    <el-date-picker v-if="item.editorType == 'date'" v-model="collectTicketEdit[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        type="datetime" placeholder="选择日期时间">
                    </el-date-picker>

                    <el-select v-if="item.editorType == 'dict'" v-model="collectTicketEdit[item.name]">
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
                      v-model="collectTicketEdit[item.name]">
                    </el-cascader>
                </el-form-item>
                <el-form-item  label="经办人" prop="agent">
                  <el-form-item>
                      <el-select v-model="collectTicketEdit.agent" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
                <el-button @click="dialogEditCollectTicketVisible = false">取 消</el-button>
                <el-button type="primary" @click="collectTicketEditSave">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script src="../js/payment.js">
</script>
<style lang="less" scoped>
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
