<template>
    <div class="wrap">
        <!-- 头部 -->
        <div class="header">
          <div class="header-top">
            <span class="header-name">{{customer.name}} <i class="iconfont icon-yduidunpaikongxin"></i></span>
            <span>&nbsp;&nbsp;跟进状态：{{customer.followStatus}}</span>
            <span>&nbsp;&nbsp;拥有者：{{customer.ownerCname}}</span>
            <span>&nbsp;&nbsp;参与成员： <i class="iconfont icon-shezhi" @click="getMembers"></i></span>
          </div>

          <el-row>
              <el-button type="primary" size="mini" @click.native="goBack">返回</el-button>&nbsp;&nbsp;
              <el-dropdown trigger="click">
                  <el-button type="primary" size="mini" style="padding-bottom: 6px;">
                      添加<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>&nbsp;&nbsp;
                  <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="addContat" v-if="isOwner">联系人</el-dropdown-item>
                      <el-dropdown-item @click.native="add_marketing_clue">线索</el-dropdown-item>
                      <el-dropdown-item @click.native="add_opportunity">机会</el-dropdown-item>
                      <el-dropdown-item @click.native="add_contract">合同</el-dropdown-item>
                  </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown trigger="click" v-if="isOwner">
                  <el-button type="primary" size="mini" style="padding-bottom: 6px;">
                      转移<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>&nbsp;&nbsp;
                  <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="turnSea">转至公海</el-dropdown-item>
                      <el-dropdown-item @click.native="turnOther">转给他人</el-dropdown-item>
                  </el-dropdown-menu>
              </el-dropdown>
              <el-button v-if="isModify" type="primary" size="mini" @click="editCustomer">编辑</el-button>
              <el-button v-if="isOwner" type="primary" size="mini" @click="delCustomer">删除</el-button>
          </el-row>

        </div>
        <!-- 标签页内容 -->
        <div class="main">
            <el-tabs v-model="tabName" @tab-click="chooseTab">
                <!-- 客户全景 -->
                <el-tab-pane name="tab1">
                    <span class="tab-item" slot="label">客户全景</span>
                    <div class="first">
                        <div class="first-left">
                            <div class="title">基本信息</div>
                            <div class="info-box">
                                <table>
                                    <tr>
                                        <td width='80'>电话：</td>
                                        <td width='160'>{{customer.phone}}</td>
                                        <td width='80'>客户类型：</td>
                                        <td width='160'>{{customer.cusType}}</td>
                                    </tr>
                                    <tr>
                                        <td>邮箱：</td>
                                        <td>{{customer.mail}}</td>
                                        <td>客户规模：</td>
                                        <td>{{customer.cusSize}}</td>
                                    </tr>
                                    <tr>
                                        <td>地区：</td>
                                        <td>{{customer.area.join(' / ')}}</td>
                                        <td>所属行业：</td>
                                        <td>{{customer.industry}}</td>
                                    </tr>
                                    <tr>
                                        <td>公司地址：</td>
                                        <td>{{customer.address}}</td>
                                        <td>客户来源：</td>
                                        <td>{{customer.cusSource}}</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="title">联系人({{contacts_list.length}})</div>
                            <div class="info-box">
                                <table width='100%' v-show="contacts_list.length">
                                    <tr>
                                        <td>姓名</td>
                                        <td>手机号</td>
                                        <td>标签</td>
                                    </tr>
                                    <tr v-for="(item, index) in contacts_list" v-if="index < 3" :key="index">
                                        <td>{{item.name}}</td>
                                        <td>{{item.mobilePhone}}</td>
                                        <td>{{item.tags.join("、")}}</td>
                                    </tr>
                                </table>
                                <p v-show="!contacts_list.length" style="text-align: center;">暂无数据</p>
                            </div>
                            <div class="title">线索({{marketingClueList.length}})</div>
                            <div class="info-box">
                                <table width='100%' v-show="marketingClueList.length">
                                    <tr>
                                        <td>线索名称</td>
                                        <td>线索来源</td>
                                        <td>联系方式</td>
                                    </tr>
                                    <tr v-for="(item, index) in marketingClueList" v-if="index < 3" :key="index">
                                        <td>{{item.name}}</td>
                                        <td>{{item.clueSource}}</td>
                                        <td>{{item.mobilePhone}}</td>
                                    </tr>
                                </table>
                                <p v-show="!marketingClueList.length" style="text-align: center;">暂无数据</p>
                            </div>
                            <div class="title">机会({{opportunityList.length}})</div>
                            <div class="info-box">
                                <table width='100%' v-show="opportunityList.length">
                                    <tr>
                                        <td>机会名称</td>
                                        <td>预计营销金额</td>
                                        <td>营销阶段</td>
                                    </tr>
                                    <tr v-for="(item, index) in opportunityList" v-if="index < 3" :key="index">
                                        <td>{{item.opportunityName}}</td>
                                        <td>{{item.amount}}</td>
                                        <td>{{item.marketingSection}}</td>
                                    </tr>
                                </table>
                                <p v-show="!opportunityList.length" style="text-align: center;">暂无数据</p>
                            </div>
                            <div class="title">合同({{contractList.length}})</div>
                            <div class="info-box">
                                <table width='100%' v-show="contractList.length">
                                    <tr>
                                        <td>合同名称</td>
                                        <td>合同金额</td>
                                    </tr>
                                    <tr v-for="(item, index) in contractList" v-if="index < 3" :key="index">
                                        <td>{{item.contractName}}</td>
                                        <td>{{item.contracAmount}}</td>
                                    </tr>
                                </table>
                                <p v-show="!contractList.length" style="text-align: center;">暂无数据</p>
                            </div>
                            <!-- <div class="title">交易数据</div> -->
                        </div>
                        <div class="first-right">
                            <div class="title">客户动态
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

                <!-- 基本信息 -->
                <el-tab-pane name="tab2">
                    <span class="tab-item" slot="label">基本信息</span>
                    <div class="second">
                        <p style="margin-bottom: 20px;" v-show="isEdit">
                            <el-button type="primary" size="mini" @click="customerSave()">保存</el-button>
                            <el-button type="info" size="mini" @click="cancelEdit()">取消</el-button>
                        </p>
                        <el-form ref="customerEdit" :inline="true" :rules="customer_rules" :model="customerEdit" label-position="left" label-width="120px" size="small">
                            <el-form-item v-for="(item,index) in customerFieldList" :key="index" :label="item.label" :prop="item.name">
                                <el-input  :disabled="!isEdit" v-if="item.editorType == 'text'" :prop="item.name" v-model="customerEdit[item.name]"></el-input>
                                <el-date-picker :disabled="!isEdit || item.name == 'lastFollowTime'" v-if="item.editorType == 'date'" v-model="customerEdit[item.name]" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
                                    type="datetime" placeholder="选择日期时间">
                                </el-date-picker>
                                <el-select :disabled="!isEdit" v-if="item.editorType == 'dict'" placeholder="" v-model="customerEdit[item.name]">
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
                                    v-model="customerEdit[item.name]">
                                </el-cascader>
                            </el-form-item>
                            <el-form-item label="拥有者">
                                <div style="width: 390px;">{{customerEdit.ownerCname}}</div>
                            </el-form-item><el-form-item label="创建者">
                                <div style="width: 390px;">{{customerEdit.createUserCname}}</div>
                            </el-form-item><el-form-item label="创建时间">
                                <div style="width: 390px;">{{customerEdit.createTime}}</div>
                            </el-form-item>
                        </el-form>


                    </div>
                </el-tab-pane>

                <!-- 联系人 -->
                <el-tab-pane name="tab3">
                    <span class="tab-item" slot="label" @click="getContacts">联系人</span>
                    <div class="third">
                        <el-card class="box-card" v-for="(item, index) in contacts_list" :key="index">
                            <div>
                                <p v-for="(item1,index1) in contactsAddLabel" :key="index1">
                                    <span class="label">{{item1.label}}：</span><span class="content">{{item[item1.name]}}</span>
                                </p>
                                <p>
                                    <span class="label">标签：</span>
                                    <font class="content">
                                        <el-tag
                                            :key="tag"
                                            v-for="tag in item.tags"
                                            :disable-transitions="false">
                                            {{tag}}
                                        </el-tag>
                                    </font>
                                </p>
                            </div>
                        </el-card>
                    </div>
                </el-tab-pane>

                <!-- 线索 -->
                <el-tab-pane name="tab4">
                    <span class="tab-item" slot="label" @click="look_add_marketing_clue">线索</span>
                    <div class="fourth">
                        <el-table
                            :data="marketingClueList"
                            max-height="500"
                            border
                            :row-style="{'text-align': 'center', 'color': '#333'}"
                            :header-cell-style="{'text-align': 'center', 'background': '#f2f2f2', 'border-color': '#fff', 'color': '#333'}"
                            style="width: 100%">
                            <el-table-column prop="name" label="线索名称" width="180"></el-table-column>
                            <el-table-column prop="clueSource" label="线索来源" width="180"></el-table-column>
                            <el-table-column prop="mobilePhone" label="联系方式"></el-table-column>
                            <el-table-column prop="remark" label="备注"> </el-table-column>
                            <el-table-column prop="createTime" label="创建时间"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

                <!-- 机会 -->
                <el-tab-pane name="tab5">
                    <span class="tab-item" slot="label" @click="look_add_opportunity">机会</span>
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
                            <el-table-column prop="remark" label="备注"> </el-table-column>
                            <el-table-column prop="createTime" label="创建时间"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

                <!-- 合同 -->
                <el-tab-pane name="tab6">
                    <span class="tab-item" slot="label" @click="look_add_contract">合同</span>
                    <div class="sixth">
                        <el-table
                            :data="contractList"
                            max-height="500"
                            border
                            :row-style="{'text-align': 'center', 'color': '#333'}"
                            :header-cell-style="{'text-align': 'center', 'background': '#f2f2f2', 'border-color': '#fff', 'color': '#333'}"
                            style="width: 100%">
                            <el-table-column prop="contractName" label="合同名称" width="180"></el-table-column>
                            <el-table-column prop="contracAmount" label="合同金额" width="180"></el-table-column>
                            <el-table-column prop="contractState" label="合同状态"></el-table-column>
                            <el-table-column prop="remark" label="备注"></el-table-column>
                            <el-table-column prop="createTime"  label="创建时间"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

                <!-- 附件 -->
                <el-tab-pane name="tab7">
                    <span class="tab-item" slot="label" @click="getAttachs">附件</span>
                    <div class="seventh">
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
                                    <a class="operating" v-if="isOwner" @click="delAnnex(scope.row.id, scope.row.fileName, scope.$index)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

                <!-- 操作日志 -->
                <el-tab-pane name="tab8">
                    <span class="tab-item" slot="label" @click="getLogs">操作日志</span>
                    <div class="eighth">
                        <el-table :data="logs" max-height="500" border :row-style="{'text-align': 'center', 'color': '#333'}"
                            :header-cell-style="{'text-align': 'center', 'background': '#f2f2f2', 'border-color': '#fff', 'color': '#333'}" style="width: 100%">
                            <el-table-column prop="createTime" label="操作时间"  width="180"></el-table-column>
                            <el-table-column prop="createUserCname" label="操作人" width="180"></el-table-column>
                            <el-table-column prop="content" label="操作内容"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

            </el-tabs>
        </div>

        <!-- 添加联系人模态框 -->
        <el-dialog title="新增联系人" width="600px" class="dialogAdd"
                :visible.sync="dialogContactdVisible" @open="openContactModal" @close="closeContactModal" :close-on-click-modal='false'>
            <el-form ref="contactForm" :model="contactsAdd" :rules="contacts_rules" label-position="left" label-width="120px" size="small">
                <el-form-item label="照片">
                <div class="upload-box" @click="chooseImg">
                    <i v-show="!imgSrc" class="el-icon-plus"></i>
                    <img v-show="imgSrc" :src="getUrl(imgSrc)" alt="">
                    <input type="file" @change="pictureChange" v-show="false" ref="uploadInput" accept="image/*">
                </div>
                </el-form-item>
                <el-form-item v-for="(item,index) in contactsAddLabel" :key="index" :prop="item.name" :label="item.label">
                <el-input v-if="item.editorType == 'text'" type="textarea" resize="none" autosize v-model="contactsAdd[item.name]"></el-input>
                <el-date-picker v-if="item.editorType == 'date'" v-model="contactsAdd[item.name]" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>

                <el-select v-if="item.editorType == 'dict'" v-model="contactsAdd[item.name]">
                    <el-option
                    v-if="item.editorType == 'dict'"
                    v-for="value in item.selectList"
                    :key="value"
                    :label="value"
                    :value="value">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="标签">
                <el-tag
                    :key="tag"
                    v-for="tag in contactsAdd.tags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogContactdVisible = false">取 消</el-button>
                <el-button type="primary" @click="contactsSave()">确 定</el-button>
            </div>
        </el-dialog>

        <!--新增营销线索弹框-->
        <el-dialog title="新增线索" width="600px" @close="closeMarketingClueAdd" class="dialogAdd"
                    :visible.sync="dialogAddVisible" @open="openMarketintClueModal" :close-on-click-modal='false'>

            <el-form ref="marketingClueAdd" :rules="marketing_clue_rules" :model="marketingClueAdd" label-position="left" label-width="120px" size="small">

                <el-form-item  label="客户名称" prop="customerName">
                  <el-input disabled v-model="customer.name"></el-input>
                </el-form-item>

                <el-form-item v-for="(item,index) in marketingClueAddLabel" :key="index" :label="item.label" :prop="item.name">

                    <el-input v-if="item.editorType == 'text'" v-model="marketingClueAdd[item.name]"></el-input>
                    <el-date-picker v-if="item.editorType == 'date'" v-model="marketingClueAdd[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        type="datetime" placeholder="选择日期时间">
                    </el-date-picker>

                    <el-select v-if="item.editorType == 'dict'" v-model="marketingClueAdd[item.name]">
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
                      v-model="marketingClueAdd[item.name]">
                    </el-cascader>
                </el-form-item>
                <el-form-item  label="合作伙伴" prop="partnerId">
                  <el-select v-model="marketingClueAdd.partnerId" size="small" filterable clearable placeholder="请输入合作伙伴">
                    <el-option
                      v-for="item in partner"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="拥有者" prop="ownerCname">
                      <el-select v-model="marketingClueAdd.ownerCname" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="primary" @click="marketingClueSave('marketingClueAdd')">确 定</el-button>
            </div>

        </el-dialog>

        <!-- 新增机会模态框 -->
        <el-dialog title="新增机会" width="600px" class="dialogAdd" @open="openOpportunityModal" @close="closeOpportunityAdd" :visible.sync="dialogAddOpportunity" :close-on-click-modal='false'>
            <el-form ref="opportunityAdd" :rules="opportunity_rules" :model="opportunityAdd" label-width="120px" size="small">

                <el-form-item  label="客户名称" prop="customerName">
                  <el-input disabled v-model="customer.name"></el-input>
                </el-form-item>
                <el-form-item  label="线索名称" prop="marketingClueId">
                  <el-select v-model="opportunityAdd.marketingClueId" size="small" filterable clearable placeholder="请输入客户名称">
                    <el-option
                      v-for="item in marketingClues"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="合作伙伴" prop="partnerId">
                  <el-select v-model="opportunityAdd.partnerId" size="small" filterable clearable placeholder="请输入合作伙伴">
                    <el-option
                      v-for="item in partner"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-for="(item,index) in opportunityAddLabel" :key="index" :label="item.label" :prop="item.name">

                    <el-input v-if="item.editorType == 'text'" :disabled="item.name == 'dealPossible'" v-model="opportunityAdd[item.name]"></el-input>
                    <el-date-picker v-if="item.editorType == 'date'" v-model="opportunityAdd[item.name]" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        type="datetime" placeholder="选择日期时间">
                    </el-date-picker>

                    <el-select v-if="item.editorType == 'dict'" @change="changeStage(item.name)" v-model="opportunityAdd[item.name]">
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
                      v-model="opportunityAdd[item.name]">
                    </el-cascader>
                </el-form-item>

                <el-form-item  label="拥有者" prop="ownerCname">
                  <el-form-item>
                      <el-select v-model="opportunityAdd.ownerCname" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
                <el-button @click="dialogAddOpportunity = false">取 消</el-button>
                <el-button type="primary" @click="opportunitySave('opportunityAdd')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增合同模态框 -->
        <el-dialog title="新增合同" width="600px" class="dialogAdd"  @open="openContractModal" @close="closeContractAdd" :visible.sync="dialogAddContractVisible" :close-on-click-modal='false'>
            <el-form ref="contractAdd" :rules="contrac_rules" :model="contractAdd" label-width="120px" size="small">
              <el-form-item  label="客户名称" prop="customerName">
                  <el-input disabled v-model="customer.name"></el-input>
              </el-form-item>
              <el-form-item  label="营销机会" prop="opportunityId">
                <el-select v-model="contractAdd.opportunityId" size="small" filterable clearable placeholder="请输入客户名称">
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
                      type="datetime" placeholder="选择日期时间">
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

              <el-form-item  label="合同负责人" prop="ownerCname">
                <el-form-item>
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
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddContractVisible = false">取 消</el-button>
                <el-button type="primary" @click="contractSave('contractAdd')">确 定</el-button>
            </div>
        </el-dialog>
        <!--转给他人弹框-->
        <el-dialog title="转给他人" width="40%" :visible.sync="dialogTransferVisible" @open="openTurnModal" :close-on-click-modal='false'>
            <el-form ref="form" :model="formTransfer" label-width="120px" size="small">
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
                <el-checkbox v-model="formTransfer.checkbox1">保留原拥有者为团队成员</el-checkbox>
                </el-form-item>
                <el-form-item label="转移相关业务">
                <el-checkbox v-model="formTransfer.checkbox2">线索</el-checkbox>
                <el-checkbox v-model="formTransfer.checkbox3">合同</el-checkbox>
                <el-checkbox v-model="formTransfer.checkbox4">机会</el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTransferVisible = false">取 消</el-button>
                <el-button type="primary" @click="turn_other_sava()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 权限设置模态框 -->
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
                        <el-checkbox v-model="scope.row.isModify" :disabled="scope.row.isOwner" @change="updateMember(scope.row.isModify, scope.$index, scope.row.id, scope.row.userCname,  'isModify')">编辑</el-checkbox>
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
        <!-- 写跟进模态框 -->
        <el-dialog title="跟进" :visible.sync="dialogFolowVisible" @open="openFollowModal" @close="closeFollowModal" :close-on-click-modal='false' width="550px">
            <el-form :inline="true" :rules="followRules" :model="follow_form" labelPosition="left" ref="follow_form">
                <el-form-item required style="margin-right: 76px" prop="followType">
                    <el-select v-model="follow_form.followType" placeholder="请选择跟进方式" size="small">
                        <el-option v-for="item in follow_type_list" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="followTime">
                    <el-date-picker v-model="follow_form.followTime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"
                        type="datetime" size="small" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="followContent">
                    <el-input type="textarea" :autosize="{ minRows: 2}" v-model="follow_form.followContent" maxlength="200" placeholder="填写跟进内容(200字以内)" style="width: 500px;"></el-input>
                </el-form-item>
                <p style="padding-bottom: 10px;">客户名称：&nbsp;&nbsp;&nbsp;&nbsp;{{customer.name}}</p>
                <el-form-item label="跟进状态：" prop="followStatus">
                    <el-select v-model="follow_form.followStatus" placeholder="" size="small">
                        <el-option v-for="item in follow_status_list" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="拜访人员：" prop="contactCname">
                    <el-select v-model="follow_form.contactCname" size="small" filterable clearable placeholder="请选择拜访人姓名">
                        <el-option
                            v-for="item in contacts_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id + '/' + item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="通知：" label-width="80px" prop="copyToUserCname">
                    <el-tag :key="copyToUser" v-for="copyToUser in copyToUserList" closable :disable-transitions="false" @close="delCopyToUser(copyToUser)">
                        {{copyToUser}}
                    </el-tag>
                    <el-select v-model="follow_form.copyToUserCname" @change="addCopyToUser" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
        <!-- 上传附件 -->
        <el-dialog title="上传附件" :visible.sync="dialogAnnexVisible" @close="closeAnnexModal" :close-on-click-modal='false' width="550px">
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
                    <el-input type="textarea" resize="none" :autosize="{ minRows: 2}" maxlength="200" v-model="annexRemarks" placeholder="请填写备注(200字以内)"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAnnexVisible = false">取 消</el-button>
                <el-button type="primary" @click="annexSave">保存</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script src="../js/client_detail.js">

</script>
<style lang="less" scoped>
    .el-main{
        padding-bottom: 0;
    }
    .header{
        background: #fff;
        margin-bottom: 20px;
        padding: 20px 15px 10px;
        position: relative;
        z-index: 10;
        .header-top{
            margin-bottom: 10px;
            .header-name{
                font-size: 20px;
                font-weight: bold;
                i{
                    font-size: 22px;
                    color: #0090ff;
                }
            }
        }
        .el-button--primary{
            background: #fff;
            color: #0090ff;
        }
    }
    .main{
        position: relative;
        // top: -115px;
        // padding-top: 115px;
        padding-bottom: 20px;
        box-sizing: border-box;
        min-height: 100%;
        .el-tabs{
            background: #fff;
            height: 100%;
        }
        .tab-item{
            display: block;
            width: 100px;
            text-align: center;
        }
    }
    .first{
        overflow: hidden;
        font-size: 14px;
        padding: 20px 10px;
        .first-left{
            width: 560px;
            float: left;
            .title{
                height: 40px;
                background: #f2f2f2;
                line-height: 40px;
                padding: 0 15px;
            }
            .info-box{
                border: 1px solid #f2f2f2;
                padding: 10px;
                margin-bottom: 20px;
            }
        }
        .first-right{
            width: 515px;
            float: right;
            border: 1px solid #ebeef5;
            .title{
                height: 40px;
                background: #f2f2f2;
                line-height: 40px;
                padding: 0 15px;
            }
            .follow-content{
                padding: 0 28px 10px;
                line-height: 20px;
            }
            .process{
                border-left: 1px solid #ddd;
                padding: 20px 7px;
                margin: 0 0 20px 60px;
            }
            .tooltip{
                width: 380px;
                margin-bottom: 40px;
                position: relative;
                &:before{
                    position: absolute;
                    left: -30px;
                    top: 9px;
                    display: block;
                    content: '\E66E';
                    background: #0090ff;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    color: #fff;
                    font-size: 12px;
                    text-align: center;
                    line-height: 20px;
                }
            }
            .tooltip.date{
                width: 80px;
                background: #0090ff;
                height: 16px;
                padding: 8px 0;
                text-align: center;
                .el-popover__title{
                    color: #fff;
                }
                .popper__arrow::after{
                    border-right-color: #0090ff;
                }
                &:before{
                    content: '';
                    width: 12px;
                    height: 12px;
                    left: -26px;
                    top: 12px;
                }
            }
        }
        .box-card{
            width: 180px;
        }
    }
    .second{
        padding: 20px;
        .el-input, .el-select, .el-textarea, .el-cascader{
            width: 330px;
            margin-right: 60px;
        }
    }
    .third{
        padding-top: 20px;
        overflow: hidden;
        .box-card{
            width: 30%;
            margin: 0 1.5%;
            float: left;
            font-size: 14px;
            position: relative;
            margin-bottom: 20px;
            p{
                display: flex;
                line-height: 20px;
                padding: 4px 0;
                .label{
                    width: 100px;
                }
                .content{
                    flex: 1;
                }

            }
            .avatar{
                text-align: center;
            }
            .tip{
                color: #0090ff;
                font-weight: bold;
                &:nth-of-type(2){
                    margin-bottom: 15px;
                }
            }
            .el-tag{
                margin-right: 5px;
            }
            a{
                color: #0090ff;
                font-size: 15px;
                display: block;
                margin-top: 15px;
            }
            .time{
                text-align: right;
                color: #ccc;
            }
        }
    }
    .fourth, .fifth, .sixth, .seventh{
        padding: 20px 10px;
    }
    .operating{
        color: #0090ff;
        margin: 0 10px;
    }
    .addChance, .addContract, .transferOthers{
        .el-input, .el-select, .el-textarea{
            width: 330px;
        }
    }
    .dialogAdd {
        .el-input, .el-cascader, .el-select, .el-textarea {
            width: 400px;
        }
        .upload-box{
            border: 1px solid #ddd;
            width: 60px;
            height: 60px;
            text-align: center;
            cursor: pointer;
            i{
                font-size: 30px;
                line-height: 60px;
                color: #ddd;
            }
            img{
                max-width: 100%;
                max-height: 100%;
            }
        }
        .el-tag {
            margin-right: 10px;
            margin-bottom: 10px;
        }
        .button-new-tag {
            margin-right: 10px;
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
        }
        .input-new-tag {
            width: 90px !important;
            vertical-align: top;
        }
    }


</style>


