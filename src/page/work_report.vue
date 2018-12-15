<template>
    <div class="wrap work-report">
        <el-form ref="form" label-width="84px" size="small">
            <el-form-item label="报告类型：">
                <span :class="tabIndex == 0 ? 'report-item active' : 'report-item'" @click="clickTab(0)">日报</span>
                <span :class="tabIndex == 1 ? 'report-item active' : 'report-item'" @click="clickTab(1)">周报</span>
                <span :class="tabIndex == 2 ? 'report-item active' : 'report-item'" @click="clickTab(2)">月报</span>
            </el-form-item>
            <el-form-item label="提交人：" v-show="staffList.length">
                <el-select size="small" v-model="staffUserId" filterable style="width: 200px;" @change="chooseStaff">
                    <el-option
                    v-for="item in staffList"
                    :key="item.userName"
                    :label="item.cname"
                    :value="item.userName">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" size="small" @click="addBtn">新增</el-button>
        </el-form>
        <el-table v-show="tabIndex == 0" class="table" :data="dateList" max-height="500" border style="width: 100%; margin-top: 20px;" 
            :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
            <el-table-column prop="date" label="日期">
                <template slot-scope="scope">{{scope.row.createTime.split(" ")[0]}}</template>
            </el-table-column>
            <el-table-column prop="report_type" label="名称">
                <template slot-scope="scope">
                    <a class="text-base" style="margin-right: 10px;" @click="check(scope.row)">{{scope.row.createUserName}}的日报</a>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="提交时间"></el-table-column>
            <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                    <a v-if="scope.row.createUserId == userId" class="text-base" style="margin-right: 10px;" @click="editReport(scope.row)">修改</a>
                </template>
            </el-table-column>
        </el-table>
        <el-table v-show="tabIndex == 1" class="table" :data="weekList" max-height="500" border style="width: 100%; margin-top: 20px;" 
            :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
            <el-table-column prop="date" label="日期">
                <template slot-scope="scope">{{scope.row.createTime.split(" ")[0]}}</template>
            </el-table-column>
            <el-table-column prop="report_type" label="名称">
                <template slot-scope="scope">
                    <a class="text-base" style="margin-right: 10px;" @click="check(scope.row)">{{scope.row.createUserName}}的周报</a>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="提交时间"></el-table-column>
            <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                    <a v-if="scope.row.createUserId == userId" class="text-base" style="margin-right: 10px;" @click="editReport(scope.row)">修改</a>
                </template>
            </el-table-column>
        </el-table>
        <el-table v-show="tabIndex == 2" class="table" :data="monthList" max-height="500" border style="width: 100%; margin-top: 20px;" 
            :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
            <el-table-column prop="date" label="日期">
                <template slot-scope="scope">{{scope.row.createTime.split(" ")[0]}}</template>
            </el-table-column>
            <el-table-column prop="report_type" label="名称">
                <template slot-scope="scope">
                    <a class="text-base" style="margin-right: 10px;" @click="check(scope.row)">{{scope.row.createUserName}}的月报</a>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="提交时间"></el-table-column>
            <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                    <a v-if="userId == scope.row.createUserId" class="text-base" style="margin-right: 10px;" @click="editReport(scope.row)">修改</a>
                </template>
            </el-table-column>
        </el-table>
        <!-- 新增工作报告模态框 -->
        <el-dialog title="新增工作报告" :visible.sync="dialogAddVisible" :close-on-click-modal='false' @close="isEdit = false" width="1000px">
            <el-form>
                <el-form-item label="报告类型：" style="margin-bottom: 0;">
                    <span v-show="!isEdit" :class="subIndex == 0 ? 'report-item active' : 'report-item'" @click="subIndex = 0">日报</span>
                    <span v-show="!isEdit" :class="subIndex == 1 ? 'report-item active' : 'report-item'" @click="subIndex = 1">周报</span>
                    <span v-show="!isEdit" :class="subIndex == 2 ? 'report-item active' : 'report-item'" @click="subIndex = 2">月报</span>
                    <span v-show="isEdit" class="report-item">{{editItem.reportType}}</span>
                </el-form-item>
                <p style="margin-bottom: 10px;">日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{getDate()}}</p>
                <el-form-item label="签到情况：">
                    <el-table v-show="subIndex != 2" class="table" :data="signList" border style="width: 600px;" 
                        :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
                        <el-table-column prop="visitType" label="签到类型" width="100"></el-table-column>
                        <el-table-column prop="visitTime" label="签到时间" width="200"></el-table-column>
                        <el-table-column prop="visitAddress" label="签到地点"></el-table-column>
                    </el-table>
                    <el-table v-show="subIndex == 2" class="table" :data="signTimesList" border style="width: 600px;" 
                        :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
                        <el-table-column prop="type0" label="正常办公"></el-table-column>
                        <el-table-column prop="type1" label="国内出差"></el-table-column>
                        <el-table-column prop="type2" label="国外出差"></el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="本月机会：" class="oppo" v-show="subIndex == 2">
                    <el-table class="table" :data="oppoList"
                            border style="width: 100%;">
                        <el-table-column prop="oppoName" label="机会名称" width="120"></el-table-column>
                        <el-table-column prop="oppoMarketingSection" label="营销阶段" width="120"></el-table-column>
                        <el-table-column prop="oppoFollowStatus" label="跟进状态" width="120"></el-table-column>
                        <el-table-column prop="oppoType" label="机会类别" width="120"></el-table-column>
                        <el-table-column prop="amount" label="预计营销金额" width="120"></el-table-column>
                        <el-table-column prop="" label="本月情况" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <div style="height: 24px;">
                                <input v-model="scope.row.oppoOverview" style="display: none; width: 100%;height: 100%;	" @blur="editBlur">
                                <p style="height: 24px;" @click="editThis">{{scope.row.oppoOverview}}</p>
                            </div>
                        </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <span class="text-base" @click="deleteColumn(scope.$index)">删除</span>
                            </template>
                        </el-table-column>
                        <div slot="append" style="text-align: center; position: relative;" @click="addColumn(item.name)">+
                            <el-select size="small" v-model="oppoName" filterable style="width: 100%;position: absolute;left: 0; opacity: 0;" @change="addColumn">
                                <el-option
                                v-for="item in oppoAllList"
                                :key="item.id"
                                :label="item.opportunityName"
                                :value="item">
                                </el-option>
                            </el-select>
                        </div>
                    </el-table>
                </el-form-item>
                <el-form-item label="工作总结：" prop="summary">
                    <el-input type="textarea" v-model="summary" resize="none" placeholder="" :rows="4" style="width: 600px;"></el-input>
                </el-form-item> 
                <el-form-item label="其它事项：" prop="plan">
                    <el-input type="textarea" v-model="otherItem" resize="none" placeholder="" :rows="4" style="width: 600px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 查看工作报告模态框 -->
        <el-dialog :title="workReport.createUserName + '的' + workReport.reportType" :visible.sync="dialogCheckVisible" :close-on-click-modal='false' width="1000px">
            <p>类型：{{workReport.reportType}}</p>
            <p v-show="tabIndex == 0">日期：{{date}}</p>
            <p v-show="tabIndex == 1">日期：{{week}}</p>
            <p v-show="tabIndex == 2">日期：{{date.slice(0,7)}}</p>
            <el-table v-show="tabIndex != 2" class="table" :data="signList" border style="width: 400px; margin: 20px 0;" 
                :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
                <el-table-column prop="visitType" label="签到类型"></el-table-column>
                <el-table-column prop="visitTime" label="签到时间"></el-table-column>
            </el-table>
            <el-table v-show="tabIndex == 2" class="table" :data="signTimesList" border style="width: 400px; margin: 20px 0;" 
                :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
                <el-table-column prop="type0" label="正常办公"></el-table-column>
                <el-table-column prop="type1" label="国内出差"></el-table-column>
                <el-table-column prop="type2" label="国外出差"></el-table-column>
            </el-table>
            <p v-show="tabIndex == 2">本月机会：</p>
            <el-table v-show="tabIndex == 2" class="table" :data="workReport.oppoList" border style="width: 100%; margin: 20px 0;" 
                :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
                <el-table-column prop="oppoName" label="机会名称"></el-table-column>
                <el-table-column prop="oppoMarketingSection" label="营销阶段"></el-table-column>
                <el-table-column prop="oppoFollowStatus" label="跟进状态"></el-table-column>
                <el-table-column prop="oppoType" label="机会类别"></el-table-column>
                <el-table-column prop="amount" label="预计营销金额"></el-table-column>
                <el-table-column prop="oppoOverview" label="本月概况"></el-table-column>
            </el-table>
            <p>工作总结：</p>
            <div style="padding: 5px 20px 5px 70px;">{{workReport.summary}}</div>
            <p>其它事项：</p>
            <div style="padding: 5px 20px 5px 70px;">{{workReport.otherItem}}</div>
            <p>评论：</p>
            <div v-for="(item, index) in workReviews" :key="index" style="margin-bottom: 10px;">
                <p style="padding-left: 40px;" class="text-base">{{item.createUserName}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.createTime}} :</p>
                <p style="padding-left: 80px;">{{item.content}}</p>
            </div>
            <div v-show="!workReviews.length" style="margin-bottom: 10px;">
                <p style="padding-left: 40px;">暂无评论</p>
            </div>
            <div>
                <el-input type="textarea" v-model="review" placeholder="请输入评论" :rows="1" :autosize="true" resize="none" style="width: 600px;"></el-input>
                &nbsp;&nbsp;<el-button type="primary" size="small" @click="saveReview(workReport.id)">评论</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState, mapActions, mapMutations } from 'vuex'
    export default {
        data() {
            return {
                dialogAddVisible: false,    
                dialogCheckVisible: false,
                
                subIndex: '',       //  新增报告的index
                oppoAllList: [],    //  总机会列表
                oppoList:  [],      //  选中的机会列表
                oppoName: '',       //  避免报错加的（无用）
                otherItem: '',      //  其它事项
                summary: '',         //  总结
                staffList: [],      //  员工列表
                staffUserId: '',

                editItem: {},       //  当前修改的对象
                isEdit: false,      //  是否在修改

                tabIndex: -1,    
                list: ["日报", "周报", "月报"],
                dateList: [],
                weekList: [],
                monthList: [],
                userId: '',

                date: '',       //  查看报告的提交时间
                week: '',       //  查看报告的提交时间
                workReport: {}, //  查看的报告
                workReviews: [],    //  查看报告的评论
                signList: [],
                signTimesList: [],  //  签到次数

                review: ''      //  评论
            }
        },
        activated(){
            this.clickTab(0)
        },
        methods: {  
            //  选择提交人
            chooseStaff(val){
                this.clickTab(this.tabIndex, val)
            },
            //  切换tab
            clickTab(index, userId){
                this.tabIndex = index
                let params = {reportType: this.list[index]}
                if(userId) params.userId = userId
                this.$post("/crm/workReportPR/queryAll", params, (data) => {
                    this.userId = data.userId
                    if(!this.staffList.length) this.staffList = data.staffList
                    this.workReport = data.list[0] || {}
                    if(index == 0){
                        this.dateList = data.list
                    }else if(index == 1){
                        this.weekList = data.list
                    }else{
                        this.monthList = data.list
                    }
                })
            },
            
        /****************************************新增***************************** */
            addBtn(){
                this.oppoList = []
                this.otherItem = ''
                this.summary = ''
                this.dialogAddVisible = true
                this.subIndex = this.tabIndex
                this.getVisit(new Date())
                this.getOppoList()
            },
            getDate(){
                var date = new Date()
                if(this.subIndex == 0){
                    return this.formatDate(date, "yyyy-MM-dd")
                }else if(this.subIndex == 1){
                    var week = this.getWeek(date)
                    return week.join("~")
                }else if(this.subIndex == 2){
                    var week = this.getMonthtDate(date)
                    return this.formatDate(date, "yyyy-MM-dd").slice(0,7)
                }
            },
            save(){
                if(this.isEdit){
                    this.editItem.otherItem = this.otherItem
                    this.editItem.oppoList = this.oppoList
                    this.editItem.summary = this.summary
                    this.$post("/crm/workReportPR/update", this.editItem, (data) => {
                        this.$message.success("修改成功")
                        this.dialogAddVisible = false
                    })
                }else{
                    let params = {
                        oppoList:  this.subIndex == 2 ? this.oppoList : [],
                        otherItem: this.otherItem,
                        reportType: this.list[this.subIndex],
                        summary: this.summary
                    }
                    this.$post("/crm/workReportPR/addOne", params, (data) => {
                        this.$message.success("提交成功")
                        this.dialogAddVisible = false
                        this.clickTab(this.tabIndex)
                    })
                }
            },
        /***************************************修改************************************* */
            editReport(item){
                this.editItem = item
                this.oppoList= item.oppoList
                this.otherItem = item.otherItem,
                this.summary = item.summary
                this.subIndex = this.list.indexOf(item.reportType)
                this.isEdit = true
                this.dialogAddVisible = true
                var date = this.formatDate(new Date(item.createTime), 'yyyy-MM-dd')
                this.getVisit(date)
                this.getOppoList()
            },
        /***************************************新增机会************************************* */
            //  获取机会
            getOppoList(){
                if(this.oppoAllList.length) return 
                this.$post("/crm/opportunityPR/queryOpportunity", {currentPage:1,order:-1,pageSize:999999,prop:"createTime"}, (data) => {
                    this.oppoAllList = data.list
                })
            },
            // 编辑表格
            editThis(e){
                e.target.previousElementSibling.style.display = "block"
                e.target.previousElementSibling.focus()
                e.target.style.display = "none"
            },
            //	input 失去焦点
            editBlur(e){
                e.target.style.display = "none"
                e.target.nextElementSibling.style.display = "block"
            },
            //	添加一行
            addColumn(val){
                console.log(val)
                this.oppoList.push({
                    oppoId: val.id,
                    oppoName: val.opportunityName,
                    oppoMarketingSection: val.marketingSection,
                    oppoFollowStatus: val.opportunityState,
                    oppoType: val.opportunityType,
                    amount: val.amount,
                    oppoOverview: '',
                })
            },
            //	删除一行
            deleteColumn(index) {
                this.oppoList.splice(index, 1);
            },
        /***************************************查看日志************************************* */
            //  查看
            check(item){
                this.workReport = item
                this.dialogCheckVisible = true
                this.date = item.createTime.split(' ')[0]
                this.workReviews = []
                this.signList = [{}]
                this.signTimesList = [{}]
                this.review = ''
                this.getWorkReport(item.id)
                this.getVisit(this.date)
            },
            //  获取日志信息
            getWorkReport(id){
                this.$post("/crm/workReportPR/queryOne", {id: id}, (data) => {
                    this.workReviews = data.workReviews
                })
            },
            
        /*************************************评论****************************** */
            saveReview(id){
                this.$post("/crm/workReportPR/addReview", {reportId: id, content: this.review}, (data) => {
                    this.review = ''
                    this.workReviews.unshift(data.param)
                })
            },
        /*************************************获取签到信息****************************** */
            //  获取指定周
            getWeek(date){
                let day = date.getDay()
                let startDate = new Date(this.formatDate(date, 'yyyy-MM-dd'))
                let endDate = new Date(this.formatDate(date, 'yyyy-MM-dd'))
                if(day>0){
                    startDate.setDate(date.getDate() - day + 1);
                    endDate.setDate(date.getDate() - day + 7);
                }else{
                    endDate = date
                    startDate.setDate(date.getDate() - 6);
                }
                this.week = this.formatDate(startDate, 'yyyy-MM-dd') + '~' + this.formatDate(endDate, 'yyyy-MM-dd')
                return [this.formatDate(startDate, 'yyyy-MM-dd'), this.formatDate(endDate, 'yyyy-MM-dd')]
            },
            //  获取当前月的月初和月末
            getMonthtDate(date){
				var month = date.getMonth(); //当前月 
				var year = date.getFullYear(); //当前年 
				var startDate = new Date(year, month, 1);
				var endDate = new Date(year, month + 1, 0);
                return [this.formatDate(startDate, 'yyyy-MM-dd'), this.formatDate(endDate, 'yyyy-MM-dd')]
            },
            getSignTimes(){
                let i = 0
                let m = 0
                let n = 0
                let dateList = []
                this.signList.forEach(item => {
                    var date = item.createTime.split(' ')[0]
                    if(dateList.indexOf(date) == -1){
                        dateList.push(date)
                        console.log(item.visitType)
                        if(item.visitType == '正常办公'){
                            i++
                        }else if(item.visitType == '国内出差'){
                            m++
                        }else if(item.visitType == '国外出差'){
                            n++
                        }
                    }
                })
                this.signTimesList = [{
                    type0: i,
                    type1: m,
                    type2: n
                }]
            },
            getVisit(date){
                let visitTime = []
                if(this.tabIndex == 0){
                    visitTime = [date, date]
                }else if(this.tabIndex == 1){
                    visitTime = this.getWeek(new Date(date))
                }else if(this.tabIndex == 2){
                    visitTime = this.getMonthtDate(new Date(date))
                }
                this.$post("/crm/visitPR/queryAll", {visitTime: visitTime, isOwner: true}, (data) => {
                    this.signList = data.list
                    this.getSignTimes()
                })
            },
        }
    }
</script>
<style lang="less" scoped>
    .report-item{
        margin-right: 10px;
        padding: 4px 8px;
        cursor: pointer;
        &.active{  
            background: #0090ff;
            color: #fff;
            border-radius: 4px; 
        }
    }
    .tab-item{
        display: block;
        width: 140px;
        text-align: center;
    }
    .el-tabs{
        background: #fff;
    }
    .el-tab-pane{
        background: #fafafa;
    }
    .first .el-form, .second .el-form{
        padding: 30px 0 10px;
    }   
</style>
<style>
    .oppo .el-table__empty-block{display: none;}
</style>


