import {mapState, mapActions, mapMutations} from 'vuex'
import dialogCheck from '../components/dialogCheck'
import {regionData, CodeToText, TextToCode} from 'element-china-area-data'

export default {
  data() {
    return {
      allStaff: [],           // 所有员工
      staff: '',              // 员工
      userName: '',           // 工号
      userCname: '',          // 姓名
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

      /************************************************付款计划*****************************************************/
      formPaymentPlan: {paymentList : []},            // 新增付款计划表单
      formPaymentPlanLable: {},                       // 新增付款计划Lable
      paymentPlanEdit: {},                            // 编辑付款计划信息
      dsQuery_1: {                                    // 付款计划查询
        contractName: '',                             // 合同名称
        sub_contract: '',                             // 分包商名称
        prop: 'createTime',
        order: -1
      },
      currentPage1: 1,        //默认开始页面
      pageSize1: 2,           //每页的数据条数
      count1: 0,

      payment_plan_rules: {                         // 计划付款规则
        subContractName: [
          { required: true, message: '请选择合同名称', trigger: 'change' },
        ],
      },

      subContractors: [],                           // 所有分包商
      purchaseContracts: [],                        // 所有的分包合同名称
      selectValue: [],                              // 勾选的数据
      skzt: [],                                     // 付款状态

      /*****************************************************弹框***************************************************/
      dialogPaymentPlanVisible: false,              //  新增付款计划
      dialogEditPaymentPlanVisible: false,          //  编辑付款计划
      dialogPaymentRecordVisible: false,            //  新增付款记录
      dialogEditPaymentRecordVisible: false,        //  编辑付款记录
      dialogCollectTicketVisible: false,            //  新增收票记录
      dialogEditCollectTicketVisible: false,        //  编辑收票记录

      /************************************************付款记录*****************************************************/
      dsQuery_2: {                                  // 付款记录查询
        contractName: '',                           // 合同名称
        sub_contract: '',                           // 分包商名称
        actual_payment_time: [],                    // 实际付款日期
        prop: 'createTime',
        order: -1
      },
      currentPage2: 1,                              //默认开始页面
      pageSize2: 2,                                 //每页的数据条数
      count2: 0,

      payment_record_rules: {                       // 付款记录规则
        subContractId: [
          { required: true, message: '请选择分包合同', trigger: 'change' },
        ],
        paymentActualTime: [
          { required: true, message: '请选择付款日期', trigger: 'change' },
        ],
        paymentAmount: [
          { required: true, message: '请填写付款金额', trigger: 'blur' },
        ],
        ownerCname: [
          { required: true, message: '请选择付款人', trigger: 'change' },
        ],
      },

      formPaymentRecord: {},                        // 新增付款记录表单
      formPaymentRecordLabel: {},                   // 新增付款记录Lable
      paymentRecord: {},                            // 付款记录信息
      paymentRecordEdit: {},                        // 编辑付款记录信息
      paymentRecordFieldList: [],                   // 付款记录字段集合
      pjlx: [],                                     // 票据类型
      fkfs: [],                                     // 付款方式
      sklx: [],                                     // 付款类型

      /**************************************************收票信息*****************************************************/
      dsQuery_3: {                                  // 收票信息查询
        contractName: '',                           // 合同名称
        sub_contract: '',                           // 分包商名称
        type: '',                                   // 票据类型
        collect_ticket_time: [],                    // 收票日期
        prop: 'createTime',
        order: -1
      },
      currentPage3: 1,        //默认开始页面
      pageSize3: 2,           //每页的数据条数
      count3: 0,

      collect_ticket_rules: {                         // 收票记录规则
        subContractorId: [
          { required: true, message: '请选择分包商', trigger: 'change' },
        ],
        subContractName: [
          { required: true, message: '请选择分包合同', trigger: 'change' },
        ],
        collectTicketTime: [
          { required: true, message: '请选择开票日期', trigger: 'change' },
        ],
        collectTicketAmount: [
          { required: true, message: '请输入开票金额', trigger: 'blur' },
        ],
      },

      collectTicketAdd: {},                           // 新增收票信息表单
      collectTicketAddLabel: {},                      // 新增收票记录Lable
      collectTicket: {},                              // 收票记录信息
      collectTicketEdit: {},                          // 编辑收票记录信息
      collectTicketFieldList: {},                     // 收票记录字段集合

      receiptObj: {paymentState : '未完成'},
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
     * 页面加载前获取所有付款计划数据
     */
    this.initTableDataPaymentPlan(1);
    /**
     * 页面加载前获取所有付款记录数据
     */
    this.initTableDataPaymentInfo(1);
    /**
     * 页面加载前获取所有收票信息
     */
    this.initTableDataCollectTicket(1);
    // 加载所有员工
    this.getAllStaff()
  },


  methods: {

    //  计算为付款金额
    getUnAmount(data){
      // 得到付款总金额
      let a = data.contractAmount
      let b = 0
      data.paymentList.map((item) => {
        if (item.paymentState == "已完成") {
          b += parseInt(item.planPaymentAmount)
        }
      })
      return a - b
    },
    // 获取所有付款计划

    initTableDataPaymentPlan(val){
      this.currentPage1 = val
      let params = this.deepClone(this.dsQuery_1)
      params.currentPage = val
      params.pageSize = this.pageSize1
      this.$post("/crm/paymentPlanPR/queryPaymentPlan", params, (data) => {
        this.tableData1 = data.list
        this.count1 = data.count
      })
    },
    sortChange(obj){
      this.dsQuery_1.prop = obj.prop || "createTime"
      this.dsQuery_1.order = obj.order == 'ascending' ? 1 : -1
      this.initTableDataPaymentPlan(1)
    },

    // 获取所有付款记录
    initTableDataPaymentInfo(val){
      this.currentPage2 = val
      let params = this.deepClone(this.dsQuery_2)
      params.currentPage = val
      params.pageSize = this.pageSize2
      this.$post("/crm/paymentInfoPR/queryPaymentInfo", params, (data) => {
        this.tableData2 = data.list
        this.count2 = data.count
      })
    },
    sortChange1(obj){
      this.dsQuery_2.prop = obj.prop || "createTime"
      this.dsQuery_2.order = obj.order == 'ascending' ? 1 : -1
      this.initTableDataPaymentInfo(1)
    },

    // 获取所有开票信息
    initTableDataCollectTicket(val){
      this.currentPage3 = val
      let params = this.deepClone(this.dsQuery_3)
      params.currentPage = val
      params.pageSize = this.pageSize3
      this.$post("/crm/collectTicketPR/queryCollectTicket", params, (data) => {
        this.tableData3 = data.list
        this.count3 = data.count
      })
    },
    sortChange2(obj){
      this.dsQuery_3.prop = obj.prop || "createTime"
      this.dsQuery_3.order = obj.order == 'ascending' ? 1 : -1
      this.initTableDataCollectTicket(1)
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

    /********************************************************新增付款计划************************************************/
    save_add(){
      if(!this.receiptObj.paymentNum){
        this.$message.error("请输入期数")
        return
      }
      if(!this.receiptObj.planPaymentTime){
        this.$message.error("请选择期数")
        return
      }
      if(!this.receiptObj.planPaymentAmount){
        this.$message.error("请输入计划付款金额")
        return
      }
      // 合计中的金额 + 正在输入的付计划付款金额
      let a = this.totalAmountAdd() + parseInt(this.receiptObj.planPaymentAmount)
      // 付款总金额
      let b = parseInt(this.formPaymentPlan.contractAmount)
      if (!b || a > b) {
        this.$message.error("计划付款金额之和不能大于付款总金额")
        return
      }
      this.tableData1_1.push(this.receiptObj)
      this.receiptObj = {paymentState : '未完成'}
    },
    // 计算付款计划合计
    totalAmountAdd(){
      let amount = 0
      this.tableData1_1.map(item => {
        amount += parseInt(item.planPaymentAmount)
      })
      return amount
    },

    // change事件，选择合同时，自动带出合同金额
    changeContract(val){
      // 付款计划
      this.formPaymentPlan.contractAmount = val.split("/")[1]
      this.formPaymentPlan.signingTime = val.split("/")[2]
      this.formPaymentPlan.subContractorId = val.split("/")[3]
      // 付款记录
      this.formPaymentRecord.subContractorId = val.split("/")[1]
      // 开票记录
      this.collectTicketAdd.subContractorId = val.split("/")[1]
    },

    //  打开新增模态框
    openModal(){
      // 得到所有的分包商
      if(!this.subContractors.length){
        this.$post("/crm/subContractorPR/queryAllSubContractor", {}, (data) => {
          this.subContractors = data.list
        })
      }
      // 获取对应的财务经理下的合同
      if (!this.purchaseContracts.length) {
        this.$post("/crm/purchaseContractPR/getContractByManagerId", {}, (data) => {
          this.purchaseContracts = data.list
        })
      }
    },

    // 新增时，删除虚拟新增的付款计划数据集
    del_receipt_plan(index){
      this.tableData1_1.splice(index, 1);
    },

    /**
     * 保存付款计划数据
     */
    paymentSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.formPaymentPlan)
          // 判断新增付款计划时，选择的分包合同和分包商，已经存在付款计划。有，则提示已经存在改付款计划；没有，则添加
          this.$post("/crm/paymentPlanPR/isExitPaymentPlan", {formPaymentPlan : this.formPaymentPlan}, (data) => {
            let num = data.size
            if (num <= 0) {
              this.formPaymentPlan.paymentList = this.tableData1_1
              this.$post("/crm/paymentPlanPR/addPaymentPlan", this.formPaymentPlan, (data) => {
                this.$notify.success({ message: '操作成功！'});
                this.initTableDataPaymentPlan(1);
                this.dialogPaymentPlanVisible = false;
              })
            } else {
              this.$notify.warning({ message: '该付款计划已存在！'});
            }
          })
        }
      });
    },

    // 关闭新增模态框时，清空数据
    closePaymentPlan (){
      this.formPaymentPlan = {paymentList : []};
      this.tableData1_1 = []
    },

    /******************************************编辑******************************************/
    // 编辑，弹出模态框
    edit_payment_plan() {
      var select_value = this.selectValue;
      if (select_value.length < 1 || select_value.length > 1) {
        this.$notify.warning({ message: '请勾选一条数据！'});
        return;
      };

      // 得到当前行的Id
      let payment_plan_id = this.selectValue[0].id

      this.$post("/crm/paymentPlanPR/queryPaymentPlanForOne", {id : payment_plan_id}, (data) => {
        this.paymentPlanEdit = data.paymentPlan
        this.tableData1_2 = data.paymentPlan.paymentList
      })
      this.dialogEditPaymentPlanVisible = true;
    },

    // 保存编辑框中，修改计划付款计划中数据集信息
    save_edit(){
      if(!this.receiptObj.paymentNum){
        this.$message.error("请输入期数")
        return
      }
      if(!this.receiptObj.planPaymentTime){
        this.$message.error("请选择付款日期")
        return
      }
      if(!this.receiptObj.planPaymentAmount){
        this.$message.error("请输入计划付款金额")
        return
      }
      // 合计中的金额 + 正在输入的付计划付款金额
      let a = this.totalAmountEdit() + parseInt(this.receiptObj.planPaymentAmount)
      // 付款总金额
      let b = parseInt(this.paymentPlanEdit.contractAmount)
      if (!b || a > b) {
        this.$message.error("计划付款金额之和不能大于付款总金额")
        return
      }
      this.tableData1_2.push(this.receiptObj)
      this.receiptObj = {paymentState : '未完成'}
    },

    // 编辑时，统计计划付款总金额
    totalAmountEdit(){
      let amount = 0
      this.tableData1_2.map(item => {
        amount += parseInt(item.planPaymentAmount)
      })
      return amount
    },

    // 编辑时，删除虚拟新增的付款计划数据集
    del_payment_plan_edit(index){
      this.tableData1_2.splice(index, 1);
    },

    //  保存编辑
    paymentPlanEditSave(){
      this.paymentPlanEdit.subContractId = this.paymentPlanEdit.subContractName.split("/")[1]
      this.paymentPlanEdit.subContractName = this.paymentPlanEdit.subContractName.split("/")[0]

      this.$post("/crm/paymentPlanPR/updatePaymentPlan", {paymentPlan : this.paymentPlanEdit}, (data) => {
        this.$message.success("修改成功！")
        this.initTableDataPaymentPlan(1);
        this.paymentPlan = this.deepClone(this.paymentPlanEdit)
      })
      this.$refs.table.clearSelection()
      this.dialogEditPaymentPlanVisible = false;
    },

    //  设置完成
    setupFinishSave(id, paymentId){
      console.log(paymentId)
      this.$post("/crm/paymentPlanPR/setupFinish", {id : id, paymentId : paymentId}, (data) => {
        this.$message.success("设置成功！")
        this.initTableDataPaymentPlan(1);
      })
      // this.$refs.table.clearSelection()
    },

    /***********************************************删除付款计划*******************************************/
    // 删除付款计划
    delPaymentPlan(){
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

        this.$post("/crm/paymentPlanPR/deletePaymentPlan", {list : ids}, (data) => {
          if(data.message){
            this.$message.error(data.message)
          }else{
            this.$message.success("删除成功！")
          }
          this.$refs.table.clearSelection()
          this.initTableDataPaymentPlan(1);
        })
      })
    },

    /********************************************************新增付款记录************************************************/
    add_payment_record() {
      this.formPaymentRecord.paymentCname = this.userName + "/" + this.userCname
      this.$post("/crm/extFieldPR/getField", {tableName: 'crm_payment_info'}, (data) => {
        this.formPaymentRecordLabel = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.formPaymentRecord[item.name] = []
            }
          }
        })
        this.dialogPaymentRecordVisible = true;
      })
    },

    /**
     * 保存付款记录数据
     */
    paymentRecordSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formPaymentRecord = this.deepClone(this.formPaymentRecord)
          formPaymentRecord.paymentId = formPaymentRecord.paymentCname.split("/")[0]
          formPaymentRecord.paymentCname = formPaymentRecord.paymentCname.split("/")[1]

          formPaymentRecord.subContractId = formPaymentRecord.subContractId.split("/")[0]
          console.log(formPaymentRecord)
          this.$post("/crm/paymentInfoPR/addPaymentInfo", {formPaymentRecord : formPaymentRecord}, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.initTableDataPaymentInfo(1);
            this.dialogPaymentRecordVisible = false;
          })
        }
      });
    },

    // 关闭新增模态框时，清空数据
    closePaymentRecord (){
      this.$refs['formPaymentRecord'].resetFields();
    },

    /******************************************编辑付款记录******************************************/
    // 编辑，弹出模态框
    edit_payment_info() {
      var select_value = this.selectValue;
      if (select_value.length < 1 || select_value.length > 1) {
        this.$notify.warning({ message: '请勾选一条数据！'});
        return;
      };

      this.paymentRecordEdit = this.deepClone(this.selectValue[0])
      this.paymentRecordEdit.paymentCname = this.paymentRecordEdit.paymentId + "/" + this.paymentRecordEdit.paymentCname

      this.$post("/crm/extFieldPR/getField", {tableName: 'crm_payment_info'}, (data) => {
        this.paymentRecordFieldList = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.paymentRecord[item.name] = []
            }
          }
        })
        this.dialogEditPaymentRecordVisible = true;
      })
    },

    //  保存编辑
    paymentRecordEditSave(){
      this.$refs.paymentRecordEdit.validate((valid) => {
        if (valid) {

          let paymentRecordEdit = this.deepClone(this.paymentRecordEdit)
          paymentRecordEdit.paymentId = paymentRecordEdit.paymentCname.split("/")[0]
          paymentRecordEdit.paymentCname = paymentRecordEdit.paymentCname.split("/")[1]

          this.$post("/crm/paymentInfoPR/updatePaymentInfo", {paymentRecord : paymentRecordEdit}, (data) => {
            this.$message.success("修改成功！")
            this.initTableDataPaymentInfo(1);
            this.paymentRecord = this.deepClone(this.paymentRecordEdit)
          })
          this.$refs.table1.clearSelection()
          this.dialogEditPaymentRecordVisible = false;
        }
      })
    },

    /*****************************************删除付款记录******************************************/
    // 删除付款记录
    delPaymentRecord(){
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

        this.$post("/crm/paymentInfoPR/deletePaymentInfo", {list : ids}, (data) => {
          if(data.message){
            this.$message.error(data.message)
          }else{
            this.$message.success("删除成功！")
          }
          this.$refs.table1.clearSelection()
          this.initTableDataPaymentInfo(1);
        })
      })
    },

    /********************************************************新增收票记录************************************************/
    add_collect_ticket() {
      this.collectTicketAdd.agent = this.userName + "/" + this.userCname
      this.$post("/crm/extFieldPR/getField", {tableName: 'crm_collect_ticket'}, (data) => {
        this.collectTicketAddLabel = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.collectTicketAdd[item.name] = []
            }
          }
        })
        this.dialogCollectTicketVisible = true;
      })
    },

    /**
     * 保存开票记录数据
     */
    collectTicketSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let collectTicketAdd = this.deepClone(this.collectTicketAdd)
          collectTicketAdd.agentId = collectTicketAdd.agent.split("/")[0]
          collectTicketAdd.agent = collectTicketAdd.agent.split("/")[1]

          collectTicketAdd.subContractId = collectTicketAdd.subContractId.split("/")[0]
          this.$post("/crm/collectTicketPR/addCollectTicket", {collectTicketAdd : collectTicketAdd}, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.initTableDataCollectTicket(1);
            this.dialogCollectTicketVisible = false;
          })
        }
      });
    },

    // 关闭新增模态框时，清空数据
    closeCollectTicket (){
      this.$refs['collectTicketAdd'].resetFields();
    },

    /******************************************编辑开票记录******************************************/
    // 编辑，弹出模态框
    edit_collect_ticket() {
      var select_value = this.selectValue;
      if (select_value.length < 1 || select_value.length > 1) {
        this.$notify.warning({ message: '请勾选一条数据！'});
        return;
      };

      this.collectTicketEdit = this.deepClone(this.selectValue[0])
      this.collectTicketEdit.agent = this.collectTicketEdit.agentId + "/" + this.collectTicketEdit.agent

      this.$post("/crm/extFieldPR/getField", {tableName: 'crm_collect_ticket'}, (data) => {
        this.collectTicketFieldList = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.collectTicket[item.name] = []
            }
          }
        })
        this.dialogEditCollectTicketVisible = true;
      })
    },

    //  保存编辑
    collectTicketEditSave(){
      this.$refs.collectTicketEdit.validate((valid) => {
        if (valid) {
          let collectTicketEdit = this.deepClone(this.collectTicketEdit)
          collectTicketEdit.agentId = collectTicketEdit.agent.split("/")[0]
          collectTicketEdit.agent = collectTicketEdit.agent.split("/")[1]

          this.$post("/crm/collectTicketPR/updateCollectTicket", {collectTicket : collectTicketEdit}, (data) => {
            this.$message.success("修改成功！")
            this.initTableDataCollectTicket(1);
            this.collectTicket = this.deepClone(this.collectTicketEdit)
          })
          this.$refs.table2.clearSelection()
          this.dialogEditCollectTicketVisible = false;
        }
      })
    },

    /*****************************************删除开票记录******************************************/
    // 删除开票记录
    delCollectTicket(){
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

        this.$post("/crm/collectTicketPR/deleteCollectTicket", {list : ids}, (data) => {
          if(data.message){
            this.$message.error(data.message)
          }else{
            this.$message.success("删除成功！")
          }
          this.$refs.table2.clearSelection()
          this.initTableDataCollectTicket(1);
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
