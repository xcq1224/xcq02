<template>
    <div class="wrap">
        <!-- 头部 -->
        <div class="handle-box">
            <div class="header-top">
                <span class="header-name">{{basicInfo.name}}</span>
            </div>
            <el-row>
                <el-button type="primary" size="mini" @click.native='goBack'>返回</el-button>
                <el-button v-if="isOwner" type="primary" size="mini" @click='edit'>编辑</el-button>
                <el-button v-if="isOwner" type="primary" size="mini" @click='del'>删除</el-button>
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
                        <p style="margin-bottom: 20px;" v-show="isEdit">
                            <el-button type="primary" size="mini" @click="editSave">保存</el-button>
                            <el-button type="info" size="mini" @click="cancelEdit">取消</el-button>
                        </p>
                        <el-form ref="form" class="form" :inline="true" :model="basicInfo" label-position="left" label-width="120px" size="small">
                            <el-form-item v-for="(item,index) in addLabel" :key="index" :label="item.label" :prop="item.name">
                                <el-input type="textarea" resize="none" autosize :disabled="!isEdit" v-if="item.editorType == 'text'" :prop="item.name" v-model="basicInfo[item.name]"></el-input>
                                <el-date-picker :disabled="!isEdit" v-if="item.editorType == 'date'" v-model="basicInfo[item.name]" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
                                    type="datetime" placeholder="选择日期时间">
                                </el-date-picker>
                                <el-select :disabled="!isEdit" v-if="item.editorType == 'dict'" v-model="basicInfo[item.name]">
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
                                    v-model="basicInfo[item.name]">
                                </el-cascader>
                            </el-form-item>
                            </el-form-item><el-form-item label="创建者">
                                <div style="width: 390px;">{{basicInfo.createUserCname}}</div>
                            </el-form-item><el-form-item label="创建时间">
                                <div style="width: 390px;">{{basicInfo.createTime}}</div>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <!-- 机会 -->
                <el-tab-pane name="second">
                    <span class="tab-item" slot="label" @click="look_opportunity">机会</span>
                    <div class="second">
                        <el-table
                            :data="opportunityList"
                            max-height="500"
                            border
                            :row-style="{'text-align': 'center', 'color': '#333'}"
                            :header-cell-style="{'text-align': 'center', 'background': '#f2f2f2', 'border-color': '#fff', 'color': '#333'}"
                            style="width: 100%">
                            <el-table-column prop="opportunityName" label="机会名称"></el-table-column>
                            <el-table-column prop="competitorPrice"  label="报价"></el-table-column>
                            <el-table-column prop="remark" label="备注"></el-table-column>
                            <el-table-column prop="createUserCname" label="创建人"></el-table-column>
                            <el-table-column prop="createTime" label="创建时间">
                              <template slot-scope="scope">
                                  {{scope.row.createTime.split(' ')[0]}}
                              </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <!-- 附件 -->
                <el-tab-pane name="third">
                    <span class="tab-item" slot="label" @click="getAttachs">附件</span>
                    <div class="third">
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
                                    <a class="operating" @click="delAnnex(scope.row.id, scope.row.fileName, scope.$index)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <!-- 操作日志 -->
                <el-tab-pane name="fourth">
                    <span class="tab-item" slot="label" @click="getLogs">操作日志</span>
                    <div class="fourth">
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

<script src="../js/competitor_detail.js">
</script>

<style lang="less" scoped>
    .handle-box{
        background: #fff;
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
        padding: 20px 20px;
        .form{
            width: 1100px;
            .el-form-item{
                width: 520px;
            }
            .el-input, .el-cascader, .el-select, .el-textarea {
                width: 330px;
            }
        }
    }
    .second, .third{
        padding: 20px;
        >.el-button{
            margin: 20px 0;
        }
    }
    .fourth, .fifth{
        padding: 20px;
    }
    .operating{
        color: #0090ff;
        margin: 0 10px;
        &.iconfont{
            font-size: 20px;
            margin: 0 5px;
        }
    }
    .dialogReceipt, .dialogInvoicing, .dialogTransfer, .dialogEdit, .dialogDeploy{
        .el-input, .el-select, .el-textarea{
            width: 330px;
        }
    }
</style>
