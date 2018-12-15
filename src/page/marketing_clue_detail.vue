<template>
    <div class="wrap">
        <!-- 头部 -->
        <div class="handle-box">
            <div class="header-top">
                <span class="header-name">线索名称：{{marketingClue.name}}</span>
                <span>&nbsp;&nbsp;线索状态：{{marketingClue.marketingClueState}}</span>
                <span>&nbsp;&nbsp;拥有者：{{marketingClue.ownerCname}}</span>
                <span>&nbsp;&nbsp;参与成员： <i class="iconfont icon-shezhi"  @click="getMembers"></i></span>
            </div>

            <el-row>
                <el-button type="primary" size="mini" @click="goBack">返回</el-button>
                <el-button type="primary" size="mini" v-if="isOwner" @click='dialogContractVisible = true'>转化为机会</el-button>
                <el-button type="primary" size="mini" v-if="isOwner" @click="turnOther">转给他人</el-button>
                <el-button type="primary" size="mini" v-if="isModify" @click="edit_marketing_clue">编辑</el-button>
                <el-button type="primary" size="mini" v-if="isOwner" @click="delMarketingClue()">删除</el-button>
                <el-button type="primary" size="mini" v-if="marketingClue.marketingClueState != '已关闭' && isOwner" @click="dialogClose = true">关闭</el-button>
            </el-row>

        </div>
        <!-- 标签页内容 -->
        <div class="main">
            <el-tabs v-model="activeName">
                <!-- 基本信息 -->
                <el-tab-pane name="first">
                    <span class="tab-item" slot="label">基本信息</span>
                    <div class="first">
                        <div class="first-left">
                            <div class="title">基本信息</div>

                              <p style="margin-bottom: 20px;" v-show="isEdit">
                                  <el-button type="primary" size="mini" @click="marketingClueSave">保存</el-button>
                                  <el-button type="info" size="mini" @click="cancelEdit">取消</el-button>
                              </p>

                              <el-form ref="marketingClueEdit" :rules="marketing_clue_rules" :inline="true" :model="marketingClueEdit" label-position="left" label-width="120px" size="small">
                                <el-form-item  label="客户名称" prop="customerName">
                                  <el-input :disabled="true" v-model="marketingClueEdit.customerName"></el-input>
                                </el-form-item>

                                <el-form-item v-for="(item,index) in marketingClueFieldList" :key="index" :label="item.label" :prop="item.name">
                                    <el-input  :disabled="!isEdit" v-if="item.editorType == 'text'" :prop="item.name" v-model="marketingClueEdit[item.name]"></el-input>
                                    <el-date-picker :disabled="!isEdit" v-if="item.editorType == 'date'" v-model="marketingClueEdit[item.name]" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
                                        type="datetime" placeholder="选择日期时间">
                                    </el-date-picker>
                                    <el-select :disabled="!isEdit" v-if="item.editorType == 'dict'" v-model="marketingClueEdit[item.name]">
                                        <el-option
                                        v-if="item.editorType == 'dict'"
                                        v-for="value in item.selectList"
                                        :key="value"
                                        :label="value"
                                        :value="value">
                                        </el-option>
                                    </el-select>
                                    <el-cascader
                                        :disabled="!isEdit"
                                        v-if="item.editorType == 'cascade'"
                                        size="small"
                                        :options="cityData()"
                                        v-model="marketingClueEdit[item.name]">
                                    </el-cascader>
                                </el-form-item>
                                <el-form-item  label="合作伙伴" prop="partnerName">
                                  <el-select :disabled="!isEdit" v-model="marketingClueEdit.partnerName" size="small" filterable clearable placeholder="请输入合作伙伴">
                                    <el-option
                                      v-for="item in partner"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.name + '/' + item.id">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                                <el-form-item  label="拥有者" prop="ownerCname">
                                      <el-select :disabled="true" v-model="marketingClueEdit.ownerCname" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
                                <el-form-item label="线索状态" prop="marketingClueState">
                                  <el-input :disabled="true" v-model="marketingClueEdit.marketingClueState"></el-input>
                                </el-form-item>
                                <el-form-item label="关闭原因" prop="closeReason" v-if="marketingClue.marketingClueState == '已关闭'">
                                  <el-input :disabled="true" v-model="marketingClueEdit.closeReason"></el-input>
                                </el-form-item>
                                <el-form-item label="关闭人" prop="closePerson" v-if="marketingClue.marketingClueState == '已关闭'">
                                  <el-input :disabled="true" v-model="marketingClueEdit.closePerson"></el-input>
                                </el-form-item>
                                <el-form-item label="关闭时间" prop="closeTime" v-if="marketingClue.marketingClueState == '已关闭'">
                                  <el-input :disabled="true" v-model="marketingClueEdit.closeTime"></el-input>
                                </el-form-item>
                              </el-form>
                        </div>
                        <div class="first-right">
                            <div class="title">营销动态
                                <el-button type="primary" style="float: right; margin-top: 6px;" size="mini" @click="dialogFolowVisible = true">写跟进</el-button>
                            </div>

                            <div class="process">
                                <template v-for="(item, index) in follows">
                                    <div v-show="showDate(index)" class="el-popover el-popper tooltip iconfont date" x-placement="right-start">
                                        <div class="el-popover__title">{{formatDate(new Date(item.followTime))}}</div>
                                        <div x-arrow="" class="popper__arrow" style="top: 12.5px;border-right-color: #0090ff;"></div>
                                    </div>
                                    <div class="el-popover el-popper tooltip iconfont" x-placement="right-start">
                                        <div class="el-popover__title">{{item.createUserCname}}<span class="right">{{formatDate(new Date(item.followTime), "hh:mm")}}</span></div>
                                        <div class="follow-content">{{item.followContent}}</div>
                                        <p>跟进方式：{{item.followType}}</p>
                                        <p>跟进状态：{{item.followStatus}}</p>
                                        <p v-if="item.contactCname">联系人：{{item.contactCname}}</p>
                                        <div x-arrow="" class="popper__arrow" style="top: 12.5px;"></div>
                                    </div>
                                </template>
                              </div>
                        </div>
                    </div>

                </el-tab-pane>

                <!-- 机会 -->
                <el-tab-pane name="second">
                    <span class="tab-item" slot="label" @click="form_opportunity">机会</span>
                    <div class="fifth">
                        <el-table
                            :data="opportunityList"
                            max-height="500"
                            border
                            :row-style="{'text-align': 'center', 'color': '#333'}"
                            :header-cell-style="{'text-align': 'center', 'background': '#f2f2f2', 'border-color': '#fff', 'color': '#333'}"
                            style="width: 100%">
                            <el-table-column prop="opportunityName" label="机会名称" width="180"></el-table-column>
                            <el-table-column prop="amount" label="预计营销金额" width="180"></el-table-column>
                            <el-table-column prop="marketingSection" label="营销阶段"></el-table-column>
                            <el-table-column prop="dealPossible" label="赢单率"></el-table-column>
                            <el-table-column prop="remark" label="备注"></el-table-column>
                            <el-table-column prop="createTime"  label="创建时间"></el-table-column>
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
                            <el-table-column label="操作" v-if="isDownload">
                                <template slot-scope="scope">
                                    <a class="operating" @click="downLoadAnnex(scope.row.id)">下载</a>
                                    <a class="operating" v-if="isOwner" @click="delAnnex(scope.row.id, scope.row.fileName, scope.$index, annexList)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

                <!-- 操作日志 -->
                <el-tab-pane name="fourth">
                    <span class="tab-item" slot="label" @click="getOperateLog">操作日志</span>
                    <div class="seventh">
                        <el-table
                            :data="operateLog"
                            max-height="500"
                            border
                            :row-style="{'text-align': 'center', 'color': '#333'}"
                            :header-cell-style="{'text-align': 'center', 'background': '#f2f2f2', 'border-color': '#fff', 'color': '#333'}"
                            style="width: 100%">
                            <el-table-column prop="createTime" label="操作时间"  width="180"></el-table-column>
                            <el-table-column prop="createUserCname" label="操作人" width="180"></el-table-column>
                            <!-- <el-table-column prop="moduleName" label="操作类型"></el-table-column> -->
                            <el-table-column prop="content" label="备注"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 添加联系人模态框 -->
        <el-dialog title="添加联系人" width="600px" class="dialogAdd" :visible.sync="dialogAddVisible" :close-on-click-modal='false'>
            <el-form ref="form" :model="formAdd" label-width="120px" size="small">
                <el-form-item label="联系人：">
                    <el-select v-model="formAdd.origin" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系人角色：">
                    <el-select v-model="formAdd.origin" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否主联系人：">
                    <el-select v-model="formAdd.origin" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogAddVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 转化为机会模态框 -->
        <el-dialog title="转化为机会" width="600px" @open="openModal" @close="closeModel" class="dialogContract" :visible.sync="dialogContractVisible" :close-on-click-modal='false'>
            <el-form ref="formOpportunity" :rules="form_opportunity_rules" :model="formOpportunity" label-width="120px" size="small">
                <el-form-item label="机会名称：" prop="opportunityName">
                    <el-input v-model="formOpportunity.opportunityName"></el-input>
                </el-form-item>
                <el-form-item label="预计营销额：" prop="amount">
                    <el-input v-model="formOpportunity.amount"></el-input>
                </el-form-item>
                <el-form-item label="营销阶段：" prop="marketingSection">
                    <el-select v-model="formOpportunity.marketingSection" placeholder="" size="small" @change="changeStage(formOpportunity.marketingSection)">
                        <el-option v-for="item in yxjd" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签单可能性：" prop="dealPossible">
                    <el-input disabled v-model="formOpportunity.dealPossible"></el-input>
                </el-form-item>
                <el-form-item label="线索名称：" prop="name">
                    <el-input disabled v-model="marketingClue.name"></el-input>
                </el-form-item>
                <el-form-item label="机会类型：" prop="opportunityType">
                    <el-select v-model="formOpportunity.opportunityType" placeholder="" size="small">
                        <el-option v-for="item in jhlx" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机会来源：" prop="opportunitySource">
                    <el-select v-model="formOpportunity.opportunitySource" placeholder="" size="small">
                        <el-option v-for="item in jhly" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="合作伙伴" prop="partnerId">
                  <el-select v-model="formOpportunity.partnerId" size="small" filterable clearable placeholder="请输入合作伙伴">
                    <el-option
                      v-for="item in partner"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="拥有者" prop="ownerCname">
                      <el-select v-model="formOpportunity.ownerCname" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
                <el-form-item label="备注：" prop="remark">
                    <el-input type="textarea" v-model="formOpportunity.remark" :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogContractVisible = false" size="small">取消</el-button>
                <el-button type="primary" @click="form_opportunity_save('formOpportunity')" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑线索模态框 -->
        <el-dialog title="编辑线索" width="600px" class="dialogEdit" :visible.sync="dialogEditVisible" :close-on-click-modal='false'>
          <el-form ref="form" :model="formEdit" label-width="120px" size="small">
            <el-form-item v-for="(item,index) in marketingClueFieldList" :key="index" :label="item.label" :prop="item.name">

              <el-input v-if="item.editorType == 'text'" v-model="marketingClueEdit[item.name]"></el-input>
                <el-date-picker v-if="item.editorType == 'date'" v-model="marketingClueEdit[item.name]" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
                    type="datetime" placeholder="选择日期时间">
                </el-date-picker>

                <el-select v-if="item.editorType == 'dict'" v-model="marketingClueEdit[item.name]">
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
                  :options="cityData()"
                  v-model="marketingClueEdit[item.name]">
                </el-cascader>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelEdit()">取 消</el-button>
            <el-button type="primary" @click="marketingClueSave()" size="small">保存</el-button>
            <!-- <el-button type="primary" @click="dialogEditVisible = false" size="small">提交审批</el-button> -->
          </div>
        </el-dialog>
        <!-- 转给他人模态框 -->
        <el-dialog title="转给他人" width="600px" class="dialogTransfer" :visible.sync="dialogTransferVisible" :close-on-click-modal='false'>
            <el-form ref="form" :model="formTransfer" label-width="120px" size="small">
                <el-form-item label="转移对象：">
                    线索名称【{{marketingClue.name}}】
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
                <el-button type="primary" @click="turn_other_sava()" size="small">确定</el-button>
            </div>
        </el-dialog>
        <!-- 写跟进模态框 -->
        <el-dialog title="跟进" :visible.sync="dialogFolowVisible" @open="openFollowModal" @close="closeFollowModal" :close-on-click-modal='false' width="550px">
            <el-form ref="follow_form" :inline="true" :rules="followRules" :model="follow_form" labelPosition="left">
                <el-form-item required style="margin-right: 76px" prop="followType">
                    <el-select v-model="follow_form.followType" placeholder="请选择跟进方式" size="small">
                        <el-option v-for="item in follow_type_list" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="followTime">
                    <el-date-picker v-model="follow_form.followTime" format="yyyy-MM-dd HH:mm"
                        type="datetime" size="small" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="followContent">
                    <el-input type="textarea" :autosize="{ minRows: 2}" v-model="follow_form.followContent" maxlength="200" placeholder="填写跟进内容(200字以内)" style="width: 500px;"></el-input>
                </el-form-item>
                <p style="padding-bottom: 10px;">客户名称：&nbsp;&nbsp;&nbsp;&nbsp;{{marketingClue.customerName}}</p>
                <el-form-item label="跟进状态：" prop="followStatus">
                    <el-select v-model="follow_form.followStatus" placeholder="" size="small">
                        <el-option v-for="item in follow_status_list" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="拜访人员：" prop="contactCname">
                    <el-select v-model="follow_form.contactCname" size="small" filterable clearable placeholder="请输入员工姓名或工号">
                        <el-option
                            v-for="item in contacts_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id + '/' + item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="通知：" label-width="80px" prop="copyToUser">
                    <el-select v-model="follow_form.copyToUser" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFolowVisible = false">取 消</el-button>
                <el-button type="primary" @click="followSave">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 丢单模态框 -->
        <el-dialog title="丢单" width="600px" class="dialogContract" :visible.sync="dialogLostVisible" :close-on-click-modal='false'>
            <p style="margin: 20px 40px;">是否将【xxx】的销售阶段调整为丢单？</p>
            <el-form ref="form" :model="formLost" label-width="120px" size="small">
                <el-form-item label="丢单理由：">
                    <el-select v-model="formLost.origin">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="formLost.notes" :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogLostVisible = false" size="small">取消</el-button>
                <el-button type="primary" @click="dialogLostVisible = false" size="small">确定</el-button>
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
        <!-- 参与成员模态框 -->
        <el-dialog title="权限设置" :visible.sync="dialogSettingsVisible" @open="getAllStaff" width="600px" :close-on-click-modal='false'>
            <el-form :inline="true" v-if="isOwner">
                <el-form-item>
                    <el-select v-model="addMemberInput" size="small" filterable clearable placeholder="请输入员工姓名或工号">
                        <el-option
                            v-for="item in allStaff"
                            :key="item.userName"
                            :label="item.cname + '  ' + item.userName"
                            :value="item.cname + '/' + item.userName">
                            <span style="float: left">{{ item.cname }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="addMember">添加</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="memberList" border :row-style="{'text-align': 'center'}" :header-cell-style="{'text-align': 'center'}">
                <el-table-column property="userCname" label="团队成员姓名"  min-width="160">
                    <template slot-scope="scope">
                        {{scope.row.userCname}}{{scope.row.isOwner ? "(拥有者)" : ""}}
                    </template>
                </el-table-column>
                <el-table-column property="userJobNum" label="工号"></el-table-column>
                <el-table-column property="is_modify" label="权限" width="240"  v-if="isOwner">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.isModify" :disabled="scope.row.isOwner" @change="updateMember(scope.row.isModify, scope.$index, scope.row.id, scope.row.userCname, 'isModify')">编辑</el-checkbox>
                        <el-checkbox v-model="scope.row.isDownload" :disabled="scope.row.isOwner" @change="updateMember(scope.row.isDownload, scope.$index, scope.row.id, scope.row.userCname, 'isDownload')">下载附件</el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column v-if="isOwner" property="address" label="操作">
                    <template slot-scope="scope" v-if="!scope.row.isOwner">
                        <el-button @click.native.prevent="deleteMember(scope.row.id, scope.row.userCname, scope.$index)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 关闭线索模态框 -->
        <el-dialog title="提示" width="600px" @close="colse_marketing_clue" class="dialogClose" :visible.sync="dialogClose" :close-on-click-modal='false'>
            <el-form ref="closeMarketingClue" :rules="close_rules" :model="closeMarketingClue" label-width="120px" size="small">
                <p style="padding-left: 30px;">关闭不可恢复，确定要关闭吗？</p>
                <el-form-item label="关闭理由：" prop="closeReason">
                    <el-input type="textarea" v-model="closeMarketingClue.closeReason" :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogClose = false" size="small">取消</el-button>
                <el-button type="primary" @click="colse_marketing_clue_save" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script src="../js/marketing_clue_detail.js"></script>

<style lang="less">
    @import url('../style/opportunity_detail.less');
</style>
