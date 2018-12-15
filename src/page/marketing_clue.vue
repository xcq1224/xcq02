<template>
    <div class="wrap">
        <!--查询表单-->
        <el-form class="query-form" label-position="left" size="small" :inline="true" :model="dsQuery" label-width='70px'>
            <el-form-item label="线索名称">
                <el-input v-model="dsQuery.name" clearable placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="initTableData(1)">查询</el-button>
                <el-button type="primary" @click="clearQuery">清空</el-button>
            </el-form-item>
            <el-form-item>
                &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base" @click='query_show = !query_show; '>更多查询条件<i :class="'el-icon--right el-icon-arrow-down iconfont icon-'+query_show"></i></a>
            </el-form-item>
            <div v-show="query_show">
                <div class="input-box">
                    <el-form-item label="线索来源">
                      <el-select v-model="dsQuery.type" clearable placeholder="请选择">
                        <el-option
                          v-for="item in xsly"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="客户名称">
                        <el-input v-model="dsQuery.cus_name" clearable placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="跟进状态">
                        <el-select v-model="dsQuery.state" clearable placeholder="请选择">
                          <el-option
                            v-for="item in gjzt"
                            :key="item"
                            :label="item"
                            :value="item">
                          </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="input-box">
                    <el-form-item label="线索状态">
                        <el-select v-model="dsQuery.marketingClueState" clearable placeholder="请选择">
                          <el-option value="0" label="进行中"></el-option>
                          <el-option value="1" label="已转化"></el-option>
                          <el-option value="2" label="已关闭"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="分类">
                        <el-select v-model="dsQuery.classify" clearable placeholder="请选择">
                          <el-option value="1" label="我拥有的"></el-option>
                          <el-option value="2" label="我参与的"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="跟进时间">
                        <el-date-picker
                            v-model="dsQuery.recent_follow_time"
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
            <el-button type="primary" size="small" @click="add_marketing_clue()">新增</el-button>
            <el-button type="primary" size="small" @click="delete_marketing_clue()">删除</el-button>
            <!-- <el-button type="primary" size="small" @click="">导入</el-button> -->
            <el-button type="primary" size="small" @click="form_opportunity">转化为机会</el-button>
            <el-button type="primary" size="small" @click="turnOther">转给他人</el-button>
        </el-row>
        <!--营销线索表格数据展示-->
        <el-table class="table" ref="table" :data="tableData"
                max-height="500" border style="width: 100%; margin: 20px 0;"
                header-cell-class-name='text-center'
                cell-class-name='text-center'
                @selection-change="handleSelectionChange"
                @sort-change="sortChange">
            <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
            <el-table-column prop="name" label="线索名称" sortable="custom" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <router-link class="text-base" :to="'./marketing_clue_detail?id=' + scope.row.id">{{scope.row.name}}</router-link>
                </template>
            </el-table-column>
            <el-table-column prop="customerName" sortable="custom" label="客户名称"></el-table-column>
            <el-table-column prop="clueSource" sortable="custom" label="线索来源"></el-table-column>
            <el-table-column prop="mobilePhone" sortable="custom" label="联系方式"></el-table-column>
            <el-table-column prop="ownerCname" sortable="custom" label="拥有者"></el-table-column>
            <el-table-column prop="lastFollowTime" sortable="custom" label="最近跟进时间"></el-table-column>
            <el-table-column prop="followStatus" sortable="custom" label="跟进状态"></el-table-column>
            <el-table-column prop="marketingClueState" sortable="custom" label="线索状态"></el-table-column>
            <el-table-column prop="createTime" sortable="custom" label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createTime.split(' ')[0]}}
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination v-show="count" background layout="total,prev, pager, next"
                        :page-size="pageSize"
                        @current-change="initTableData"
                        :current-page="currentPage"
                        :total="count" style="float: right;">
        </el-pagination>



        <!--新增营销线索弹框-->
        <el-dialog title="新增线索" width="600px" @close="closeAdd" class="dialogAdd"
                    :visible.sync="dialogAddVisible" @open="openModal" :close-on-click-modal='false'>

            <el-form ref="marketingClueAdd" :rules="marketing_clue_rules" :model="marketingClueAdd" label-position="left" label-width="120px" size="small">


                <el-form-item  label="客户名称" prop="customerId">
                  <el-select v-model="marketingClueAdd.customerId" size="small" filterable clearable placeholder="请输入客户名称">
                    <el-option
                      v-for="item in customers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
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

        <!--转给他人弹框-->
        <el-dialog title="转给他人" width="40%" :visible.sync="dialogTransferVisible" :close-on-click-modal='false'>
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
            <el-button @click="dialogTransferVisible = false">取 消</el-button>
            <el-button type="primary" @click="turn_other_sava">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 转化为机会 -->
        <el-dialog title="转化为机会" width="600px" @open="open_form_opportunity" @close="closeModel" class="dialogContract" :visible.sync="dialogContractVisible" :close-on-click-modal='false'>
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

    </div>
</template>

<script src="../js/marketing_clue.js">

</script>
<style lang="less" scoped>
    .query-form{
        .el-input, .el-select, .el-date-picker{
            width: 250px;
            margin-right: 30px;
        }
    }
</style>
