<template>

  <div class="wrap">
    <!--查询表单-->
    <el-form label-position="left" size="small" :inline="true" label-width='70px' class="query-form">
      <el-form-item label="表名">
        <el-select v-model="tableName" placeholder="请选择">
          <el-option
            v-for="item in tableList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableField">查询</el-button>
      </el-form-item>
    </el-form>
    <!--工具栏-->
    <el-row>
      <el-button type="primary" size="small" @click="addCrmField()">新增</el-button>
      <el-button type="primary" size="small" @click="updateCrmField()">修改</el-button>
      <el-button type="primary" size="small" @click="deleteCrmField()">删除</el-button>
    </el-row>
    <br/>

    <!--表格-->
    <el-table  :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
               @selection-change="handleSelectionChange" border style="width: 100%"
               :default-sort = "{prop: 'sortNum', order: 'descending'}" row-key="id" ref="table">
      <!--表头结束-->

      <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column v-if="false" prop="id" label="主键" width="180"></el-table-column>
      <el-table-column prop="fieldNo" label="字段名称" width="180"></el-table-column>
      <el-table-column prop="fieldName" label="中文显示"></el-table-column>
      <el-table-column prop="isShow" label="是否显示"></el-table-column>
      <el-table-column prop="fieldType" label="字段类型"></el-table-column>
      <el-table-column prop="cosSpan" label="占格数"></el-table-column>
      <el-table-column prop="sortNum" label="排序"></el-table-column>
    </el-table>

    <br/>
    <!--分页-->
    <el-pagination background layout="total,prev, pager, next"
                   :page-size="pagesize"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :total="tableData.length" style="float: right;">
    </el-pagination>


    <!--新增弹框-->
    <el-dialog title="" :visible.sync="dialogVisible" width="50%" @close="dlgClose('crmCustomerFieldAdd')">
      <el-form ref="crmCustomerFieldAdd" :model="crmCustomerFieldAdd" :rules="field_rules" label-position="left" label-width="120px" size="small">
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
  import {mapState, mapActions, mapMutations} from 'vuex'

  export default {


    data() {

      return {
        tableName: 'crm_customer',  //  表名
        tableList: [
          {value: 'crm_customer', label: '客户'},
          {value: 'crm_contacts', label: '联系人'},
          {value: 'crm_marketing_clue', label: '营销线索'},
          {value: 'crm_competitor', label: '竞争对手'},
          {value: 'crm_marketing_opportunity', label: '营销机会'},
          {value: 'crm_partner', label: '合作伙伴'},
          {value: 'crm_marketing_contract', label: '营销合同'},
          {value: 'crm_open_ticket', label: '开票信息'},
          {value: 'crm_purchase_contract', label: '分包合同'},
          {value: 'crm_receipt_plan', label: '收款计划'},
          {value: 'crm_receipt_info', label: '收款信息'},
          {value: 'crm_invoice_info', label: '开票记录'},
          {value: 'crm_sub_contractor', label: '分包商'},
          {value: 'crm_payment_plan', label: '付款计划'},
          {value: 'crm_payment_info', label: '付款记录'},
          {value: 'crm_collect_ticket', label: '收票记录'},
        ],    //  表名列表

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
          'dictName': '',
          'cosSpan': '1',
          'sortNum': '',
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
          sortNum: [
            { required: true, message: '请输入排序', trigger: 'blur' },
          ],

        },

      }

    },
    mounted() {

      //初始化表格数据
      this.getTableField();


    },

    methods: {
      //  获取表格数据
      getTableField(){
        this.$post("/crm/extFieldPR/queryAll", {tableName: this.tableName}, (data) => {
          this.tableData = data.list;
        })
      },

      /**
       * 关闭弹框清空表单
       */
      dlgClose(crmCustomerFieldAdd){
        this.crmCustomerFieldAdd = {
          'id': '',
          'fieldNo': '',
          'fieldName': '',
          'isShow': '',
          'fieldType': '',
          'dictName': '',
          'cosSpan': '1',
          'sortNum': '',
        }
      },

      /**
       * 分页
       */
      handleCurrentChange(val){
        this.currentPage = val;
      },

      /**
       * 新增按钮
       */
      addCrmField() {
        this.savaflag = 'add';
        this.dialogVisible = true;
        this.crmCustomerFieldAdd.sortNum = this.tableData.length + 1
      },


      /**
       * 修改按钮
       */
      updateCrmField() {
        //只能勾选一条数据
        if (this.selectValue.length != 1) {
          this.$message.error('请勾选一条数据！');
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
      deleteCrmField() {

        var select_value = this.selectValue;
        if (select_value.length < 1) {
          this.$message.error('请勾选数据！');
          return;
        };
        let list = []
        this.selectValue.map(item => {
          list.push(item.id)
        })
        this.$post('/crm/extFieldPR/delete', {"list": list}, (data) => {
          this.$refs.table.clearSelection()
          this.getTableField();
          this.$message.success('操作成功！');
        })

      },

      /**
       * 保存数据
       */
      crmCustomerFieldSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var action = '';

            if ('add'== this.savaflag) {
              action = "/crm/extFieldPR/addOne";
            }

            if ('edit'== this.savaflag) {
              action = "/crm/extFieldPR/modifyOne";
            }
            this.crmCustomerFieldAdd['tableName'] = this.tableName
            this.$post(action, this.crmCustomerFieldAdd, (data) => {
              this.$message.success('操作成功！');
              this.$refs.table.clearSelection()
              this.getTableField();
              this.dialogVisible = false;
            })
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
