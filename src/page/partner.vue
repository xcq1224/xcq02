<template>
  <div class="wrap">
     <!--查询表单-->
    <el-form label-position="left" size="small" :inline="true" :model="dsQuery" label-width='70px' class="query-form">
      <el-form-item label="名称">
        <el-input v-model="dsQuery.name" clearable placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData(1)">查询</el-button>
        <el-button type="primary" @click="clearQuery">清空</el-button>
      </el-form-item>
      <el-form-item>
        &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base" @click='query_show = !query_show; '>更多查询条件<i :class="'iconfont icon-'+query_show"></i></a>
      </el-form-item>
      <div v-show="query_show">
        <div class="input-box">
          <el-form-item label="合作状态">
            <el-select v-model="dsQuery.cooperationStatus" clearable placeholder="请选择">
              <el-option
                v-for="item in hzzt"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合作方式">
            <el-select v-model="dsQuery.cooperationType" clearable placeholder="请选择">
              <el-option
                v-for="item in hzfs"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="dsQuery.phone" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="dsQuery.classify" clearable placeholder="请选择">
              <el-option value="1" label="我拥有的"></el-option>
              <el-option value="2" label="我参与的"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跟进时间">
              <el-date-picker
                  v-model="dsQuery.lastFollowTime"
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
    <!--操作按钮-->
    <el-row>
      <el-button type="primary" size="small" @click="addOpen">新增</el-button>
      <!-- <el-button type="primary" size="small" @click="test()">导入</el-button> -->
      <el-button type="primary" size="small" @click="deleteBtn">删除</el-button>
      <el-button type="primary" size="small" @click="turnOther">转给他人</el-button>
      <!-- <el-button type="primary" size="small" @click="dialogTransferVisible = true">扫描名片</el-button> -->
    </el-row>
    <!--联系人表格数据展示-->
    <el-table class="table" ref="table" :data="tableData"
               max-height="500" border style="width: 100%; margin-top: 20px;"
               @selection-change="handleSelectionChange" @sort-change="sortChange">
      <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
      <el-table-column prop="name" label="名称" sortable="custom" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link class="text-base" :to="'./partner_detail?id=' + scope.row.id">{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="cooperationStatus"  label="合作状态" sortable="custom"></el-table-column>
      <el-table-column prop="cooperationType" label="合作方式" sortable="custom"></el-table-column>
      <el-table-column prop="scale" label="规模" sortable="custom"></el-table-column>
      <el-table-column prop="phone" label="电话" sortable="custom"></el-table-column>
      <el-table-column prop="lastFollowTime" label="最近跟进时间" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.lastFollowTime}}
        </template>
      </el-table-column>
      <el-table-column prop="ownerCname" label="拥有者" sortable="custom"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.createTime.split(' ')[0]}}
        </template>
      </el-table-column>
    </el-table>
    <br/>
    <!--分页-->
    <el-pagination v-show="count" background layout="total,prev, pager, next"
                   :page-size="pageSize"
                   @current-change="getData"
                   :current-page="currentPage"
                   :total="count" style="float: right;">
    </el-pagination>
    <!--新增弹框-->
    <el-dialog title="新增合作伙伴" width="600px" class="dialogAdd"
               :visible.sync="dialogAddVisible" @open="openModal" @close="closeModal" :close-on-click-modal='false'>
      <el-form ref="addForm" :model="addForm" :rules="rules" label-position="left" label-width="120px" size="small">
        <el-form-item v-for="(item,index) in addLabel" :key="index" :prop="item.name" :label="item.label">
          <el-input type="textarea" resize="none" autosize v-if="item.editorType == 'text'" v-model="addForm[item.name]"></el-input>
          <el-date-picker v-if="item.editorType == 'date'" v-model="addForm[item.name]" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
            type="datetime" placeholder="选择日期时间">
          </el-date-picker><el-select v-if="item.editorType == 'dict'" v-model="addForm[item.name]">
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
            v-model="addForm[item.name]">
          </el-cascader>
        </el-form-item>
        <el-form-item  label="拥有者" prop="ownerCname">
          <el-select v-model="addForm.ownerCname" size="small" filterable clearable placeholder="请输入客户名称">
            <el-option
              v-for="item in allStaff"
              :key="item.userName"
              :label="item.cname + '   ' + item.userName"
              :value="item.cname + '/' + item.userName">
              <span style="float: left; width: 100px;">{{ item.cname }}</span>
              <span style="color: #8492a6; font-size: 13px">{{ item.userName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSave">确 定</el-button>
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
          <el-checkbox v-model="formTransfer.checkbox3">机会</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTransferVisible = false">取 消</el-button>
        <el-button type="primary" @click="turn_other_sava">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import {regionData, CodeToText, TextToCode} from 'element-china-area-data'
  export default {
    data() {
      return {
        userName: '',
        userId: '',
        hzzt: [],      //  合作状态
        hzfs: [],      //  合作方式
        tableData: [],    //  所有竞争对手
        addLabel: [],       //  新增label
        allStaff: [],       //  所有员工
        addForm:{area: [], ownerCname: ''},         //  新增对象
        rules: {
          name: [
            { required: true, validator: this.isNull, trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: this.isNull, trigger: 'blur' }
          ],
          ownerCname: [
            { required: true, validator: this.isNull, trigger: 'blur' }
          ]
        }, //  新增联系人验证规则
        options: regionData,    //  省市区配置
        dsQuery: {            //  查询条件
          classify: '',      //  分类
          prop: 'createTime', //  排序
          order: -1           //  升序降序
        },
        currentPage: 1,//默认开始页面
        pageSize: 2,//每页的数据条数
        count: 0,     //  总条数


        query_show: false,          //  是否显示更多查询
        dialogAddVisible: false,//弹框是否显示
        selectValue:[],//勾选的数据

        dialogTransferVisible: false,     //  转给他人模态框
        staff: '',      //转给他人：员工
        formTransfer: {
          checkbox1: false,   //  是否保留为团队成员
          checkbox2: false,   //  是否转移线索
          checkbox3: false,   //  是否转移机会
        }, //  转给他人checkbox
      }
    },
    mounted(){
      //  获取数据字典
      let list = ["crm-hzzt", 'crm-hzfs']
      this.$post("/crm/getDict", {"list": list}, (data) => {
        this.hzzt = data['crm-hzzt']
        this.hzfs = data['crm-hzfs']
      })
    },
    activated() {
      this.getData(1);
    },

    methods: {
      //  清空查询
      clearQuery(){
        this.dsQuery = {prop: 'createTime', order: -1}
        this.getData(1)
      },
      //  获取合作伙伴列表
      getData(val){
        this.currentPage = val
        let params = this.deepClone(this.dsQuery)
        params.currentPage = val
        params.pageSize = this.pageSize
        this.$post("/crm/partnerPR/getAll", params, (data) => {
          this.tableData = data.list
          this.count = data.count
          this.userName = data.userName
          this.userId = data.userId
        })
      },
      sortChange(obj){
        this.dsQuery.prop = obj.prop || "createTime"
        this.dsQuery.order = obj.order == 'ascending' ? 1 : -1
        this.getData(1)
      },
/**------------------------------------------新增------------------------------------------ */
      //  点击新增按钮
      addOpen() {
        this.addForm.ownerCname = this.userName + '/' + this.userId
        this.dialogAddVisible = true;
        this.getAllStaff()
      },
      //  获取所有员工
      getAllStaff(){
        if(!this.allStaff.length){
          this.$post("/crm/getAllStaff", {}, (data) => {
            this.allStaff = data.list
          })
        }
      },
      //  打开新增模态框
      openModal(){
        if(!this.addLabel.length){
          this.$post("/crm/extFieldPR/getField", {tableName: 'crm_partner'}, (data) => {
            this.addLabel = data.list;
          })
        }
      },
      //  关闭新增模态框，清除数据
      closeModal(){
        this.addForm = {area: []}
      },
      //  新增数据
      addSave() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$post("/crm/partnerPR/addOne",this.addForm, (data) => {
              this.$notify.success({ message: '操作成功！'});
              this.getData(1);
              this.dialogAddVisible = false;
            })
          }
        });
      },
/*--------------------------------------------转给他人功能--------------------------------------------*/
    // 打开转给他人弹框
    turnOther(){
      if (this.selectValue.length < 1) {
        this.$message.error('请勾选数据！');
        return;
      }

      let ownerId = this.userId
      let flag = false
      this.selectValue.map(item => {
        if (ownerId != item.ownerId) {
          this.$message.error("只能将自己是拥有者的合作伙伴转给他人！")
          flag = true
        }
      })
      if(flag){
        return
      }

      //  如果没有获取所有员工请求员工数据
      this.getAllStaff()
      this.dialogTransferVisible = true
    },
    //  打开转给他人模态框
    openTurnModal(){
      this.staff = ''
      this.formTransfer = {
        checkbox1: false,
        checkbox2: false,
        checkbox3: false,
      }
    },
    // 转给他人确定按钮
    turn_other_sava(){
      if(!this.staff){
        this.$message.error("请选择新拥有者！")
        return
      }
      let list = []
      this.selectValue.map(item => {
        list.push(item.id)
      })
      let params = {
        list: list,
        ownerId: this.staff,
        ifLeft: this.formTransfer.checkbox1,
        turnClue: this.formTransfer.checkbox2,
        turnOpportunity: this.formTransfer.checkbox3
      }
      this.$post("/crm/partnerPR/turnOther", params, (data) => {
        this.dialogTransferVisible = false
        this.$message.success("转移成功！")
        this.getData(1)
        this.$refs.table.clearSelection()
      })
    },



      //  删除按钮
      deleteBtn() {
        let that = this
        var select_value = this.selectValue;
        if (select_value.length < 1) {
          this.$message.error('请勾选数据！');
          return;
        };

        let ownerId = this.userId
        let flag = false
        this.selectValue.map(item => {
          if (ownerId != item.ownerId) {
            this.$message.error("只能删除自己是拥有者的合作伙伴！")
            flag = true
          }
        })
        if(flag){
          return
        }

        this._confirm('确定删除吗?', () => {
          let list = []
          this.selectValue.map(item => {
            list.push(item.id)
          })
          this.$post('/crm/partnerPR/delete', {"list": list}, (data) => {
            if(data.message){
              this.$message.error(data.message)
            }else{
              this.$message.success("删除成功！")
            }
            this.$refs.table.clearSelection()
            this.getData(1);
          })
        })
      },


      //  勾选的数据
      handleSelectionChange(val) {
         this.selectValue = val;
      },
    },
  }
</script>
<style lang="less" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px !important;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .query-form{
    .el-input, .el-select, .el-date-picker{
        width: 250px;
        margin-right: 30px;
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
  }
</style>
