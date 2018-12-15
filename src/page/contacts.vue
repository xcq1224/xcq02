<template>

  <div class="wrap">

     <!--查询表单-->
    <el-form label-position="left" size="small" :inline="true" :model="dsQuery" label-width='70px' class="query-form">
      <el-form-item label="姓名">
        <el-input v-model="dsQuery.name" clearable placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getContacts(1)">查询</el-button>
        <el-button type="primary" @click="clearQuery">清空</el-button>
      </el-form-item>
      <el-form-item>
        &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base" @click='query_show = !query_show; '>更多查询条件<i :class="'iconfont icon-'+query_show"></i></a>
      </el-form-item>
      <div v-show="query_show">
        <div class="input-box">
          <el-form-item label="客户名称">
            <el-input v-model="dsQuery.customerName" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="dsQuery.mobilePhone" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
              <el-date-picker
                  v-model="dsQuery.createTime"
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
      <el-button type="primary" size="small" @click="addcontats()">新增</el-button>
      <!-- <el-button type="primary" size="small" @click="test()">导入</el-button> -->
      <el-button type="primary" size="small" @click="deleteCrmContacts">删除</el-button>
      <!-- <el-button type="primary" size="small" @click="dialogMergeVisible = true">转给他人</el-button>
      <el-button type="primary" size="small" @click="dialogTransferVisible = true">扫描名片</el-button> -->
    </el-row>

    <!--联系人表格数据展示-->
    <el-table class="table" :data="contacts"
               max-height="500" border style="width: 100%; margin-top: 20px;"
               @selection-change="handleSelectionChange" @sort-change="sortChange"
              >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="name" sortable="custom" label="姓名" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link class="text-base" sortable="custom" :to="'./contacts_detail?id=' + scope.row.id">{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" sortable="custom" label="客户名称"></el-table-column>
      <el-table-column prop="job" sortable="custom" label="职务"></el-table-column>
      <el-table-column prop="mobilePhone" sortable="custom" label="手机号"></el-table-column>
      <el-table-column prop="business" sortable="custom" label="负责业务"></el-table-column>
      <el-table-column prop="createTime" sortable="custom" label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime.split(' ')[0]}}
        </template>
      </el-table-column>
    </el-table>

    <br/>
    <!--分页-->
    <el-pagination background layout="total,prev, pager, next"
      v-show="count"
      :page-size="pageSize"
      @current-change="getContacts"
      :current-page="currentPage"
      :total="count" style="float: right;">
    </el-pagination>

    <!--新增联系人弹框-->
    <el-dialog title="新增联系人" width="600px" class="dialogAdd"
               :visible.sync="dialogAddVisible" @open="openModal" @close="closeModal" :close-on-click-modal='false'>
      <el-form ref="form" :model="contactsAdd" :rules="contacts_rules" label-position="left" label-width="120px" size="small">
        <el-form-item label="照片">
          <div class="upload-box" @click="chooseImg">
            <i v-show="!imgSrc" class="el-icon-plus"></i>
            <img v-show="imgSrc" :src="getUrl(imgSrc)" alt="">
            <input type="file" @change="pictureChange" v-show="false" ref="uploadInput" accept="image/*">
          </div>
        </el-form-item>
        <el-form-item  label="客户名称" prop="customerId">
          <el-select v-model="contactsAdd.customerId" size="small" filterable clearable placeholder="请输入客户名称">
            <el-option
              v-for="item in customers"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(item,index) in contactsAddLabel" :key="index" :prop="item.name" :label="item.label">
          <el-input v-if="item.editorType == 'text'" v-model="contactsAdd[item.name]"></el-input>
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
            v-for="tag in dynamicTags"
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
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="contactsSave()">确 定</el-button>
      </div>

    </el-dialog>
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
      //  验证手机号
      var checkPhone = function(rule, value, callback){
        let reg = /^1[0-9]{10}$/;
        if(reg.test(value)){
          callback()
        }else{
          callback(new Error('手机号错误!'))
        }
      };

      return {
        customers: [],    //  所有客户
        customer: '',     //  客户（客户id + 客户姓名）
        imgSrc: '', //  联系人头像
        dynamicTags: [],        //  tag标签集合
        inputVisible: false,    //  是否显示编辑tag的input框
        inputValue: '',         //  新增标签input值
        contactsAddLabel: [],   //  新增客户label
        contactsAdd:{},         //  联系人新增对象
        contacts_rules: {
          customerId: [
            { required: true, validator: this.isNull, trigger: 'change' }
          ],
          name: [
            { required: true, validator: this.isNull, trigger: 'blur' }
          ],
          mobilePhone: [
            { required: true, validator: this.isNull, trigger: 'blur' }
          ]
        }, //  新增联系人验证规则

        dsQuery: {prop: 'createTime', order: -1},    //  查询条件
        query_show: false,          //  是否显示更多查询
        contacts: [],//联系人table数据
        dialogAddVisible: false,//弹框是否显示
        savaflag :'',//操作标识符
        selectValue:[],//勾选的数据
        currentPage: 1,//默认开始页面
        pageSize: 2,//每页的数据条数
        count: 0,     //  总数据条数


      }

    },
    activated() {
      this.getContacts(1);
    },

    methods: {
      //  清空查询
      clearQuery(){
        this.dsQuery = {prop: 'createTime', order: -1}
        this.getContacts(1)
      },
      //  获取联系人列表
      getContacts(val){
        this.currentPage = val
        let params = this.deepClone(this.dsQuery)
        params.currentPage = val
        params.pageSize = this.pageSize
        this.$post("/crm/contactsPR/queryCrmContacts", params, (data) => {
          this.contacts = data.list;
          this.count = data.count;
        })
      },
      //  排序
      sortChange(obj){
        this.dsQuery.prop = obj.prop || "createTime"
        this.dsQuery.order = obj.order == 'ascending' ? 1 : -1
        this.getContacts(1)
      },


      /**------------------------------------------新增联系人选择头像------------------------------------------ */
      //  新增按钮
      addcontats() {
        this.$post("/crm/extFieldPR/getField", {tableName: 'crm_contacts'}, (data) => {
          this.contactsAddLabel = data.list;
          data.list.map((item) => {
            if (item.editorType == 'cascade' & !item.value){
              this.contactsAdd[item.name] = []
            }
          })
          this.dialogAddVisible = true;
        })
      },
      //  打开新增模态框
      openModal(){
        if(!this.customers.length){
          this.$post("/crm/queryAllCustomers", {}, (data) => {
            this.customers = data.customers
          })
        }
      },
      //  关闭新增模态框，清除数据
      closeModal(){
        this.dynamicTags = []
        this.imgSrc = ''
        this.$refs.uploadInput.value = ''
        this.$refs.form.resetFields();
      },
      //  打开input file
      chooseImg(){
        this.$refs.uploadInput.click()
      },
      //  选择图片
      pictureChange(e){
        if(e.target.files.length) this.imgSrc = e.target.files[0]
      },
      //  添加标签
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      //  添加标签
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //  添加标签
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      //  保存数据
      contactsSave() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.contactsAdd.tags = this.dynamicTags
            let params = new FormData()
            // params.append('avatar', this.imgSrc)
            params.append('contactsAdd', JSON.stringify(this.contactsAdd))
            this.$post("/crm/contactsPR/addCrmContacts", params, (data) => {
              this.$notify.success({ message: '操作成功！'});
              this.getContacts(1);
              this.dialogAddVisible = false;
            })
          }
        });
      },


      //  删除按钮
      deleteCrmContacts() {
        let that = this
        var select_value = this.selectValue;
        if (select_value.length < 1) {
          this.$notify.warning({ message: '请勾选数据！'});
          return;
        };
        this._confirm('确定删除?', () => {
          let list = []
          this.selectValue.map(item => {
            list.push(item.id)
          })
          this.$post('/crm/contactsPR/deleteCrmContacts', {"list": list}, (data) => {
            if(data.message){
              this.$message.error(data.message)
              this.getContacts(1);
            }else{
              this.$message.success("删除成功！")
              this.getContacts(1);
            }
          });
        });
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
