<template>

  <div class="wrap">

     <!--查询表单-->
    <el-form label-position="left" size="small" :inline="true" :model="dsQuery" label-width='70px' class="query-form">
      <el-form-item label="跟进模块">
        <el-select v-model="dsQuery.moduleName" placeholder="请选择" clearable>
          <el-option
            v-for="(value, key) in moduleList"
            :key="key"
            :label="value"
            :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData(1)">查询</el-button>
        <el-button type="primary" @click="clearQuery">清空</el-button>
      </el-form-item>
      <el-form-item>
        &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base" @click='query_show = !query_show; '>更多查询条件<i :class="'iconfont icon-'+query_show"></i></a>
      </el-form-item>
      <div v-show="query_show">
        <div class="input-box">
          <el-form-item label="跟进方式">
            <el-select v-model="dsQuery.followType" placeholder="请选择" clearable>
              <el-option
                v-for="(item, index) in gjfs"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跟进人">
            <el-select v-model="dsQuery.createUserId" size="small" filterable clearable placeholder="请输入员工姓名或工号">
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
          <el-form-item label="跟进时间">
              <el-date-picker
                  v-model="dsQuery.followTime"
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

    <!--表格数据展示-->
    <el-table class="table" :data="tableData" @sort-change="sortChange"
               border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="moduleName" sortable="custom" label="跟进模块">
        <template slot-scope="scope">
          {{moduleList[scope.row.moduleName]}}
        </template>
      </el-table-column>
      <el-table-column prop="followType" sortable="custom" label="跟进方式"></el-table-column>
      <el-table-column prop="followContent" sortable="custom" label="跟进内容"></el-table-column>
      <el-table-column prop="createUserCname" sortable="custom" label="跟进人"></el-table-column>
      <el-table-column prop="followTime" sortable="custom" label="跟进时间"></el-table-column>
    </el-table>

    <br/>
    <!--分页-->
    <el-pagination v-show="count" background layout="total,prev, pager, next"
                   :page-size="pageSize"
                   @current-change="getTableData"
                   :current-page="currentPage"
                   :total="count" style="float: right;">
    </el-pagination>
  </div>
</template>

<script>
  import {

    mapState,

    mapActions,

    mapMutations

  } from 'vuex'

  export default {

    data() {

      return {
        tableData: [],    //  所有客户
        dsQuery: {prop: 'createTime', order: -1},    //  查询条件
        query_show: false,          //  是否显示更多查询
        currentPage: 1,//默认开始页面
        pageSize: 2,//每页的数据条数
        gjfs: [],   //  跟进方式
        allStaff: [],   //  所有员工
        count: 0,     //  总条数
        moduleList: {
          crm_customer: '客户',
          crm_contacts: '联系人',
          crm_marketing_clue: '营销线索',
          crm_competitor: '竞争对手',
          crm_marketing_opportunity: '营销机会',
          crm_partner: '合作伙伴',
        }
      }

    },
    mounted(){
      this.getDict()
      this.getAllStaff()
    },
    activated() {
      this.getTableData(1);
    },

    methods: {
      //  清空查询
      clearQuery(){
        this.dsQuery = {prop: 'createTime', order: -1}
        this.getTableData(1)
      },
      //  获取数据字典
      getDict(){
        let list = ["crm-gjfs"]
        this.$post("/crm/getDict", {"list": list}, (data) => {
          this.gjfs = data['crm-gjfs']
        })
      },
      //  获取所有员工
      getAllStaff(){
        if(!this.allStaff.length){
          this.$post("/crm/getAllStaff", {}, (data) => {
            this.allStaff = data.list
          })
        }
      },
      // 获取联系人列表
      getTableData(val){
        this.currentPage = val
        let params = this.deepClone(this.dsQuery)
        params.currentPage = val
        params.pageSize = this.pageSize
        this.$post("/crm/followPR/getFollowList", params, (data) => {
          this.tableData = data.list;
          this.count = data.count;
        })
      },
      sortChange(obj){
        this.dsQuery.prop = obj.prop || "createTime"
        this.dsQuery.order = obj.order == 'ascending' ? 1 : -1
        this.getTableData(1)
      },
    },
  }
</script>
