<template>

  <div class="wrap">

    <!--工具栏-->
    <el-row>
      <el-button type="primary" size="small" @click="add_crm_contacts_field()">新增</el-button>
      <el-button type="primary" size="small" @click="updateCrmCustomerField()">修改</el-button>
      <el-button type="primary" size="small" @click="deleteCrmCustomerField()">删除</el-button>
    </el-row>
    <br/>

    <!--表格-->
    <el-table  :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
               @selection-change="handleSelectionChange" border style="width: 100%"
               :default-sort = "{prop: 'sortNum', order: 'descending'}">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="fieldNo" label="字段名称" width="180"></el-table-column>
      <el-table-column prop="fieldName" label="中文显示"></el-table-column>
      <el-table-column prop="isShow" label="是否显示"></el-table-column>
      <el-table-column prop="fieldType" label="字段类型"></el-table-column>
      <el-table-column prop="cosSpan" label="占格数"></el-table-column>
      <el-table-column prop="sortNum" label="排序"></el-table-column>
    </el-table>
    <!--新增弹框-->
    <el-dialog title="" :visible.sync="dialogVisible" width="50%" @close="dlgClose('crmCustomerFieldAdd')">
      <el-form ref="crmCustomerFieldAdd" :model="crmCustomerFieldAdd" :rules="field_rules" label-position="left" label-width="120px" size="small">
        <el-form-item label="字段名称:" prop="fieldNo">
          <el-input   :disabled="true" v-model="crmCustomerFieldAdd.fieldNo"></el-input>
        </el-form-item>
        <el-form-item label="中文显示:" prop="fieldName">
          <el-input v-model="crmCustomerFieldAdd.fieldName"></el-input>
        </el-form-item>
        <el-form-item label="是否显示:" prop="isShow">
          <el-select v-model="crmCustomerFieldAdd.isShow"  placeholder="请选择">
            <el-option
              v-for="item in true_or_false"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段类型:" prop="fieldType">
          <el-select v-model="crmCustomerFieldAdd.fieldType"  placeholder="请选择">
            <el-option
              v-for="item in field_type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典名:" prop="dictName">
          <el-input v-model="crmCustomerFieldAdd.dictName"></el-input>
        </el-form-item>
        <el-form-item label="占格数:" prop="cosSpan">
          <el-input v-model="crmCustomerFieldAdd.cosSpan"></el-input>
        </el-form-item>
        <el-form-item v-show="false" label="主键:" prop="id">
          <el-input   :disabled="true" v-model="crmCustomerFieldAdd.id"></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sortNum">
          <el-input v-model="crmCustomerFieldAdd.sortNum"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="crmCustomerFieldSave('crmCustomerFieldAdd')">确 定</el-button>
        </span>
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

      return {

        currentPage: 1,//默认开始页面
        pagesize: 50,//每页的数据条数

        tableData: [],//table数据
        dialogVisible: false,//弹框是否显示
        savaflag :'',//操作标识符
        crmCustomerFieldAdd: {
          'id': '',
          'fieldNo': '',
          'fieldName': '',
          'isShow': '',
          'fieldType': '',
          'cosSpan': '',
          'isShow': '',
        },
        selectValue:[],//勾选的数据

        true_or_false: [{//是否显示下拉框
          value: 'true',
          label: '是'
        }, {
          value: 'false',
          label: '否'
        }],

        field_type: [{//字段类型
          value: 'text',
          label: '文本'
        }, {
          value: 'date',
          label: '时间'
        }, {
          value: 'dict',
          label: '字典'
        }, {
          value: 'boolean',
          label: 'boolean类型'
        }],

        field_rules :{//必填校验
          fieldNo: [
            { required: true, message: '请输入中文显示', trigger: 'blur' },
          ],
          fieldName: [
            { required: true, message: '请输入中文显示', trigger: 'blur' },
          ],
          isShow: [
            { required: true, message: '请选择是否显示', trigger: 'blur' },
          ],
          fieldType: [
            { required: true, message: '请选择字段类型', trigger: 'blur' },
          ],

        },
      }

    },
    mounted() {
      /**
       * 初始化表格数据
       */
      this.initTableData = function(){
        this.$post("/crm/contactsFieldPR/queryCrmContactsField", {}, (data) => {
          //返回的集合
          this.tableData = data.list;
        })
      }
      this.initTableData();
    },

    methods: {


      /**
       * 分页
       */
      handleCurrentChange(val){
        this.currentPage = val;
      },
      /**
       * 关闭弹框清空表单
       */
      dlgClose(crmCustomerFieldAdd){
        this.$refs[crmCustomerFieldAdd].resetFields();
      },

      /**
       * 新增按钮
       */
      add_crm_contacts_field() {
        this.savaflag = 'add';
        this.dialogVisible = true;
        var url = this.$store.state.crmPath+'/crm/contactsFieldPR/getDefaultFieldNo';
        this.$axios.post(url).then(res => {
          this.crmCustomerFieldAdd.fieldNo = res.data.field_no;
          this.crmCustomerFieldAdd.sortNum = res.data.sortNo;
        }); 
      },


      /**
       * 修改按钮
       */
      updateCrmCustomerField() {
        var select_value = this.selectValue;
        //只能勾选一条数据
        if (select_value.length !=1) {
          this.$notify({ message: '请勾选一条数据！', position: 'bottom-right'});
          return;
        };

        //取勾选的数据
        this.crmCustomerFieldAdd = this.selectValue[0];
        //设置保存时标识符
        this.savaflag = 'edit';
        //显示弹框
        this.dialogVisible = true;
      },

      /**
       * 删除按钮
       */
      deleteCrmCustomerField() {
        var select_value = this.selectValue;
        if (select_value.length < 1) {
          this.$notify({ message: '请勾选数据！', position: 'bottom-right'});
          return;
        };
        let list = []
        this.selectValue.map(item => {
          list.push(item.id)
        })
        var url = this.$store.state.crmPath+'/crm/contactsFieldPR/deleteCrmContactsField';
        this.$axios.post(url, {"list": list}).then(res => {
          this.initTableData();
          this.$notify({ message: '操作成功！', position: 'bottom-right'});
        });
      },

      /**
       * 保存数据
       */
      crmCustomerFieldSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var url = '';
            if ('add'== this.savaflag) {
              url = this.$store.state.crmPath+"/crm/contactsFieldPR/addCrmContactsField";
            }
            if ('edit'== this.savaflag) {
              url = this.$store.state.crmPath+"/crm/contactsFieldPR/updateCrmContactsField";
            }
            this.$axios.post(url, this.crmCustomerFieldAdd).then(res => {
              this.$notify({ message: '操作成功！', position: 'bottom-right'});
              this.initTableData();
              this.dialogVisible = false;
            });

          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },

      /**
       * 勾选的数据
       */
      handleSelectionChange(val) {
        this.selectValue = val;
      }


    },


  }
</script>
<style lang="less" scoped>

</style>
