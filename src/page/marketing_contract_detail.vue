<template>
    <div class="wrap bg-white">
        <!-- 头部 -->
        <div class="handle-box">
            <div class="header-top">
                <span class="header-name">{{contract.contractName}}合同</span>
                <span>&nbsp;&nbsp;负责人：{{contract.ownerCname}}</span>
                <span>&nbsp;&nbsp;合同状态：{{contract.contractState}}</span>
            </div>

            <el-row>
                <el-button type="primary" size="mini" @click="goBack">返回</el-button>
                <el-button type="primary" size="mini" @click="openReceiptPlan">管理收款计划</el-button>
                <el-button type="primary" size="mini" @click="turnOther">转给他人</el-button>&nbsp;&nbsp;
                <el-dropdown trigger="click" @command="handleCommand">
                  <el-button type="primary" size="mini">
                      编辑<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>&nbsp;&nbsp;
                  <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="editContract">合同详情</el-dropdown-item>
                      <el-dropdown-item @click.native="editOpenTicket">开票记录</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button type="primary" size="mini" @click="delContract">删除</el-button>
            </el-row>
        </div>
        <div style="height: 20px; background: #fafafa;"></div>
        <!-- 标签页内容 -->
        <div class="main">
            <el-tabs v-model="activeName">
                <!-- 基本信息 -->
                <el-tab-pane name="first">
                    <span class="tab-item" slot="label">基本信息</span>
                    <div class="first">
                        <div class='first-left-box'>
                            <div class="first-left">
                                <div class="title">基本信息</div>
                                  <p style="margin-bottom: 20px;" v-show="isContractEdit">
                                      <el-button type="primary" size="mini" @click="contractSave">保存</el-button>
                                      <el-button type="info" size="mini" @click="cancelContractEdit">取消</el-button>
                                  </p>
                                  <el-form ref="contractEdit" :inline="true" :rules="contract_rules" :model="contractEdit" label-position="left" label-width="120px" size="small">

                                    <el-form-item  label="客户名称" prop="customerName">
                                      <el-input :disabled="true" v-model="contractEdit.customerName"></el-input>
                                    </el-form-item>
                                    <el-form-item  label="合同编号" prop="contractNo">
                                      <el-input :disabled="true" v-model="contractEdit.contractNo"></el-input>
                                    </el-form-item>
                                    <el-form-item v-for="(item,index) in contractFieldList" :key="index" :label="item.label" :prop="item.name">
                                        <el-input  :disabled="!isContractEdit || item.name == 'contractNo'" v-if="item.editorType == 'text'" :prop="item.name" v-model="contractEdit[item.name]"></el-input>
                                        <el-date-picker :disabled="!isContractEdit" v-if="item.editorType == 'date'" v-model="contractEdit[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                            type="date" placeholder="选择日期时间">
                                        </el-date-picker>
                                        <el-select :disabled="!isContractEdit" v-if="item.editorType == 'dict'" v-model="contractEdit[item.name]">
                                            <el-option
                                            v-if="item.editorType == 'dict'"
                                            v-for="value in item.selectList"
                                            :key="value"
                                            :label="value"
                                            :value="value">
                                            </el-option>
                                        </el-select>
                                        <el-cascader
                                            :disabled="!isContractEdit"
                                            v-if="item.editorType == 'cascade'"
                                            size="small"
                                            :options="options"
                                            v-model="contractEdit[item.name]">
                                        </el-cascader>
                                    </el-form-item>

                                    <el-form-item  label="财务经理" prop="financialManagerName">
                                      <el-select :disabled="!isContractEdit" v-model="contractEdit.financialManagerName" size="small" filterable clearable placeholder="请选择财务经理">
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
                                    <el-form-item  label="拥有者" prop="ownerCname">
                                      <el-form-item>
                                          <el-select :disabled="true" v-model="contractEdit.ownerCname" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
                            </div>
                            <!-- <div class="first-left" style="margin-top: 20px;">
                                <div class="title">收款信息</div>
                                <el-form :disabled="!isEdit || item.name == 'name'" label-width="130px">
                                    <el-form-item label="已开票金额：">
                                        <el-input v-model="formBasicInfo.name" size="small"></el-input>
                                    </el-form-item>
                                    <el-form-item label="已收款金额：">
                                        <el-input v-model="formBasicInfo.name" size="small"></el-input>
                                    </el-form-item>
                                    <el-form-item label="未收款金额：">
                                        <el-input v-model="formBasicInfo.name" size="small"></el-input>
                                    </el-form-item>
                                    <el-form-item label="未开票金额：">
                                        <el-input v-model="formBasicInfo.name" size="small"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div> -->
                        </div>
                        <div class="first-right">
                          <div class="title">开票信息</div>
                            <div class="second">
                              <p style="margin-bottom: 20px;" v-show="isOpenTicketEdit">
                                      <el-button type="primary" size="mini" @click="openTicketSave">保存</el-button>
                                      <el-button type="info" size="mini" @click="cancelOpenTicketEdit">取消</el-button>
                                  </p>
                              <el-form ref="openTicketEdit" :rules="ticket_rules" :model="openTicketEdit" label-width="120px" size="small">
                                <el-form-item v-for="(item,index) in openTicketFieldList" :key="index" :label="item.label" :prop="item.name">
                                  <el-input :disabled="!isOpenTicketEdit" v-if="item.editorType == 'text'" v-model="openTicketEdit[item.name]"></el-input>
                                </el-form-item>
                              </el-form>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <!-- 收款计划 -->
                <el-tab-pane name="second">
                    <span class="tab-item" slot="label" @click="getReceiptPlan">收款计划</span>
                    <div class="second">
                        <p>计划收款总金额：￥{{contract.contracAmount || 0}}&nbsp;&nbsp;&nbsp;&nbsp;
                          已收款总金额： ￥{{alreadyReceipt}}&nbsp;&nbsp;&nbsp;&nbsp;
                          未收款总金额：￥{{contract.contracAmount - alreadyReceipt}}
                        </p>
                        <el-button type="primary" size="mini" @click='openReceiptPlan'>管理收款计划</el-button>
                        <el-button type="primary" size="mini" @click='setupFinishSave(contract.id)'>设置完成</el-button>
                        <el-table
                            :data="receiptPlanList"
                            max-height="500"
                            border @selection-change="handleSelectionChange"
                            :row-style="{'text-align': 'center', 'color': '#333'}"
                            :header-cell-style="{'text-align': 'center', 'background': '#f2f2f2', 'border-color': '#fff', 'color': '#333'}"
                            style="width: 100%">
                            <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
                            <el-table-column prop="receiptNum" label="收款期数"></el-table-column>
                            <el-table-column prop="planReceiptTime"  label="收款日期"></el-table-column>
                            <el-table-column prop="planPaymentAmount" label="计划收款金额"></el-table-column>
                            <el-table-column prop="remark" label="备注"></el-table-column>
                            <el-table-column prop="receiptstate" label="收款状态"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <!-- 收款 -->
                <el-tab-pane name="third">
                    <span class="tab-item" slot="label" @click="getReceiptInfo">收款</span>
                    <div class="third">
                        <p>计划收款总金额：￥{{contract.contracAmount || 0}}&nbsp;&nbsp;&nbsp;&nbsp;
                          已收款总金额： ￥{{alreadyReceipt}}&nbsp;&nbsp;&nbsp;&nbsp;
                          未收款总金额：￥{{contract.contracAmount - alreadyReceipt}}
                        </p>
                        <el-table
                            :data="receiptInfoList"
                            max-height="500"
                            border
                            :row-style="{'text-align': 'center', 'color': '#333'}"
                            :header-cell-style="{'text-align': 'center', 'background': '#f2f2f2', 'border-color': '#fff', 'color': '#333'}"
                            style="width: 100%">
                            <el-table-column prop="receiptActualTime"  label="收款日期"></el-table-column>
                            <el-table-column prop="receiptAmount" label="收款金额"></el-table-column>
                            <el-table-column prop="payType" label="付款方式"></el-table-column>
                            <el-table-column prop="receiptType" label="收款类型"></el-table-column>
                            <el-table-column prop="receipterCname" label="收款人"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <!-- 开票 -->
                <el-tab-pane name="forth">
                    <span class="tab-item" slot="label" @click="getInvioceInfo">开票</span>
                    <div class="forth">
                        <p>合同总金额：￥{{contract.contracAmount}}&nbsp;&nbsp;&nbsp;&nbsp;
                          已开票总金额： ￥{{alreadyInvoiceAmount}}&nbsp;&nbsp;&nbsp;&nbsp;
                          未开票总金额：￥{{contract.contracAmount - alreadyInvoiceAmount}}</p>
                        <el-table
                            :data="invoiceInfoList"
                            max-height="500"
                            border
                            :row-style="{'text-align': 'center', 'color': '#333'}"
                            :header-cell-style="{'text-align': 'center', 'background': '#f2f2f2', 'border-color': '#fff', 'color': '#333'}"
                            style="width: 100%">
                            <el-table-column prop="invoiceTime" label="开票日期"></el-table-column>
                            <el-table-column prop="invoiceContent"  label="票据内容"></el-table-column>
                            <el-table-column prop="invoiceAmount" label="开票金额"></el-table-column>
                            <el-table-column prop="invoiceType" label="票据类型"></el-table-column>
                            <el-table-column prop="invoiceNo" label="发票编号"></el-table-column>
                            <el-table-column prop="agent" label="经办人"></el-table-column>
                            <el-table-column prop="ownerCname" label="合同负责人"></el-table-column>
                            <el-table-column prop="remark" label="备注"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <!-- 附件 -->
                <el-tab-pane name="tab6">
                    <span class="tab-item" slot="label" @click="getAttachs">附件</span>
                    <div class="sixth">
                        <el-button type="primary" size="small" style="margin-bottom: 10px;" @click="dialogAnnexVisible = true">上传附件</el-button>
                        <el-table
                            :data="annexList"
                            max-height="500"
                            border
                            :row-style="{'text-align': 'center', 'color': '#333'}"
                            :header-cell-style="{'text-align': 'center', 'background': '#f2f2f2', 'border-color': '#fff', 'color': '#333'}"
                            style="width: 100%">
                            <el-table-column prop="fileName" label="附件名称" width="180"></el-table-column>
                            <el-table-column prop="fileSizeStr"  label="大小" width="180"></el-table-column>
                            <el-table-column prop="remark" label="备注"></el-table-column>
                            <el-table-column prop="upUserCname" label="上传人"></el-table-column>
                            <el-table-column label="创建时间">
                                <template slot-scope="scope">
                                    {{formatDate(new Date(scope.row.upTime), 'yyyy-MM-dd hh:mm:ss')}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <a class="operating" @click="downLoadAnnex(scope.row.id)">下载</a>
                                    <a class="operating" @click="delAnnex(scope.row.id, scope.row.fileName, scope.$index, annexList)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <!-- 操作日志 -->
                <el-tab-pane name="fifth">
                    <span class="tab-item" slot="label" @click="getOperateLog">操作日志</span>
                    <div class="fifth">
                        <el-table
                            :data="operateLog"
                            max-height="500"
                            border
                            :row-style="{'text-align': 'center', 'color': '#333'}"
                            :header-cell-style="{'text-align': 'center', 'background': '#f2f2f2', 'border-color': '#fff', 'color': '#333'}"
                            style="width: 100%">
                            <el-table-column prop="createTime" label="操作时间"></el-table-column>
                            <el-table-column prop="createUserCname" label="操作人"></el-table-column>
                            <!-- <el-table-column prop="moduleName" label="操作类型"></el-table-column> -->
                            <el-table-column prop="content" label="备注"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 新增收款模态框 -->
        <el-dialog title="新增收款" width="600px" class="dialogReceipt" :visible.sync="dialogReceiptVisible" :close-on-click-modal='false'>
            <el-form ref="form" :model="formAddReceipt" label-width="120px" size="small">
                <el-form-item label="客户名称：">
                    <el-select v-model="formAddReceipt.origin" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合同名称：">
                    <el-select v-model="formAddReceipt.origin" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款日期：">
                    <el-date-picker
                        v-model="formAddReceipt.value1"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="收款金额：">
                    <el-input v-model="formAddReceipt.name"></el-input>
                </el-form-item>
                <el-form-item label="收款期数：">
                    <el-select v-model="formAddReceipt.origin">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款方式：">
                    <el-select v-model="formAddReceipt.origin">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款类型：">
                    <el-select v-model="formAddReceipt.origin">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款人：">
                    <el-select v-model="formAddReceipt.origin">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="formAddReceipt.mail" rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogReceiptVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogReceiptVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增开票记录模态框 -->
        <el-dialog title="新增开票记录" width="600px" class="dialogInvoicing" :visible.sync="dialogInvoicingVisible" :close-on-click-modal='false'>
            <el-form ref="form" :model="formAddInvoicing" label-width="120px" size="small">
                <el-form-item label="客户名称：">
                    <el-select v-model="formAddInvoicing.origin" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合同标题：">
                    <el-select v-model="formAddInvoicing.origin" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开票日期：">
                    <el-date-picker
                        v-model="formAddInvoicing.value1"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="开票金额：">
                    <el-input v-model="formAddInvoicing.name"></el-input>
                </el-form-item>
                <el-form-item label="票据内容：">
                    <el-input v-model="formAddInvoicing.name"></el-input>
                </el-form-item>
                <el-form-item label="票据类型：">
                    <el-select v-model="formAddInvoicing.origin">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发票号码：">
                    <el-input v-model="formAddInvoicing.name"></el-input>
                </el-form-item>
                <el-form-item label="经办人：">
                    <el-select v-model="formAddInvoicing.origin">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="formAddInvoicing.mail" rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogInvoicingVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogInvoicingVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 配置收款计划模态框 -->
        <el-dialog title="配置收款计划" width="600px" @close="closeReceipttPlan" class="dialogDeploy" :visible.sync="dialogDeployVisible" :close-on-click-modal='false'>
            <el-form ref="formDeploy" :model="formDeploy" label-width="120px" size="small">
                <el-form-item label="客户名称：">
                  <el-input disabled v-model="contract.customerName"></el-input>
                </el-form-item>
                <el-form-item label="合同名称：">
                  <el-input disabled v-model="contract.contractName"></el-input>
                </el-form-item>
                <el-form-item label="合同总金额：">
                  <el-input disabled v-model="contract.contracAmount"></el-input>
                </el-form-item>
                <el-form-item label="签约日期：">
                  <el-input disabled v-model="contract.signatoryTime"></el-input>
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
                  <!-- <a class="operating iconfont el-icon-circle-plus"></a> -->
                  <a class="operating iconfont el-icon-remove" @click="del_receipt_plan(index)"></a>
                </td>
              </tr>
              <tr>
                <td>计划收款金额合计：</td>
                <td colspan="4">{{totalAmountAdd() || ''}}</td>
              </tr>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogDeployVisible = false">取 消</el-button>
                <el-button type="primary" @click="receiptSave(contract.customerId, contract.id)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 转给他人模态框 -->
        <el-dialog title="转给他人" width="600px" class="dialogTransfer" :visible.sync="dialogTransferVisible" :close-on-click-modal='false'>
            <el-form ref="form" :model="formTransfer" label-width="120px" size="small">
                <el-form-item label="转移对象：">
                    合同名称【{{contract.contractName}}】
                </el-form-item>
                <el-form-item label="新拥有者：">
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
        <!-- 上传附件 -->
        <el-dialog title="上传附件" :visible.sync="dialogAnnexVisible" @close="closeAnnex" :close-on-click-modal='false' width="550px">
            <el-form labelPosition="left" label-width="60px">
                <el-form-item label="附件：">
                    <div>
                        <el-button size="small" type="primary" @click="chooseAnnex">选择文件</el-button><span style="color: #409EFF;margin-left: 10px;">单个文件最大支持100MB，上传请耐心等待</span>
                        <p style="line-height: 24px" v-for="(item, index) in files" :key="index">{{item.name}}
                            <a style="float: right; color: #409EFF;" @click="delFile(index)">删除</a>
                        </p>
                    </div>
                    <input ref="annexInput" @change="changeFile" type="file" multiple v-show="false">
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea"  :autosize="{ minRows: 2}" maxlength="200" v-model="annexRemarks" placeholder="请填写备注(200字以内)"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAnnexVisible = false">取 消</el-button>
                <el-button type="primary" @click="annexSave">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script src="../js/marketing_contract_detail.js">
</script>
<style lang="less">
    @import url('../style/marketing_contract_detail.less');
</style>
