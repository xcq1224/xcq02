import {mapState, mapActions, mapMutations} from 'vuex'
import dialogCheck from '../components/dialogCheck'
import {regionData, CodeToText, TextToCode} from 'element-china-area-data'

export default {
  data() {
    return {
      userName: '',           //  用户Id
      userCname: '',          //  用户名
      allStaff: [],           // 所有员工
      staff: '',              // 员工
      financialManagers: [],  // 所有财务经理
      contact_list: [],       //  当前客户所有联系人列表

      activeName: 'first',
      queryShow1: false,          //  是否显示更多查询条件
      queryShow2: false,          //  是否显示更多查询条件
      queryShow3: false,          //  是否显示更多查询条件
      formEdit2: {},              //  编辑表单
      formEdit3: {},              //  编辑表单
      tableData1: [],             //  付款计划表格
      tableData1_1: [],           //  付款计划弹框列表
      tableData1_2: [],           //  付款计划编辑弹框列表
      tableData2: [],             //  付款记录表格
      tableData3: [],             //  售票记录表格

      formPaymentPlan: {},                        //  新增付款计划表单
      formDeploy: {},                             //  配置付款计划表单
      formReceiptRecord: {},                      //  新增收票记录表单

      /************************************************收款计划*****************************************************/
      dsQuery: {                                    // 收款计划查询
        contractName: '',                           // 合同名称
        cus_name: '',                               // 客户名称
        state: '',                                  // 收款状态
        plan_receipt_time: [],                      // 计划收款日期
        prop: 'createTime',
        order: -1
      },
      currentPage1: 1,        //默认开始页面
      pageSize1: 2,           //每页的数据条数
      count1: 0,

      plan_receipt_rules: {                         // 计划收款规则
        contractId: [
          { required: true, message: '请选择合同名称', trigger: 'change' },
        ],
      },

      paymentRecordAdd: {receiptList : []},                         // 新增收款计划表单
      paymentRecordAddLabel: {},                    // 新增收款计划Lable
      customers: [],                                // 所有客户
      contracts: [],                                // 所有的合同名称
      selectValue: [],                              // 勾选的数据
      skzt: [],                                     // 收款状态

      /*****************************************************弹框***************************************************/
      dialogPaymentPlanVisible: false,              //  新增收款计划
      dialogEditPaymentPlanVisible: false,          //  编辑收款计划
      dialogReceiptRecordVisible: false,            //  新增收款记录
      dialogEditReceiptRecordVisible: false,        //  编辑收款记录
      dialogInvoiceInfoVisible: false,              //  新增开票记录
      dialogEditInvoiceInfoVisible: false,          //  编辑开票记录

      /*****************************************************编辑***************************************************/
      receiptPlan: {},                              // 收款计划信息
      receiptPlanEdit: {},                          // 编辑收款计划信息
      receiptPlanFieldList: [],                     // 收款计划字段集合

      /************************************************收款记录*****************************************************/
      dsQuery_1: {                                  // 收款记录查询
        contractName: '',                           // 合同名称
        cus_name: '',                               // 客户名称
        state: '',                                  // 逾期状态
        plan_receipt_time: [],                      // 计划收款日期
        prop: 'createTime',
        order: -1
      },
      currentPage2: 1,        //默认开始页面
      pageSize2: 2,           //每页的数据条数
      count2: 0,

      receipt_record_rules: {                         // 收款记录规则
        contractId: [
          { required: true, message: '请选择合同名称', trigger: 'change' },
        ],
        receiptActualTime: [
          { required: true, message: '请选择收款日期', trigger: 'change' },
        ],
        receiptAmount: [
          { required: true, message: '请填写收款金额', trigger: 'blur' },
        ],
        ownerCname: [
          { required: true, message: '请选择收款人', trigger: 'change' },
        ],
      },

      receiptRecordAdd: {},                         // 新增收款记录表单
      receiptRecordAddLabel: {},                    // 新增收款记录Lable
      receiptRecord: {},                            // 收款记录信息
      receiptRecordEdit: {},                        // 编辑收款记录信息
      receiptRecordFieldList: [],                   // 收款记录字段集合
      pjlx: [],                                     // 票据类型
      fkfs: [],                                     // 付款方式
      sklx: [],                                     // 收款类型

      /**************************************************开票信息*****************************************************/
      dsQuery_2: {                                  // 开票信息查询
        contractName: '',                           // 合同名称
        cus_name: '',                               // 客户名称
        type: '',                                   // 票据类型
        invoice_time: [],                           // 开票日期
        prop: 'createTime',
        order: -1
      },
      currentPage3: 1,        //默认开始页面
      pageSize3: 2,           //每页的数据条数
      count3: 0,

      invoice_info_rules: {                         // 开票记录规则
        contractId: [
          { required: true, message: '请选择合同名称', trigger: 'change' },
        ],
        invoiceTime: [
          { required: true, message: '请选择开票日期', trigger: 'change' },
        ],
        invoiceAmount: [
          { required: true, message: '请输入开票金额', trigger: 'blur' },
        ],
      },

      invoiceInfoAdd: {},                           // 新增开票信息表单
      invoiceInfoAddLabel: {},                      // 新增开票记录Lable
      invoiceInfo: {},                              // 开票记录信息
      invoiceInfoEdit: {},                 // 编辑开票记录信息
      invoiceInfoFieldList: {},                     // 开票记录字段集合

      receiptObj: {receiptstate : '未完成'},
    }
  },
  components: {
    dialogCheck,
  },

  mounted() {
    //  获取数据字典
    let that = this
    let list = ["crm-skzt", "crm-pjlx", "crm-fkfs", "crm-sklx"]
    this.$post("/crm/getDict", {"list": list}, (data) => {
      this.skzt = data['crm-skzt']
      this.pjlx = data['crm-pjlx']
      this.fkfs = data['crm-fkfs']
      this.sklx = data['crm-sklx']
    })
  },
  activated() {
    //  当前页面的get参数
    this.query = this.$router.currentRoute.query;
    /**
     * 页面加载前获取所有收款计划数据
     */
    this.initTableData(1);
    /**
     * 页面加载前获取所有收款记录数据
     */
    this.initTableDataReceiptInfo(1);
    /**
     * 页面加载前获取所有开票信息
     */
    this.initTableDataInvoiceInfo(1);
    /**
     * 页面加载前获取所有员工信息
     */
    this.getAllStaff()
  },


  methods: {
    //  清空收款计划查询
    clearQueryReceiptPlan(){
      this.dsQuery = {            //  查询条件
        prop: 'createTime',
        order: -1
      }
      this.initTableData(1)
    },

    //  计算为收款金额
    getUnAmount(data){
      // 得到收款总金额
      let a = data.contractAmount
      let b = 0
      data.receiptList.map((item) => {
        if (item.receiptstate == "已完成") {
          b += parseInt(item.planPaymentAmount)
        }
      })
      return a - b
    },
    // 获取所有收款计划

    initTableData(val){
      this.currentPage1 = val
      let params = this.deepClone(this.dsQuery)
      params.currentPage = val
      params.pageSize = this.pageSize1
      this.$post("/crm/receiptPlanPR/queryReceiptPlan", params, (data) => {
        this.tableData1 = data.list
        this.count1 = data.count
      })
    },
    sortChange(obj){
      this.dsQuery.prop = obj.prop || "createTime"
      this.dsQuery.order = obj.order == 'ascending' ? 1 : -1
      this.initTableData(1)
    },

    //  清空收款记录查询
    clearQueryReceiptInfo(){
      this.dsQuery_1 = {            //  查询条件
        prop: 'createTime',
        order: -1
      }
      this.initTableDataReceiptInfo(1)
    },

    // 获取所有收款记录
    initTableDataReceiptInfo(val){
      this.currentPage2 = val
      let params = this.deepClone(this.dsQuery_1)
      params.currentPage = val
      params.pageSize = this.pageSize2
      this.$post("/crm/receiptInfoPR/queryReceiptInfo", params, (data) => {
        this.tableData2 = data.list
        this.count2 = data.count
      })
    },
    sortChange1(obj){
      this.dsQuery_1.prop = obj.prop || "createTime"
      this.dsQuery_1.order = obj.order == 'ascending' ? 1 : -1
      this.initTableDataReceiptInfo(1)
    },

    //  清空开票信息查询
    clearQueryInvoiceInfo(){
      this.dsQuery_2 = {            //  查询条件
        prop: 'createTime',
        order: -1
      }
      this.initTableDataInvoiceInfo(1)
    },

    // 获取所有开票信息
    initTableDataInvoiceInfo(val){
      this.currentPage3 = val
      let params = this.deepClone(this.dsQuery_2)
      params.currentPage = val
      params.pageSize = this.pageSize3
      this.$post("/crm/invoiceInfoPR/queryInvoiceInfo", params, (data) => {
        this.tableData3 = data.list
        this.count3 = data.count
      })
    },
    sortChange2(obj){
      this.dsQuery_2.prop = obj.prop || "createTime"
      this.dsQuery_2.order = obj.order == 'ascending' ? 1 : -1
      this.initTableDataInvoiceInfo(1)
    },

    //  加载所有员工
    getAllStaff() {
      if(!this.allStaff.length){
        this.$post("/crm/getAllStaff", {}, (data) => {
          this.allStaff = data.list
          this.contact_list = data.list
          this.userName = data.userid
          this.userCname = data.username
        })
      }
    },

    /********************************************************新增收款计划************************************************/
    save_add(){
      if(!this.receiptObj.receiptNum){
        this.$message.error("请输入期数")
        return
      }
      if(!this.receiptObj.planReceiptTime){
        this.$message.error("请选择期数")
        return
      }
      if(!this.receiptObj.planPaymentAmount){
        this.$message.error("请输入计划付款金额")
        return
      }
      // 合计中的金额 + 正在输入的付计划付款金额
      let a = this.totalAmountAdd() + parseInt(this.receiptObj.planPaymentAmount)
      // 收款总金额
      let b = parseInt(this.paymentRecordAdd.contractAmount)
      if (!b || a > b) {
        this.$message.error("计划付款金额之和不能大于收款总金额")
        return
      }
      this.tableData1_1.push(this.receiptObj)
      this.receiptObj = {receiptstate : '未完成'}
    },
    // 计算收款计划合计
    totalAmountAdd(){
      let amount = 0
      this.tableData1_1.map(item => {
        amount += parseInt(item.planPaymentAmount)
      })
      return amount
    },

    // change事件，选择合同时，自动带出合同金额
    changeContract(val){
      // 收款计划
      this.paymentRecordAdd.contractAmount = val.split("/")[1]
      this.paymentRecordAdd.signingTime = val.split("/")[2]
      this.paymentRecordAdd.customerId = val.split("/")[3]
      // 收款记录
      this.receiptRecordAdd.customerId = val.split("/")[1]
      // 开票记录
      this.invoiceInfoAdd.customerId = val.split("/")[1]
    },

    //  打开新增模态框
    openModal(){
      if(!this.customers.length){
        this.$post("/crm/queryAllCustomers", {}, (data) => {
          this.customers = data.customers
        })
      }
      // 获取对应的财务经理下的合同
      if (!this.contracts.length) {
        this.$post("/crm/contractPR/getContractByManagerId", {}, (data) => {
          this.contracts = data.list
        })
      }
      // 获取所有财务经理
      if (!this.financialManagers.length) {
        this.$post("/crm/getFinancialManager", {}, (data) => {
          this.financialManagers = data.financialManagers
        })
      }
    },

    // 新增时，删除虚拟新增的收款计划数据集
    del_receipt_plan(index){
      this.tableData1_1.splice(index, 1);
    },

    /**
     * 保存收款计划数据
     */
    receiptSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.paymentRecordAdd)
          // 判断新增收款计划时，选择的合同和客户，已经存在收款计划。有，则提示已经存在改收款计划；没有，则添加
          this.$post("/crm/receiptPlanPR/isExitReceiptPlan", {paymentRecordAdd : this.paymentRecordAdd}, (data) => {
            let num = data.size
            console.log(num)
            if (num <= 0) {
              this.paymentRecordAdd.receiptList = this.tableData1_1
              this.$post("/crm/receiptPlanPR/addReceiptPlan", this.paymentRecordAdd, (data) => {
                this.$notify.success({ message: '操作成功！'});
                this.initTableData(1);
                this.dialogPaymentPlanVisible = false;
              })
            } else {
              this.$notify.warning({ message: '该收款计划已存在！'});
            }
          })
        }
      });
    },

    // 关闭新增模态框时，清空数据
    closePaymentRecord (){
      // this.$refs['paymentRecordAdd'].resetFields();
      this.paymentRecordAdd = {receiptList : []};
      this.tableData1_1 = []
    },

    /******************************************编辑******************************************/
    // 编辑，弹出模态框
    edit_receipt_plan() {
      var select_value = this.selectValue;
      if (select_value.length < 1 || select_value.length > 1) {
        this.$notify.warning({ message: '请勾选一条数据！'});
        return;
      };

      // 得到当前行的Id
      let receipt_plan_id = this.selectValue[0].id

      this.$post("/crm/receiptPlanPR/queryReceiptPlanForOne", {id : receipt_plan_id}, (data) => {
        this.receiptPlanEdit = data.receiptPlan
        this.tableData1_2 = data.receiptPlan.receiptList
      })
      this.dialogEditPaymentPlanVisible = true;
    },

    // 保存编辑框中，修改计划收款计划中数据集信息
    save_edit(){
      if(!this.receiptObj.receiptNum){
        this.$message.error("请输入期数")
        return
      }
      if(!this.receiptObj.planReceiptTime){
        this.$message.error("请选择期数")
        return
      }
      if(!this.receiptObj.planPaymentAmount){
        this.$message.error("请输入计划付款金额")
        return
      }
      // 合计中的金额 + 正在输入的付计划付款金额
      let a = this.totalAmountEdit() + parseInt(this.receiptObj.planPaymentAmount)
      // 收款总金额
      let b = parseInt(this.receiptPlanEdit.contractAmount)
      if (!b || a > b) {
        this.$message.error("计划付款金额之和不能大于收款总金额")
        return
      }
      this.tableData1_2.push(this.receiptObj)
      this.receiptObj = {receiptstate : '未完成'}
    },

    // 编辑时，统计计划收款总金额
    totalAmountEdit(){
      let amount = 0
      this.tableData1_2.map(item => {
        amount += parseInt(item.planPaymentAmount)
      })
      return amount
    },

    // 编辑时，删除虚拟新增的收款计划数据集
    del_receipt_plan_edit(index){
      this.tableData1_2.splice(index, 1);
    },

    //  保存编辑
    receiptPlanEditSave(){
      this.receiptPlanEdit.contractId = this.receiptPlanEdit.contractName.split("/")[1]
      this.receiptPlanEdit.contractName = this.receiptPlanEdit.contractName.split("/")[0]

      this.$post("/crm/receiptPlanPR/updateReceiptPlan", {receiptPlan : this.receiptPlanEdit}, (data) => {
        this.$message.success("修改成功！")
        this.initTableData(1);
        this.receiptPlan = this.deepClone(this.receiptPlanEdit)
      })
      this.$refs.table.clearSelection()
      this.dialogEditPaymentPlanVisible = false;
    },

    //  设置完成
    setupFinishSave(id, receiptId){
      this.$post("/crm/receiptPlanPR/setupFinish", {id : id, receiptId : receiptId}, (data) => {
        this.$message.success("设置成功！")
        this.initTableData(1);
      })
      // this.$refs.table.clearSelection()
    },

    /***********************************************删除收款计划*******************************************/
    // 删除收款计划
    delReceiptPlan(){
      var select_value = this.selectValue;
      if (select_value.length < 1) {
        this.$notify.warning({ message: '请勾选数据！'});
        return;
      };

      this._confirm('确定删除吗?', () => {
        let ids = []
        this.selectValue.map(item => {
          ids.push(item.id)
        })

        this.$post("/crm/receiptPlanPR/deleteReceiptPlan", {list : ids}, (data) => {
          if(data.message){
            this.$message.error(data.message)
          }else{
            this.$message.success("删除成功！")
          }
          this.$refs.table.clearSelection()
          this.initTableData(1);
        })
      })
    },

    /********************************************************新增收款记录************************************************/
    add_receipt_record() {
      // this.getAllStaff()
      this.receiptRecordAdd.receipterCname = this.userName + "/" + this.userCname
      this.$post("/crm/extFieldPR/getField", {tableName: 'crm_receipt_info'}, (data) => {
        this.receiptRecordAddLabel = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.receiptRecordAdd[item.name] = []
            }
          }
        })
        this.dialogReceiptRecordVisible = true;
      })
    },

    /**
     * 保存收款记录数据
     */
    receiptRecordSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$post("/crm/receiptInfoPR/addReceiptInfo", this.receiptRecordAdd, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.initTableDataReceiptInfo(1);
            this.dialogReceiptRecordVisible = false;
          })
        }
      });
    },

    // 关闭新增模态框时，清空数据
    closeReceiptRecord (){
      this.$refs['receiptRecordAdd'].resetFields();
    },

    /******************************************编辑收款记录******************************************/
    // 编辑，弹出模态框
    edit_receipt_info() {
      var select_value = this.selectValue;
      if (select_value.length < 1 || select_value.length > 1) {
        this.$notify.warning({ message: '请勾选一条数据！'});
        return;
      };
      // 得到当前行数据
      this.receiptRecordEdit = this.deepClone(this.selectValue[0])
      this.receiptRecordEdit.receipterCname = this.receiptRecordEdit.receipterId + "/" + this.receiptRecordEdit.receipterCname

      this.$post("/crm/extFieldPR/getField", {tableName: 'crm_receipt_info'}, (data) => {
        this.receiptRecordFieldList = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.receiptRecord[item.name] = []
            }
          }
        })
        this.dialogEditReceiptRecordVisible = true;
      })
    },

    //  保存编辑
    receiptRecordEditSave(){
      this.$refs.receiptRecordEdit.validate((valid) => {
        if (valid) {
          this.$post("/crm/receiptInfoPR/updateReceiptInfo", {receiptRecord : this.receiptRecordEdit}, (data) => {
            this.$message.success("修改成功！")
            this.initTableDataReceiptInfo(1);
            this.receiptRecord = this.deepClone(this.receiptRecordEdit)
          })
          this.$refs.table1.clearSelection()
          this.dialogEditReceiptRecordVisible = false;
        }
      })
    },

    /*****************************************删除收款记录******************************************/
    // 删除收款记录
    delReceiptRecord(){
      var select_value = this.selectValue;
      if (select_value.length < 1) {
        this.$notify.warning({ message: '请勾选数据！'});
        return;
      };

      this._confirm('确定删除吗?', () => {
        let ids = []
        this.selectValue.map(item => {
          ids.push(item.id)
        })

        this.$post("/crm/receiptInfoPR/deleteReceiptInfo", {list : ids}, (data) => {
          if(data.message){
            this.$message.error(data.message)
          }else{
            this.$message.success("删除成功！")
          }
          this.$refs.table1.clearSelection()
          this.initTableDataReceiptInfo(1);
        })
      })
    },

    /********************************************************新增开票记录************************************************/
    add_invoice_info() {
      this.invoiceInfoAdd.agent = this.userName + "/" + this.userCname
      this.$post("/crm/extFieldPR/getField", {tableName: 'crm_invoice_info'}, (data) => {
        this.invoiceInfoAddLabel = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.invoiceInfoAdd[item.name] = []
            }
          }
        })
        this.dialogInvoiceInfoVisible = true;
      })
    },

    /**
     * 保存开票记录数据
     */
    invoiceInfoSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$post("/crm/invoiceInfoPR/addInvoiceInfo", this.invoiceInfoAdd, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.initTableDataInvoiceInfo(1);
            this.dialogInvoiceInfoVisible = false;
          })
        }
      });
    },

    // 关闭新增模态框时，清空数据
    closeInvoiceInfo (){
      this.$refs['invoiceInfoAdd'].resetFields();
    },

    /******************************************编辑开票记录******************************************/
    // 编辑，弹出模态框
    edit_invoice_info() {
      var select_value = this.selectValue;
      if (select_value.length < 1 || select_value.length > 1) {
        this.$notify.warning({ message: '请勾选一条数据！'});
        return;
      };

      // 得到当前行数据
      this.invoiceInfoEdit = this.deepClone(this.selectValue[0])
      this.invoiceInfoEdit.agent = this.invoiceInfoEdit.agentId + "/" + this.invoiceInfoEdit.agent

      this.$post("/crm/extFieldPR/getField", {tableName: 'crm_invoice_info'}, (data) => {
        this.invoiceInfoFieldList = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.invoiceInfo[item.name] = []
            }
          }
        })
        this.dialogEditInvoiceInfoVisible = true;
      })
    },

    //  保存编辑
    invoiceInfoEditSave(){
      this.$post("/crm/invoiceInfoPR/updateInvoiceInfo", {invoiceInfo : this.invoiceInfoEdit}, (data) => {
        this.$message.success("修改成功！")
        this.initTableDataInvoiceInfo(1);
        this.invoiceInfo = this.deepClone(this.invoiceInfoEdit)
      })
      this.$refs.table2.clearSelection()
      this.dialogEditInvoiceInfoVisible = false;
    },

    /*****************************************删除开票记录******************************************/
    // 删除开票记录
    delInvoiceInfo(){
      var select_value = this.selectValue;
      if (select_value.length < 1) {
        this.$notify.warning({ message: '请勾选数据！'});
        return;
      };

      this._confirm('确定删除吗?', () => {
        let ids = []
        this.selectValue.map(item => {
          ids.push(item.id)
        })

        this.$post("/crm/invoiceInfoPR/deleteInvoiceInfo", {list : ids}, (data) => {
          if(data.message){
            this.$message.error(data.message)
          }else{
            this.$message.success("删除成功！")
          }
          this.$refs.table2.clearSelection()
          this.initTableDataInvoiceInfo(1);
        })
      })
    },

    /**
     * 勾选的数据
     */
    handleSelectionChange(val) {
      this.selectValue = val;
    },

  }
}
