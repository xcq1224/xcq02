<template>
    <div class="wrap-box">
        <div class="wrap-left">
            <el-tree :data="treeList" :props="defaultProps" node-key="id" default-expand-all style="float: left;" @node-click="chooseNote" :expand-on-click-node="false">
                <div :class="data.id == id ? 'text-base' : ''" slot-scope="{ node, data }">
                    {{data.label}}
                </div>
            </el-tree>
        </div>
        <div class="wrap-right">
            <div class="handle" v-if="!hasChildren" >
                <a class="text-base" @click="showAddItem()">创建任务</a>
            </div>
            <div class="handle" v-show=isShowAdd>
                <el-input size="small" style="width: 300px;" v-model="aNewTask.name" placeholder="新的任务名称（任务创建成功后编辑更多...）" :rules="rules"></el-input>&nbsp;&nbsp;
                <el-select v-model="aNewTask.holder_id" size="small" filterable clearable placeholder="请选择负责人">
                    <el-option
                    @click.native="aNewTask.holder_name = item.staffName"
                    v-for="item in rwlbPaticipants"
                    :key="item.staffId"
                    :label="item.staffName"
                    :value="item.staffId">
                    </el-option>
                </el-select>&nbsp;&nbsp;
                <el-date-picker size="small" v-model="aNewTask.deadline_time" type="date" placeholder="截止日期" value-format="yyyy-MM-dd"> </el-date-picker>&nbsp;&nbsp;
                <span><el-button size="small"  type="primary" @click="addTask">创建</el-button></span>&nbsp;&nbsp;
                <span><el-button size="small" type="info" @click="isShowAdd = false">取消</el-button></span>
            </div>
            <div v-if="taskList.length" style="border-top: 1px solid #ddd;">
                <div class="item" v-for="(item, index) in taskList" :key="index" @click="showInfo(item)">
                    <div class="item-left">
                        <span>{{item.name}}</span>
                        <span class="warn">!!!</span>
                    </div>
                    <div class="item-right">
                        <span class="tag" style="background: #ffff99;">标签</span><span class="tag" style="background: #cfc;">标签</span><span class="tag" style="background: #ffff99; width: 30px;">...</span>
                        <span style="color: #aaa;"><i class="iconfont icon-liebiao2" style="font-size: 18px;vertical-align: middle;margin-right: 10px;"></i>0/1</span>
                        <el-tooltip class="item" effect="dark" :content="item.holder_name" placement="bottom" :disabled="!item.holder_name">
                            <span class="mark">{{staffShortName(item.holder_name)}}</span>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <div v-else style="padding: 20px;text-align: center;">暂无数据</div>
            <div class="title">已完成</div>
            <div v-if="c_taskList.length" style="border-top: 1px solid #ddd;">
                <div class="item" v-for="item in c_taskList" :key="item.id" @click="showInfo(item)">
                    <div class="item-left">
                        <del>{{item.name}}</del>
                        <span class="warn">!!!</span>
                    </div>
                    <div class="item-right">
                        <span class="tag" style="background: #f1a325;">标签</span><span class="tag" style="background: #ffff99;">标签</span><span class="tag" style="background: #ffff99; width: 30px;">...</span>
                        <span style="color: #aaa;"><i class="iconfont icon-liebiao2" style="font-size: 18px;vertical-align: middle;margin-right: 10px;"></i>0/1</span>
                        <el-tooltip class="item" effect="dark" :content="item.holder_name" placement="bottom" :disabled="!item.holder_name">
                            <span class="mark">{{staffShortName(item.holder_name)}}</span>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <div v-else style="padding: 20px;text-align: center;">暂无数据</div>
        </div>
        <!--任务详情-->
        <div class="layer" v-show="isLayer" @click="hideInfo"></div>
        <div class="info" v-show="isLayer">
            <div class="handle-tab" :class="tabIndex ? '' : 'active'" @click="tabIndex = 0">任务详情</div>
            <div class="handle-tab" :class="tabIndex ? 'active' : ''" @click="tabIndex = 1" style="top: 170px;">操作记录</div>
            <div class="info-box">
                <div class="info-header bt">
                    <el-select v-model="currentTask.holder_id" size="small" @clear="updateTaskHolder('', '')" filterable clearable placeholder="请选择负责人">
                        <el-option
                            @click.native="updateTaskHolder(item.staffId, item.staffName)"
                            v-for="item in rwlbPaticipants"
                            :key="item.staffId"
                            :label="item.staffName"
                            :value="item.staffId">
                        </el-option>
                    </el-select>
                    <span>
                        <el-date-picker 
                            size="small" 
                            v-model="currentTask.deadline_time" 
                            type="date" 
                            placeholder="截止日期" 
                            value-format="yyyy-MM-dd" 
                            :disabled="itemReadOnly"
                            @change="saveTaskDeadline()"> 
                        </el-date-picker>
                    </span>
                    <span class="right" style="margin-right: 0;" @click="hideInfo"><i class="iconfont icon-guanbi" style=""></i></span>
                    <el-dropdown trigger="click" class="right" >
                        <span class="right"><i class="iconfont icon-gengduo"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :disabled="itemReadOnly">设置重复任务</el-dropdown-item>
                            <el-dropdown-item :disabled="itemReadOnly">设置完成时间</el-dropdown-item>
                            <el-dropdown-item @click.native="deleteTask()" :disabled="itemReadOnly">删除任务</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="task" v-show="!tabIndex">
                    <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 5px 15px;">
                        <el-breadcrumb-item>{{currentTask.projectName||"项目名称"}}</el-breadcrumb-item>
                        <el-breadcrumb-item>{{currentTask.nodeName||"阶段名称"}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="bt" style="padding-bottom: 10px;">
                        <el-tooltip v-if="!currentTask.is_completed" class="item" effect="dark" content="点击标记任务完成" placement="bottom">
                            <span @click="changeTaskState" style="display: inline-block;width: 30px;height: 30px;border: 1px solid #333;cursor: pointer;border-radius: 50%;vertical-align: middle;"></span>
                        </el-tooltip>
                        <el-tooltip v-if="currentTask.is_completed" class="item" effect="dark" content="点击标记任务未完成" placement="bottom">
                            <span @click="changeTaskState"><i class="iconfont icon-wancheng" style="font-size: 34px;vertical-align: middle;cursor: pointer;"></i></span>
                        </el-tooltip>
                        <span style="font-size: 16px;vertical-align: middle;">{{currentTask.name||"任务名称"}}</span>
                    </div>
                    <div class="bt" style="padding: 5px;">
                        <p><i class="iconfont icon-miaoshuneirong" style="font-size: 24px;vertical-align: sub;"></i> 任务描述</p>
                        <div style="padding-left: 20px;">
                            <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 10}"
                            placeholder="任务内容描述"
                            label="currentTask.text_describe"
                            @change="saveTaskDescribe"
                            :disabled="itemReadOnly"
                            v-model="currentTask.text_describe">
                            </el-input>
                        </div>
                    </div>
                    <div class="bt" style="padding: 8px 5px;">
                        <div>
                            <i class="iconfont icon-youxianji" style="font-size: 24px;vertical-align: sub;"></i> 优先级
                            <p :class="'priority ' + getClass(currentTask.priority_)">
                                {{currentTask.priority_}}
                                <el-select v-model="currentTask.priority_" size="small" @change="updateTaskPriority" class="cus-select">
                                    <el-option value="高"></el-option>
                                    <el-option value="中"></el-option>
                                    <el-option value="低"></el-option>
                                    <el-option value="无"></el-option>
                                </el-select>
                            </p>
                        </div>
                    </div>
                    <div class="bt" style="padding: 8px 5px;">
                        <p>
                            <i class="iconfont icon-biaoqian" style="font-size: 24px;vertical-align: sub;"></i> 标签&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-tag :key="index" style="margin-right: 5px;" v-for="(tag, index) in currentTask.tags" closable :disable-transitions="false" @close="handleClose(index)">
                                {{tag}}
                            </el-tag>
                            <el-input style="width: 100px;height: 20px; margin-bottom: 5px;" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm"
                            >
                            </el-input>
                            <a v-else @click="showInput">&nbsp;&nbsp;<i class="iconfont icon-jia" style="vertical-align: top;font-size: 30px;color: #999;"></i></a>
                        </p>
                    </div>
                    <div class="bt" style="padding: 5px;">
                        <p>
                            <i class="iconfont icon-guanlian" style="font-size: 24px;vertical-align: sub;"></i> 业务关联项
                            <a>&nbsp;&nbsp;<i class="iconfont icon-jia" style="vertical-align: top;font-size: 30px;color: #999;"></i></a>
                        </p>
                        <ul style="padding: 5px 0;">
                            <li style="padding-left: 20px;list-style: disc;list-style-position: inside;">设备跟踪-发运批次-WIS-SMP1-03</li>
                        </ul>
                    </div>
                    <div class="bt" style="padding: 5px;">
                        <p style="margin-bottom: 5px;">
                            <i class="iconfont icon-liebiao2" style="font-size: 24px;vertical-align: sub;"></i> 子任务
                            <a @click="isShowChildAdd = true">&nbsp;&nbsp;<i class="iconfont icon-jia" style="vertical-align: top;font-size: 30px;color: #999;"></i></a>
                        </p>
                        <p class="cursor" style="margin-bottom: 10px; height: 26px; line-height: 24px; padding-left: 26px;" v-for="(item, index) in currentTask.sub_tasks" :key="index">
                            <span style="vertical-align: middle;">{{item.name}}</span>
                            <el-tooltip class="item" style="float: right;" effect="dark" :content="item.holder_name" placement="bottom" :disabled="!item.holder_name">
                                <span class="mark">{{staffShortName(item.holder_name)}}</span>
                            </el-tooltip>
                            <span style="vertical-align: middle;float: right;">{{item.deadline_time}}</span>
                        </p>
                        <div class="handle" v-show=isShowChildAdd>
                            <el-input size="small" style="width: 200px;" v-model="childTaskForm.name" placeholder="新的任务名称" :rules="rules"></el-input>&nbsp;&nbsp;
                            <el-select v-model="childTaskForm.holder_id" size="small" style="width: 90px;" filterable clearable placeholder="负责人">
                                <el-option
                                @click.native="childTaskForm.holder_name = item.staffName"
                                v-for="item in rwlbPaticipants"
                                :key="item.staffId"
                                :label="item.staffName"
                                :value="item.staffId">
                                </el-option>
                            </el-select>&nbsp;&nbsp;
                            <el-date-picker size="small" style="width: 140px;" v-model="childTaskForm.deadline_time" type="date" placeholder="截止日期" value-format="yyyy-MM-dd"> </el-date-picker>&nbsp;&nbsp;
                            <span><el-button size="small"  type="primary" @click="addChildTask">创建</el-button></span>&nbsp;&nbsp;
                            <span><el-button size="small" type="info" @click="hideChildTaskForm">取消</el-button></span>
                        </div>
                    </div>
                    <div class="bt" style="padding: 5px;">
                        <p style="margin-bottom: 5px;">
                            <i class="iconfont icon-guanlian1" style="font-size: 24px;vertical-align: sub;"></i> 关联任务
                            <a @click="dialogRelate = true">&nbsp;&nbsp;<i class="iconfont icon-jia" style="vertical-align: top;font-size: 30px;color: #999;"></i></a>
                        </p>
                        <p v-for="(item, index) in currentTask.relate_tasks" :key="index" style="margin-bottom: 10px; height: 26px; line-height: 24px; padding-left: 26px;">
                            <span style="vertical-align: middle;">{{item.name}}</span>
                            <span class="text-base cursor" style="vertical-align: middle;float: right;" @click="delRelateTask(item, index)">取消关联</span>
                            <el-tooltip class="item" style="float: right; margin-right:6px;" effect="dark" :content="item.holder_name" placement="bottom" :disabled="!item.holder_name">
                                <span class="mark">{{staffShortName(item.holder_name)}}</span>
                            </el-tooltip>
                        </p>
                    </div>
                    <div class="bt" style="padding: 5px;">
                        <p style="margin-bottom: 5px;">
                            <i class="iconfont icon-fujian" style="font-size: 24px;vertical-align: sub;"></i> 附件列表
                            <a>&nbsp;&nbsp;<i class="iconfont icon-jia" style="vertical-align: top;font-size: 30px;color: #999;"></i></a>
                            &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base">批量下载</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base">删除</a>
                        </p>
                        <el-table class="table" ref="table" :data="tableData1"
                                max-height="200" border style="width: 100%;">
                            <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
                            <el-table-column prop="ownerCname" :show-overflow-tooltip="true" label="序号"></el-table-column>
                            <el-table-column prop="cusType" :show-overflow-tooltip="true" label="文件名称"></el-table-column>
                            <el-table-column prop="cusSize" :show-overflow-tooltip="true" label="最近修改人"></el-table-column>
                            <el-table-column prop="industry" :show-overflow-tooltip="true" label="修改时间"></el-table-column>
                            <el-table-column prop="phone" :show-overflow-tooltip="true" label="文件大小"></el-table-column>
                        </el-table>
                    </div>
                    <div class="bt" style="padding: 5px;">
                        <p style="margin-bottom: 5px;">
                            <i class="iconfont icon-shenpi1" style="font-size: 24px;vertical-align: sub;"></i> 审批节点
                            <a>&nbsp;&nbsp;<i class="iconfont icon-jia" style="vertical-align: top;font-size: 30px;color: #999;"></i></a>
                            &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base">选择审核文件</a>
                        </p>
                        <el-table class="table" ref="table" :data="tableData1"
                                max-height="200" border style="width: 100%;">
                            <el-table-column prop="ownerCname" :show-overflow-tooltip="true" label="序号"></el-table-column>
                            <el-table-column prop="cusType" :show-overflow-tooltip="true" label="审批人"></el-table-column>
                            <el-table-column prop="phone" :show-overflow-tooltip="true" label="操作">
                                <template slot-scope="scope">
                                    <a class="text-base">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div style="padding: 10px;">
                        <p>
                            <el-input ref="viewInput" placeholder="试试@任务成员" size="mini" style="width: 510px;" 
                              v-model="currentComment" @input="viewChange"
                            ></el-input>
                            <a class="save-btn" @click="addComment">提交</a>
                            <a class="save-btn" @click="testComment">测试提取</a>
                        </p>
                    </div>
                </div>
                <div class="record" v-show="tabIndex">
                    <div class="bt" style="padding: 5px;">
                        <p>
                            <i class="iconfont icon-jilu1" style="font-size: 24px;vertical-align: sub;"></i> 历史记录
                        </p>
                        <ul style="padding: 5px 0;">
                            <div class="item" v-for="(item, index) in currentTask.historys" :key="index" >
                                <li style="padding-left: 20px;">{{getNormalFormatDatetime(item.create_time)+"  "+item.info}}</li>
                            </div>
                        </ul>
                    </div>
                    <div class="bt" style="padding: 5px;">
                        <p>
                            <i class="iconfont icon-pinglun" style="font-size: 24px;vertical-align: sub;"></i> 评论记录
                        </p>
                        <ul style="padding: 5px 0;">
                            <div class="item" v-for="(item, index) in currentTask.comments" :key="index" >
                                <li style="padding-left: 20px;">{{getNormalFormatDatetime(item.create_time)+"  "+item.create_user_cname+" : "+item.text}}</li>
                            </div>
                        </ul>
                    </div>
                </div>
                <div style="padding: 5px;border-top: 1px solid #333;">
                    <p style="margin-bottom: 5px;" class="paticipant-box">
                        参与者&nbsp;&nbsp;
                        <a @click="addPaticipant"><i class="iconfont icon-jia" style="font-size: 30px;color: #999;"></i></a>
                        <span v-for="(item, index) in currentTask.paticipants" :key="index">{{item.split("/")[1]}}</span>
                    </p>
                    <el-select style="width: 400px;" size="small" ref="addPaticipant" v-show="showPaticipant" v-model="currentTask.paticipants" filterable multiple placeholder="请选择" @visible-change="updateTaskPaticipants">
                        <el-option
                        v-for="item in rwlbPaticipants"
                        :key="item.staffId"
                        :label="item.staffId + '/' + item.staffName"
                        :value="item.staffId + '/' + item.staffName">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <!--关联任务弹框-->
        <el-dialog class="relateDialog" title="关联任务" width="60%" :visible.sync="dialogRelate" :close-on-click-modal='false'>
            <div class="relate-box">
                <div class="relate1" style="border-right: 2px solid #d7d7d7;">
                    <p class="relate-label">类别列表</p>
                    <div style="height: 400px; overflow: auto;">
                        <p v-for="(item, index) in relateTypeList" :key="index" class="cursor" style="padding: 0 10px;" :style="typeIndex == index? 'background: #d7d7d7;' :''" @click="relateTypeClick(item, index)">{{item.label}}</p>
                    </div>
                </div>
                <div class="relate2" style="border-right: 2px solid #d7d7d7;">
                    <p class="relate-label">任务树</p>
                    <div style="height: 400px; overflow: auto;">
                        <el-tree :data="relateTreeList" :props="defaultProps" node-key="id" default-expand-all style="float: left;min-width: 120px;background: #f2f2f2;" @node-click="chooseRelateNote" :expand-on-click-node="false">
                            <div :class="data.id == id ? 'text-base' : ''" slot-scope="{ node, data }">
                                {{data.label}}
                            </div>
                        </el-tree>
                    </div>
                </div>
                <div class="relate3" :style="relateTaskChildList.length ? 'border-right: 2px solid #d7d7d7;' : ''">
                    <p class="relate-label">任务列表</p>
                    <div style="height: 400px; overflow: auto;">
                        <p class="cursor" @click="relateTaskClick(item)" style="margin-bottom: 10px; height: 26px; padding: 0 10px; line-height: 24px;" :style="relateTaskId == item.id? 'background: #d7d7d7;' :''" v-for="(item, index) in relateTaskList" :key="index">
                            <span style="vertical-align: middle;">{{item.name}}</span>
                            <el-tooltip class="item" style="float: right;" effect="dark" :content="item.holder_name" placement="bottom" :disabled="!item.holder_name">
                                <span class="mark">{{staffShortName(item.holder_name)}}</span>
                            </el-tooltip>
                        </p>
                    </div>
                </div>
                <div class="relate4" v-show="relateTaskChildList.length">
                    <p class="relate-label">子任务</p>
                    <div style="height: 400px; overflow: auto;">
                        <p class="cursor" @click="relateTaskChildClick(item)" style="margin-bottom: 10px; height: 26px; line-height: 24px; padding: 0 10px;" :style="relateChildTaskId == item.id? 'background: #d7d7d7;' :''" v-for="(item, index) in relateTaskChildList" :key="index">
                            <span style="vertical-align: middle;">{{item.name}}</span>
                            <el-tooltip class="item" style="float: right;" effect="dark" :content="item.holder_name" placement="bottom" :disabled="!item.holder_name">
                                <span class="mark">{{staffShortName(item.holder_name)}}</span>
                            </el-tooltip>
                        </p>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="relateSave">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            /***************************  左侧树   *************************/
                treeList: [],                   //  节点树
                defaultProps: {                 //  
                    children: 'children',
                    label: 'label'
                },
                projectId:"7a7f5507-84a1-4f6d-b2ab-8abe4fa7b382",           //  项目id
                hasChildren:true,           //  是否有子节点
                id: '',                         //  当前节点id
                ids: '',                         //  当前节点下的所有id
            /***************************  任务列表   *************************/
                isLayer: false,                 //  是否显示任务详情
                c_taskList:[],                  //  已完成任务列表
                taskList:[],                    //  未完成任务列表
                
                
            /***************************  新增任务   *************************/
                rwlbPaticipants:[],         //  项目参与者列表      
                isShowAdd:false,            //  是否显示创建任务
                aNewTask:{},                //  创建任务
                rules: {                    //  新增任务规则
                    name: [
                        { required: true, message: '请输入新的任务名称', trigger: 'blur' },
                        { min: 1, max: 200, message: '长度在200个字符以内', trigger: 'blur' }
                    ],
                },

            /***************************  任务详情   *************************/
                currentTask:{},                 //  任务详情信息
                tabIndex: 0,                    //  详情tab， 0：任务详情，1：操作记录
                itemReadOnly:false,             //  是否只读
                permission:{                    //  权限
                    editZrr:false,
                },
                tableData1: [],                 //  附件列表
                tableData2: [],                 //  审批列表

                //  添加标签   
                inputVisible: false,            //  是否显示输入框
                inputValue: '',                 //  输入框文本

                //  子任务   
                isShowChildAdd: false,          //  是否显示子任务添加框
                childTaskForm: {},                  //  新增子任务
                
                //  关联任务
                dialogRelate: false,            //  关联任务模态框
                relateTypeList: [],            //  关联类别列表
                typeIndex: -1,
                relateTreeList: [],            //  关联树列表
                relateTaskList: [],            //  关联任务列表
                relateTaskId: '',              //  点击的任务列表id
                relateTaskChildList: [],       //  关联子任务列表
                relateChildTaskId: '',         //  点击的子任务列表id
                relateTaskDict: {},            //  确定选中的任务

                //  添加参与者   
                showPaticipant: false,          //  是否隐藏添加参与者选择框

                //添加评论
                currentComment:'',              //当前项目正在添加的评论
                

            };
        },
        mounted(){
            this.getTreeList()
            this.getAllTaskList()
            
        },
        methods: {
        /***************************  左侧树   *************************/
            //  获取所有节点
            getTreeList(){
                this.$post("/api/tm/taskManagePR/queryTmTree",{projectId:this.projectId}, (data) => {
                  this.treeList = data.list;
                  this.relateTypeList = data.list[0].children || [];
                })
            },
            //  选择子节点
            chooseNote(data){
                let ids = []
                let str = JSON.stringify(data)
                let list = str.split('"id":')
                list.shift()
                list.map(item => {
                    ids.push(item.split('"')[1])
                })
                this.ids = ids
                this.id = data.id
                if(!data.children){
                    this.hasChildren=false;
                }else{
                    this.hasChildren=true;
                    this.isShowAdd=false;
                    this.aNewTask = {}
                }
                this.flushTmTaskList(this.ids);
                this.getRwlbPaticipants()
            },
        /***************************  任务列表   *************************/
            //  获取所有任务列表
            getAllTaskList(){
                this.$post("/api/tm/taskManagePR/queryTmTask",{projectId:this.projectId}, (data) => {
                    this.taskList = data.list;
                    this.c_taskList = data.c_list;
                })
            },
            //  获取当前子节点的任务列表
            flushTmTaskList(ids){
                this.$post("/api/tm/taskManagePR/queryTmTask",{nodeIds:ids}, (data) => {
                  this.taskList = data.list;
                  this.c_taskList = data.c_list;
                })
            },
            //  获取所有参与者
            getRwlbPaticipants(){
                this.$post("/api/tm/taskManagePR/queryRwlbPaticipants",{nodeId:this.id}, (data) => {
                  this.rwlbPaticipants = data.list;
                })
            },
            //  认领人简称
            staffShortName(name){
                name = name || ''
                return name.slice(0,1)
            },
        /***************************  新增任务   *************************/
            //  是否显示新增任务
            showAddItem(){
                this.aNewTask = {}
                this.isShowAdd= true;
            },
            //  新增任务
            addTask(){
                if(!this.aNewTask.name){
                    this.$message("请输入新任务名称")
                    return
                }
                this.aNewTask.holder_id = this.aNewTask.holder_id || ''
                this.aNewTask.holder_name = this.aNewTask.holder_name || ''
                this.aNewTask.nodeId = this.id
                this.aNewTask.projectId=this.projectId
                this.$post("/api/tm/taskManagePR/addTmTask",this.aNewTask, (data) => {
                    this.aNewTask={}
                    this.isShowAdd = false
                    this.taskList.unshift(data.task)
                    if(data.newhistory){
                        this.currentTask.historys.unshift(data.newhistory)
                    }
                })  
            },
        /***************************  任务详情   *************************/
            updateTaskHolder(id, name){
                this.currentTask.holder_id = id
                this.currentTask.holder_name = name
                this.$post("/api/tm/taskManagePR/updateTaskHolder", this.currentTask, (data) =>{
                    this.$message.success("操作成功！");
                })
            },
            //  显示任务详情
            showInfo(item){
              console.log(item)
                this.isLayer = true
                this.currentTask = item
                if(this.rwlbPaticipants.length){
                    if(item.is_completed==0){ 
                        this.itemReadOnly=false
                    }else{ 
                        this.itemReadOnly=true
                    }
                    $(".info").animate({right: "20px"})
                }else{
                    this.$post("/api/tm/taskManagePR/queryRwlbPaticipants",{nodeId:item.node_id}, (data) => {
                        this.rwlbPaticipants = data.list;
                        if(item.is_completed==0){ 
                            this.itemReadOnly=false
                        }else{ 
                            this.itemReadOnly=true
                        }
                        $(".info").animate({right: "20px"})
                    })
                }
                this.currentComment=''
                this.getPermissonOfCurrentTask()//获取当前登录人对所选任务的权限
            },
            //  隐藏任务详情
            hideInfo(){
                $(".info").animate({right: "-700px"}, () => {
                    this.isLayer = false
                    this.tabIndex = 0
                })
            },
            //  保存任务描述
            saveTaskDescribe(){
                this.$post("/api/tm/taskManagePR/updateTaskDescribe",{id:this.currentTask.id,text_describe:this.currentTask.text_describe}, (data) => {
                    this.$message.success("保存成功！");
                })  
            },
            //  设置截止时间
            saveTaskDeadline(){
                this.$post("/api/tm/taskManagePR/updateTaskDeadline",this.currentTask, (data) => {
                   this.$message.success("操作成功！");
                   if(data.newhistory){
                     this.currentTask.historys.unshift(data.newhistory)
                   }
                })  
            },
            //  修改任务状态
            changeTaskState(){
                console.log(this.permission.editZrr)
                if(this.permission.editZrr){
                    this.$post("/api/tm/taskManagePR/changeTaskState",this.currentTask, (data) => {
                        this.$message.success("操作成功！");
                        this.hideInfo()
                        if(this.id){
                            this.flushTmTaskList(this.ids)
                        }else{
                            this.getAllTaskList()
                        }
                    })  
                }else{
                    this.$message.error("您没有操作权限！");
                }
            },
            //  删除任务
            deleteTask(){
                this.$post("/api/tm/taskManagePR/deleteTask",this.currentTask, (data) => {
                    this.hideInfo()
                })  
            },
            //  获取优先级背景色
            getClass(name){
                let className = ''
                if(name == '高'){
                    className = 'high'
                }else if(name == '中'){
                    className = 'middle'
                }else if(name == '低'){
                    className = 'low'
                }
                return className
            },
            //  修改优先级
            updateTaskPriority(){
                console.log(this.currentTask.priority_)
                this.$post("/api/tm/taskManagePR/updateTaskPriority", this.currentTask, (data) => {
                    if(data.newhistory){
                        this.currentTask.historys.unshift(data.newhistory)
                    }
                })
            },

            //  获取当前任务的参与人的权限
            getPermissonOfCurrentTask(){
                this.$post("/api/tm/taskManagePR/getAllPermisson",this.currentTask, (data) => {
                  this.permission.editZrr = data.editZrr;
                })
            },
            //  获取正常格式时间
            getNormalFormatDatetime(time){
                var d = new Date(time);
                var times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + this.PrefixZero(d.getHours(),2) + ':' + this.PrefixZero(d.getMinutes(),2) + ':' + this.PrefixZero(d.getSeconds(),2); 
                return times;
            },
            //用0补齐位数
            PrefixZero(num, n) {
                return (Array(n).join(0) + num).slice(-n);
            },
        /***************************  添加标签   *************************/
            //  删除
            handleClose(index) {
                let tags = this.deepClone(this.currentTask.tags)
                this.currentTask.tags.splice(index, 1);
                this.$post("/api/tm/taskManagePR/setTaskTag", {id: this.currentTask.id, tags_: this.currentTask.tags.join(",")}, (data) => {
                    if(data.newhistory){
                        this.currentTask.historys.unshift(data.newhistory)
                    }
                })
            },
            //  编辑
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //  添加
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.currentTask.tags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
                this.$post("/api/tm/taskManagePR/setTaskTag", {id: this.currentTask.id, tags_: this.currentTask.tags.join(",")}, (data) => {
                    if(data.newhistory){
                        this.currentTask.historys.unshift(data.newhistory)
                    }
                })
            },
        /***************************  新增子任务   *************************/
            hideChildTaskForm(){
                this.isShowChildAdd = false
                this.childTaskForm = {}
            },
            //  新增子任务
            addChildTask(){
                if(!this.childTaskForm.name){
                    this.$message.error("请输入新任务名称")
                    return
                }
                this.childTaskForm.holder_id = this.aNewTask.holder_id || ''
                this.childTaskForm.holder_name = this.aNewTask.holder_name || ''
                this.childTaskForm.parent_task_id = this.currentTask.id
                this.childTaskForm.projectId = this.projectId
                this.$post("/api/tm/taskManagePR/addTmTask",this.childTaskForm, (data) => {
                    this.childTaskForm={}
                    this.isShowChildAdd = false
                    this.currentTask.sub_tasks.unshift(data.task)
                    if(data.newhistory){
                        this.currentTask.historys.unshift(data.newhistory)
                    }
                })  
            },
        /***************************  关联任务   *************************/
            //  类别列表点击
            relateTypeClick(item, index){
                this.typeIndex = index
                this.relateTreeList = item.children || []
                this.relateTaskList = []
                this.relateTaskChildList = []
            },
            //  任务列表点击
            relateTaskClick(item){
                this.relateTaskId = item.id
                this.relateTaskChildList = item.sub_tasks || []
                this.relateTaskDict.relate_task_id = item.id
                this.relateTaskDict.relate_task_name = item.name
                this.relateChildTaskId = ''
            },
            //  子任务点击
            relateTaskChildClick(item){
                this.relateChildTaskId = item.id
                this.relateTaskDict.relate_task_id = item.id
                this.relateTaskDict.relate_task_name = item.name
            },
            //  选择子节点
            chooseRelateNote(data){
                let ids = []
                let str = JSON.stringify(data)
                let list = str.split('"id":')
                list.shift()
                list.map(item => {
                    ids.push(item.split('"')[1])
                })
                this.$post("/api/tm/taskManagePR/queryTmTask",{nodeIds:ids}, (data) => {
                  this.relateTaskList = data.list.concat(data.c_list);
                  this.relateTaskChildList = []
                })
            },
            //  确定选中
            relateSave(){
                if(!this.relateTaskDict.relate_task_id){
                    this.dialogRelate = false
                    return
                }
                let params = {
                    id: this.currentTask.id,
                    relate_task_id: this.relateTaskDict.relate_task_id,
                    relate_task_name: this.relateTaskDict.relate_task_name
                }
                this.$post("/api/tm/taskManagePR/addRelateTask", params, (data) => {
                    this.$message.success("关联成功！")
                    this.currentTask.relate_tasks.unshift(data.relate_task)
                    this.dialogRelate = false
                })
            },
            //  取消关联
            delRelateTask(item, index){
              let params = {
                  id: this.currentTask.id,
                  relate_task_id: item.id,
                  relate_task_name: item.name
              }
              this.$post("/api/tm/taskManagePR/delRelateTask", params, (data) => {
                  this.$message.success("取消关联成功！")
                  this.currentTask.relate_tasks.splice(index,1)
              })
            },
        /***************************  修改参与者   *************************/
            //  打开参与者多选框
            addPaticipant(){
                this.showPaticipant = true
                setTimeout(() => {
                    this.$refs.addPaticipant.focus()
                }, 0)
            },
            updateTaskPaticipants(flag){
                if(!flag){
                    this.showPaticipant = false
                    this.$post("/api/tm/taskManagePR/updateTaskPaticipants", {id: this.currentTask.id, paticipantList: this.currentTask.paticipants}, (data) => {
                        //console.log(data)
                        if(data.newhistory){
                            this.currentTask.historys.unshift(data.newhistory)
                        }
                    })
                }
            },
        /***************************  添加评论   *************************/
            addComment(){
                this.$post("/api/tm/taskManagePR/addTaskComment", {id: this.currentTask.id, comment: this.currentComment,projectId:this.currentTask.project_id}, (data) => {
                    this.currentTask.comments.unshift(data.comment)
                    this.currentComment=''
                })
            },
            testComment(){
                this.$post("/api/tm/taskManagePR/queryTaskMembers", {id: this.currentTask.id, comment: this.currentComment}, (data) => {
                    console.log(data)
                })
            },
            viewChange(){
              let str = this.currentComment.slice(-1)
              console.log(window.getSelection())
              if(str == '@'){
                console.log(3333)
              }
            },
        }
    }
</script>
<style lang="less" scoped>
    .wrap-box{
        display: flex;
        height: 100%;
        font-size: 12px;
        position: relative;
    }
    .wrap-left{
        min-width: 200px;
        border-right: 1px solid #ddd;
    }
    .wrap-right{
        flex: 1;
        padding: 20px;
        .handle{
            margin-bottom: 10px;
        }
        .title{
            font-size: 18px;
            font-weight: bold;
            line-height: 40px;
        }
        .item{
            border-bottom: 1px solid #ddd;
            padding: 5px 20px;
            cursor: pointer;
            overflow: hidden;
            .item-left{
                float: left;
                line-height: 24px;
                .warn{
                    color: red;
                    font-weight: bold;
                }
            }
            .item-right{
                float: right;
                .tag{
                    display: inline-block;
                    width: 70px;
                    height: 18px;
                    text-align: center;
                    margin-right: 10px;
                }
            }
        }
    }
    .mark{
        display: inline-block;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        border: 1px solid #ddd; 
        text-align: center;
        line-height: 24px;
        padding: 0 !important;
        margin: 0;
        margin-left: 10px;
        vertical-align: middle;
    }
    .layer{
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .bt{
        border-bottom: 1px solid #333;
    }
    .cursor{
        cursor: pointer;
    }
    .info{
        position: fixed;
        width: 600px;
        height: 94%;
        right: -700px;
        top: 20px;
        border: 1px solid #ddd;
        background: #fff;
        padding: 0 15px;
        .info-box{
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .handle-tab{
            position: absolute;
            width:  20px;
            font-weight: bold;
            background: #ccc;
            color: #fff;
            padding: 6px;
            text-align: center;
            top: 80px;
            left: -28px;
            cursor: pointer;
            &.active{
                background: #f1a325;
            }
        }
        .info-header{
            padding: 5px 0;
            i{
                font-size: 32px;
                vertical-align: middle;
                color: #797979;
            }
            span{
                margin-right: 20px;
                cursor: pointer;
            }
        }
        .priority{
            position: relative;
            background: #ddd;
            padding: 2px 16px;
            display: inline-block; 
            width: 16px;
            color: #fff;
            border-radius: 4px;
            margin-left: 10px;
            &.high{
                background: red;
            }
            &.middle{
                background: #f1a325;
            }
            &.low{
                background: #03b8cf;
            }
            .cus-select{
                position: absolute;
                top: -8px;
                left: 0;
                width: 100%;
                height: 24px;
                opacity: 0;
            }
        }
        .task, .record{
            flex: 1;
            overflow: auto;
        }
        .save-btn{
            display: inline-block;
            width: 60px;
            background: #169bd5;
            height: 28px;
            vertical-align: top;
            text-align: center;
            line-height: 28px;
            color: #fff;
            border-radius: 4px;
            margin-left: 5px;
        }
        .paticipant-box{
            span{
                background: #409EFF;
                color: #fff;
                padding: 4px 10px;
                margin-left: 10px;
                border-radius: 6px;
                position: relative;
                top: 3px;
            }
        }
    }
    .icon-jia{
        vertical-align: middle;
        display: inline-block;
        line-height: 1;
    }
    .relate-box{
        display: flex;
        background: #f2f2f2;
        >div{
            min-width: 100px;
            >p{
                margin: 8px 0;
                text-align: center;
            }
        }
        .relate-label{
            font-size: 20px;
            font-weight: bold;
        }
        .relate1{
            
        }
    }
</style>
<style lang="less">
    .el-tag--info{
        display: none;
    }
    .relateDialog .el-dialog__body{
        background: #f2f2f2;
        padding: 0;
        .el-tree__empty-block{
            display: none;
        }
    }
</style>



