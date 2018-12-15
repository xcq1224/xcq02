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
          <el-form-item label="电话">
            <el-input v-model="dsQuery.phone" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="竞争力">
            <el-select v-model="dsQuery.power" clearable placeholder="请选择">
              <el-option
                v-for="item in jzl"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
              <el-date-picker
                  v-model="dsQuery.create_time"
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
      <!-- <el-button type="primary" size="small" @click="dialogMergeVisible = true">转给他人</el-button>
      <el-button type="primary" size="small" @click="dialogTransferVisible = true">扫描名片</el-button> -->
    </el-row>
    <!--联系人表格数据展示-->
    <el-table class="table" ref="table" :data="tableData"
               max-height="500" border style="width: 100%; margin-top: 20px;"
               @selection-change="handleSelectionChange" @sort-change="sortChange"
              >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="name" label="名称" sortable="custom" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link class="text-base" :to="'./competitor_detail?id=' + scope.row.id">{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="phone"  label="电话" sortable="custom"></el-table-column>
      <el-table-column prop="scale" label="规模" sortable="custom"></el-table-column>
      <el-table-column prop="power" label="竞争力" sortable="custom"></el-table-column>
      <el-table-column prop="createUserCname" label="创建者" sortable="custom"></el-table-column>
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
    <el-dialog title="新增竞争对手" width="600px" class="dialogAdd"
               :visible.sync="dialogAddVisible" @open="openModal" @close="closeModal" :close-on-click-modal='false'>

      <el-form ref="addForm" :model="addForm" :rules="rules" label-position="left" label-width="120px" size="small">
        <el-form-item v-for="(item,index) in addLabel" :key="index" :prop="item.name" :label="item.label">
          <el-input type="textarea" resize="none" autosize v-if="item.editorType == 'text'" v-model="addForm[item.name]"></el-input>
          <el-date-picker v-if="item.editorType == 'date'" v-model="addForm[item.name]" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
          <el-select v-if="item.editorType == 'dict'" v-model="addForm[item.name]">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSave">确 定</el-button>
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
        jzl: [],      //  竞争力
        tableData: [],    //  所有竞争对手
        addLabel: [],       //  新增label
        addForm:{area: []},         //  新增对象
        rules: {
          name: [
            { required: true, validator: this.isNull, trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: this.isNull, trigger: 'blur' }
          ]
        }, //  新增联系人验证规则
        options: regionData,    //  省市区配置
        dsQuery: {            //  查询条件
          prop: 'createTime',
          order: -1
        },
        currentPage: 1,//默认开始页面
        pageSize: 2,//每页的数据条数
        count: 0,     //  总条数

        query_show: false,          //  是否显示更多查询
        dialogAddVisible: false,//弹框是否显示
        selectValue:[],//勾选的数据
      }
    },
    mounted(){
      //  获取数据字典
      let list = ["crm-jzl"]
      this.$post("/crm/getDict", {"list": list}, (data) => {
        this.jzl = data['crm-jzl']
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
      //  获取竞争对手列表
      getData(val){
        this.currentPage = val
        let params = this.deepClone(this.dsQuery)
        params.currentPage = val
        params.pageSize = this.pageSize
        this.$post("/crm/competitorPR/getAll", params, (data) => {
          this.tableData = data.list
          this.count = data.count
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
        this.dialogAddVisible = true;
      },
      //  打开新增模态框
      openModal(){
        if(!this.addLabel.length){
          this.$post("/crm/extFieldPR/getField", {tableName: 'crm_competitor'}, (data) => {
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
            this.$post("/crm/competitorPR/addOne",this.addForm, (data) => {
              this.$notify.success({ message: '操作成功！'});
              this.getData(1);
              this.dialogAddVisible = false;
            })
          }
        });
      },


      //  删除按钮
      deleteBtn() {
        let that = this
        var select_value = this.selectValue;
        if (select_value.length < 1) {
          this.$message.error('请勾选数据！');
          return;
        };
        this._confirm('确定删除吗?', () => {
          let list = []
          this.selectValue.map(item => {
            list.push(item.id)
          })
          this.$post('/crm/competitorPR/delete', {"list": list}, (data) => {
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
