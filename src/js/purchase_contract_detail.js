import { mapState, mapActions, mapMutations } from 'vuex'
import {regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode} from 'element-china-area-data'

export default {
  data() {
      return {
        allStaff: [],                                     //  所有员工
        staff: '',                                        // 转给他人：员工
        activeName: 'first',                              //  tab页签
        tableData: [{date: '2018-10-02', address: 2000}], //  表格
        formBasicInfo: {},                                //  基本信息
        formAddReceipt: {},                               //  新增收款表单
        formAddInvoicing: {},                             //  新增开票记录表单
        formEdit: {},                                     //  编辑合同表单
        formTransfer: {},                                 //  转给他人表单
        formDeploy: {},                                   //  配置收款计划表单
        dialogReceiptVisible: false,                      // 新增收款
        dialogInvoicingVisible: false,                    // 新增开票记录
        dialogEditVisible: false,                         // 编辑
        dialogTransferVisible: false,                     // 转给他人
        dialogDeployVisible: false,                       // 配置收款计划+
        operateLog: [],                                   // 操作日志列表

        /****************************************分包合同基本信息*********************************************/
        purchaseContract: {},                             // 分包合同信息
        purchaseContractEdit: {},                         // 编辑分包合同信息
        isEdit: false,                                    // 是否编辑
        purchaseContractFieldList: [],                    // 分包合同字段集合
        purchase_contract_rules: {                        // 分包合同字段校验
          contractName: [
            { required: true, message: '请选择合同名称', trigger: 'change' },
          ],
          purchaseProject: [
            { required: true, message: '请选择分包项目', trigger: 'change' },
          ],
          contracAmount: [
            { required: true, message: '请填写合同总金额', trigger: 'blur' },
          ],
          ownerCname: [
            { required: true, message: '请选择合同负责人', trigger: 'change' },
          ],
          purchasersId: [
            { required: true, message: '请选择分包商', trigger: 'change' },
          ],
          signatoryTime: [
            { required: true, message: '请选择签约日期', trigger: 'change' },
          ],
        },
        purchase_contract_htzt: [],                       // 合同状态
        financialManagers: [],                            // 所有财务经理

        /****************************************附件列表*********************************************/
        dialogAnnexVisible: false,      // 上传附件弹框
        annexList: [],                  // 附件列表
        annexRemarks: '',               // 备注
        files: [],                      // 上传文件列表

        /****************************************付款管理**************************************************/
        alreadyPayment: 0,                                // 已付款金额
        unalreadyPayment: 0,                              // 未付款金额
        paymentPlanList: [],                              // 付款计划集合
        paymentObj: {paymentState : '未完成'},
        tableData1_1: [],                                 // 付款计划弹框列表
        selectValue: [],                                  // 设置完成时，勾选的客户数据
        paymentInfoList: [],                              // 收款信息集合
        collectionTicketList: [],                         // 收票信息集合
        alreadyCollectTicketAmount: 0,                    // 已收票金额
      }
    },

    activated(){
      //  当前页面的get参数
      this.query = this.$router.currentRoute.query;
      //  获取分包合同详情页面信息
      this.getPurchaseContract()
    },

    methods: {

    /***************************************基本信息****************************************/
    // 返回前一个页面
    goBack(){
      this.$router.go(-1)
    },

    // 获取
    getPurchaseContractField(){
      this.$post("/crm/extFieldPR/getField", {tableName: 'crm_purchase_contract'}, (data) => {
        this.purchaseContractFieldList = data.list
      })
    },

    //  加载所有员工
    getAllStaff() {
      if(!this.allStaff.length){
        this.$post("/crm/getAllStaff", {}, (data) => {
          this.allStaff = data.list
          this.contact_list = data.list
        })
      }
    },

    // 得到分包合同详情页面分包合同的字段信息
    getPurchaseContract(){
      this.$post("/crm/purchaseContractDetailPR/queryPurchaseContractForOne", {id: this.query.id}, (data) => {
        this.purchaseContract = data.purchaseContract
        this.isOwner = data.isOwner
        this.purchaseContractEdit = this.deepClone(data.purchaseContract)
      })
      this.getPurchaseContractField()
      this.$post("/crm/getDict", {list: ['CRM-HTZT']}, (data) => {
        this.purchase_contract_htzt = data['CRM-HTZT']
      })
    },

    /******************************************转给他人***************************************/
    // 打开转给他人弹框
    turnOther(){
      this.getAllStaff()
      this.dialogTransferVisible = true
    },

    // 转给他人确定按钮
    turn_other_sava(){
      if(!this.staff){
        this.$message.error("请选择新拥有者！")
        return
      }
      let list = [this.purchaseContract.id]
      let params = {
        list: list,
        ownerId: this.staff,
        ifLeft: this.formTransfer.checkbox1
      }
      this.$post("/crm/purchaseContractPR/turnOther", params, (data) => {
        this.dialogTransferVisible = false
        this.$message.success("转移成功！")
        this.$router.back(-1)
      })
    },

    /*******************************************编辑********************************************/
    //  编辑合同
    editPurchaseContract(){
      this.activeName = 'first'
      this.isEdit = true
      this.getPurchaseContractField()
      this.getAllStaff()
      this.getFinancialManager()
    },

    // 获取所有财务经理
    getFinancialManager(){
      if (!this.financialManagers.length) {
        this.$post("/crm/getFinancialManager", {}, (data) => {
          this.financialManagers = data.financialManagers
        })
      }
    },

    //  取消编辑
    cancelPurchaseContractEdit(){
      this.isEdit = false
      this.purchaseContractEdit = this.deepClone(this.purchaseContract)
    },

    //  保存编辑
    purchaseContractSave(){
      this.$refs.purchaseContractEdit.validate((valid) => {
        if (valid) {
          let purchaseContractEdit = this.deepClone(this.purchaseContractEdit)
          if(this.purchaseContractEdit.ownerCname.indexOf("/") != -1){
            purchaseContractEdit.ownerId = purchaseContractEdit.ownerCname.split("/")[0]
            purchaseContractEdit.ownerCname = purchaseContractEdit.ownerCname.split("/")[1]
          }
          if(this.purchaseContractEdit.financialManagerName.indexOf("/") != -1){
            purchaseContractEdit.financialManagerId = purchaseContractEdit.financialManagerName.split("/")[0]
            purchaseContractEdit.financialManagerName = purchaseContractEdit.financialManagerName.split("/")[1]
          }
          this.$post("/crm/purchaseContractPR/updatePurchaseContract", {purchaseContract : purchaseContractEdit}, (data) => {
            this.$message.success("修改成功！")
            this.isEdit = false
            this.getPurchaseContract()
            this.purchaseContract = this.deepClone(this.purchaseContractEdit)
          })
        }
      })
    },

    /***************************************删除分包合同****************************************/
    //  删除分包合同
    delPurchaseContract(){
      this._confirm('确定删除吗?', () => {
        this.$post('/crm/purchaseContractPR/deletePurchaseContract', {"list": [this.purchaseContract.id]}, (data) => {
          if (data.message) {
            this.$message.error(data.message)
          } else {
            this.$message.success("删除成功！")
            this.$router.back(-1)
          }
        })
      })
    },

    /***************************************付款计划***************************************/
    // 得到已收款金额
    getPaymentPlan(){
      this.$post("/crm/purchaseContractDetailPR/queryPaymentByContractId", {id : this.query.id, purchasersId : this.purchaseContract.purchasersId, tableName : "crm_payment_plan"}, (data) => {
        this.paymentPlanList = data.list
        this.paymentPlan = data.paymentPlan
        if (this.paymentPlan.paymentList) {
          this.tableData1_1 = data.paymentPlan.paymentList

          this.alreadyPayment = 0
          this.unalreadyPayment = 0
          // 得到已收款金额
          this.paymentPlan.paymentList.map(item => {
            if (item.paymentState == "已完成") {
              this.alreadyPayment += parseInt(item.planPaymentAmount)
            }
            if (item.paymentState == "未完成") {
              this.unalreadyPayment += parseInt(item.planPaymentAmount)
            }
          })
        }
      })
    },

    /*******************************配置收款计划********************************/
    // 关闭新增模态框时，清空数据
    closePaymentPlan (){
      this.tableData1_1 = []
    },

    save_add(){
      if(!this.paymentObj.paymentNum){
        this.$message.error("请输入期数")
        return
      }
      if(!this.paymentObj.planPaymentTime){
        this.$message.error("请选择期数")
        return
      }
      if(!this.paymentObj.planPaymentAmount){
        this.$message.error("请输入计划付款金额")
        return
      }
      let a = 0
      this.tableData1_1.map(item => {
        a += parseInt(item.planPaymentAmount)
      })
      a += parseInt(this.paymentObj.planPaymentAmount)
      // 收款总金额
      let b = parseInt(this.purchaseContract.contracAmount)
      console.log(a)
      console.log(b)
      if (!b || a > b) {
        this.$message.error("计划付款金额之和不能大于收款总金额")
        return
      }
      this.tableData1_1.push(this.paymentObj)
      this.paymentObj = {paymentState : '未完成'}
    },
    totalAmountAdd(){
      let amount = 0
      this.tableData1_1.map(item => {
        amount += parseInt(item.planPaymentAmount)
      })
      return amount
    },

    // 新增时，删除虚拟新增的收款计划数据集
    del_receipt_plan(index){
      this.tableData1_1.splice(index, 1);
    },

    /**
     * 保存收款计划数据
     */
    paymentSave(purchasersId, contractId) {
      this.$refs.formDeploy.validate((valid) => {
        if (valid) {
          this.$post("/crm/purchaseContractDetailPR/updatePaymentPlan", {id : contractId, purchasersId : purchasersId, paymentList : this.tableData1_1}, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.getPaymentPlan()
            this.dialogDeployVisible = false;
          })
        }
      });
    },

    /****************************************设置完成******************************************/
    // 打开管理付款计划弹框
    openPaymentPlan(){
      this.activeName = "second"
      this.getPaymentPlan()
      this.dialogDeployVisible = true
    },

    //  设置完成
    setupFinishSave(purchaseContractId){
      var select_value = this.selectValue;
      if (select_value.length < 1) {
        this.$notify.warning({ message: '请勾选数据！'});
        return;
      };

      this._confirm('确定设置完成吗?', () => {
        let list = []
        this.selectValue.map(item => {
          list.push(item.paymentId)
        })

        this.$post("/crm/purchaseContractDetailPR/setFinish", {id : purchaseContractId, paymentIds : list}, (data) => {
          this.$message.success("设置成功！")
          this.getPaymentPlan()
        })
      })
    },

    /***************************************付款信息***************************************/
    // 得到收款信息
    getReceiptInfo(){
      this.$post("/crm/purchaseContractDetailPR/queryPaymentByContractId", {id : this.query.id, purchasersId : this.purchaseContract.purchasersId, tableName : "crm_payment_info"}, (data) => {
        this.paymentInfoList = data.payment_list
      })
    },

    /***************************************收票信息***************************************/
    // 得到开票信息
    getCollectTicket(){
      this.$post("/crm/purchaseContractDetailPR/queryPaymentByContractId", {id : this.query.id, purchasersId : this.purchaseContract.purchasersId, tableName : "crm_collect_ticket"}, (data) => {
        this.collectionTicketList = data.payment_list
        if (this.collectionTicketList) {
          this.alreadyCollectTicketAmount = 0
          this.collectionTicketList.map(item => {
            this.alreadyCollectTicketAmount += parseInt(item.collectTicketAmount)
          })
        }
      })
    },

    /***************************************附件***************************************/
    //  获取附件列表
    getAttachs(){
      this.$post("/crm/getAttachs", {parentId: this.purchaseContract.id}, (data) => {
        this.annexList = data.list
      })
    },

    //  删除附件
    delAnnex(id, fileName, index, rows){
      this._confirm('确定删除吗?', () => {
        this.$post("/crm/deleteFile", {ids : [id], moduleName : '分包合同', parentId : this.query.id, content : this.purchaseContract.contractName + '删除附件【' + fileName + '】'}, (data) => {
          this.$message.success("删除成功！")
          rows.splice(index, 1);
        })
      })
    },
    //  下载附件
    downLoadAnnex(id){
      this.$post("/crm/downloadOne", {id: id}, (data) => {
        let url = data.url
        console.log(url)
        window.open(url)
      })
    },
    //  打开选择文件
    chooseAnnex(){
      this.$refs.annexInput.click()
    },
    // 关闭时，清空数据
    closeAnnex(){
      this.files = []
      this.annexRemarks = ''
    },
    //  选择文件
    changeFile(e){
      let files = this.$refs.annexInput.files
      for(let i=0; i< files.length; i++){
        this.files.push(files[i])
        this.$refs.annexInput.value = ''
      }
    },
    //  删除正在上传的文件
    delFile(index){
      this.files.splice(index, 1)
    },
    //  上传附件
    annexSave(){
      if(!this.files.length){
        this.$message.error("请选择上传文件！")
        return
      }
      let params = new FormData()
      let content = ''
      this.files.map((item, index) => {
        params.append("file" + index, item)
        content += '【' + item.name + '】'
      })
      params.append("remark", this.annexRemarks)
      params.append("parentId", this.purchaseContract.id)
      params.append("moduleName", '分包合同')
      params.append("content", this.purchaseContract.contractName + '上传附件' + content)
      this.$post("/crm/upfile2", params, (data) => {
        this.$message.success("上传成功！")
        this.dialogAnnexVisible = false
        this.getAttachs()
      })
    },

    /**----------------------------------------------------操作日志-------------------------------------------- */
    getOperateLog(){
      this.$post("/crm/queryLog", {parentId : this.query.id}, (data) => {
        this.operateLog = data.list
      })
    },

    /**
     * 添加按钮
     */
    handleCommand(command){
        this[command] = true
    },
    /**
     * 勾选的数据
     */
    handleSelectionChange(val) {
      this.selectValue = val;
    },
  }
}
