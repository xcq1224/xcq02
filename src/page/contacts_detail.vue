<template>
    <div class="wrap contact-detail">
        <!-- 头部 -->
        <div class="header">
            <div class="header-top">
                <span class="header-name">{{contact.name}}</span>
                <span>&nbsp;&nbsp;客户名称：<router-link class="text-base" :to="'./client_detail?id=' + contact.customerId">{{customerName}}</router-link></span>
            </div>
            <el-row>
                <el-button type="primary" size="mini" @click.native="goBack">返回</el-button>
                <el-button type="primary" size="mini" @click="dialogRelateInfoVisible = true">添加关联人</el-button>
                <el-button v-if="isModify" type="primary" size="mini" @click="editCustomer">编辑</el-button>
                <el-button v-if="isOwner" type="primary" size="mini" @click="delContact">删除</el-button>
            </el-row>
        </div>
        <!-- 标签页内容 -->
        <div class="main">
            <el-tabs v-model="activeName">
                <!-- 基本信息 -->
                <el-tab-pane name="first">
                    <span class="tab-item" slot="label">基本信息</span>
                    <div class="first">
                        <p style="margin-bottom: 20px;" v-show="isEdit">
                            <el-button type="primary" size="mini" @click="contactSave">保存</el-button>
                            <el-button type="info" size="mini" @click="cancelEdit">取消</el-button>
                        </p>
                        <el-form ref="contactsAdd" :model="contactsAdd" :rules="contacts_rules" class="form" :inline="true" label-position="left" label-width="120px" size="small">
                            <el-form-item label="照片" v-show="false">
                                <div class="upload-box" :class="isEdit?'':'active'" @click="chooseImg">
                                    <i v-show="!imgSrc" class="el-icon-plus"></i>
                                    <img v-show="imgSrc" :src="getUrl(imgSrc)" alt="">
                                    <input type="file" @change="pictureChange" :disabled="!isEdit" v-show="false" ref="uploadInput" accept="image/*">
                                </div>
                            </el-form-item><el-form-item v-for="(item,index) in contactsAddLabel" :key="index" :prop="item.name" :label="item.label">
                                <el-input :disabled="!isEdit" v-if="item.editorType == 'text'" v-model="contactsAdd[item.name]"></el-input>
                                <el-date-picker :disabled="!isEdit" v-if="item.editorType == 'date'" v-model="contactsAdd[item.name]" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>

                                <el-select v-if="item.editorType == 'dict'" :disabled="!isEdit" v-model="contactsAdd[item.name]">
                                    <el-option
                                    v-if="item.editorType == 'dict'"
                                    v-for="value in item.selectList"
                                    :key="value"
                                    :label="value"
                                    :value="value">
                                    </el-option>
                                </el-select>
                            </el-form-item><el-form-item label="标签">
                                <el-tag
                                    :key="tag"
                                    v-for="tag in contactsAdd.tags"
                                    :closable="isEdit"
                                    :disable-transitions="false"
                                    @close="deleteTag(tag)">
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
                                <el-button v-else v-show="isEdit" class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <!-- 公司其他联系人 -->
                <el-tab-pane name="second">
                    <span class="tab-item" slot="label" @click="getOtherContacts">公司其他联系人</span>
                    <div class="second">
                        <el-table :data="otherContacts" max-height="500" border :row-style="{'text-align': 'center', 'color': '#333'}"
                            :header-cell-style="{'text-align': 'center', 'background': '#f2f2f2', 'border-color': '#fff', 'color': '#333'}"
                            style="width: 100%">
                            <el-table-column prop="name" label="姓名"></el-table-column>
                            <el-table-column prop="mobilePhone" label="手机"></el-table-column>
                            <el-table-column prop="phone" label="电话"></el-table-column>
                            <el-table-column prop="job" label="职务"></el-table-column>
                            <el-table-column prop="mail" label="邮箱"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <!-- 相关联系人 -->
                <el-tab-pane name="third">
                    <span class="tab-item" slot="label" @click="getContactRelation">相关联系人</span>
                    <div class="third">
                        <div class="box-card-list">
                            <el-card class="box-card" v-for="(item, index) in relationShipList" :key="index">
                                <div>
                                    <span v-if="isOwner" class="del" @click="delContactRelation(index, item.id, item.relationShipId, item.name)">×</span>
                                    <span v-if="isModify" class="edit" @click="editContactRelation(index)">编辑</span>
                                    <p class="tip">与联系人关系： {{item.relation}}</p>
                                    <p v-for="(item1,index1) in contactsAddLabel" :key="index1" v-if="hideList.indexOf(item1.name) == -1">
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
                    </div>
                </el-tab-pane>

                <!-- 机会 -->
                <el-tab-pane name="tab5">
                    <span class="tab-item" slot="label" @click="getContactOppo">机会</span>
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
                <!-- 操作日志 -->
                <el-tab-pane name="fifth">
                    <span class="tab-item" slot="label" @click="getLogs">操作日志</span>
                    <div class="fifth">
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
        <!-- 添加关联信息模态框 -->
        <el-dialog title="添加关联信息" :visible.sync="dialogRelateInfoVisible" class="form" :close-on-click-modal='false' width="550px" @close="closeRelationModal">
            <el-form ref="relationship" :model="relationship" :rules="contacts_rules" label-position="left" label-width="120px" size="small">
                <el-form-item label="照片">
                    <div class="upload-box" @click="chooseRelationImg">
                        <i v-show="!relationImgSrc" class="el-icon-plus"></i>
                        <img v-show="relationImgSrc" :src="getUrl(relationImgSrc)" alt="">
                        <input type="file" @change="relationImgChange" v-show="false" ref="relationInput" accept="image/*">
                    </div>
                </el-form-item>
                <el-form-item label="与联系人关系">
                    <el-select v-model="relation">
                        <el-option
                        v-for="value in relationList"
                        :key="value"
                        :label="value"
                        :value="value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-for="(item,index) in contactsAddLabel" v-if="hideList.indexOf(item.name) == -1" :key="index" :prop="item.name" :label="item.label">
                    <el-input v-if="item.editorType == 'text'" v-model="relationship[item.name]"></el-input>
                    <el-date-picker v-if="item.editorType == 'date'" v-model="relationship[item.name]" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                    <el-select v-if="item.editorType == 'dict'" v-model="relationship[item.name]">
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
                        v-for="tag in relationship.tags"
                        closable
                        :disable-transitions="false"
                        @close="relationDeleteTag(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="relationInputVisible"
                        v-model="relationInputValue"
                        ref="relationSaveTagInput"
                        size="small"
                        @keyup.enter.native="relationHandleInputConfirm"
                        @blur="relationHandleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="relationShowInput">+ New Tag</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogRelateInfoVisible = false">取 消</el-button>
                <el-button type="primary" @click="relationShipAdd">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script src='../js/contacts_detail.js'></script>
<style lang="less" scoped>
    @import '../style/contacts_detail';
</style>
<style lang="less">
    .contact-detail .el-form-item__content{
        width: 330px;
    }
</style>



