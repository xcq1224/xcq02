import { mapState, mapActions, mapMutations } from 'vuex'
import {regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode} from 'element-china-area-data'

export default {
  data() {

    //  写跟进验证（当跟进方式为到访时拜访人员为必填）
    var checkContact = (rule, value, callback) => {
      if(this.follow_form.followType == '到访' & !value){
        callback(new Error('跟进方式为到访时请填写拜访人'));
      }else{
        callback()
      }
    };

    return {

      activeName: 'first',            //  tab页签
      tableData: [],                  //  表格
      formBasicInfo: {},              //  基本信息
      formAddReceipt: {},              //  新增收款表单
      formAddInvoicing: {},              //  新增开票记录表单
      formEdit: {},                   //  编辑合同表单
      formTransfer: {},               //  转给他人表单
      formDeploy: {},                 //  配置收款计划表单

      allStaff: [],   //  所有员工
      staff: '',      // 转给他人：员工
      operateLog: [],                       // 操作日志列表
      financialManagers: [],                // 所有财务经理

      /*******************************************基本信息*******************************************/
      contract: {},                         // 合同信息
      contractEdit: {},                     // 编辑合同信息
      isContractEdit: false,                // 合同是否编辑
      isOpenTicketEdit: false,              // 合同是否编辑
      contractFieldList: [],                // 合同字段集合

      openTicket: {},               // 开票信息
      openTicketEdit: {},           // 编辑开票信息
      openTicketFieldList: [],      // 开票信息字段集合

      contract_rules: {          // 规则
        customerName: [
          { required: true, message: '请选择客户', trigger: 'change' },
        ],
        contractNo: [
          { required: true, message: '请填写合同编号', trigger: 'blur' },
        ],
        contractName: [
          { required: true, message: '请填写合同名称', trigger: 'blur' },
        ],
        contracAmount: [
          { required: true, message: '请填写合同总金额', trigger: 'blur' },
        ],
        ownerCname: [
          { required: true, message: '请选择合同负责人', trigger: 'change' },
        ],
        signatoryTime: [
          { required: true, message: '请选择签约日期', trigger: 'change' },
        ],
      },

      ticket_rules: {          // 规则
        companyName: [
          { required: true, message: '请填写公司名称', trigger: 'blur' },
        ],
        taxNo: [
          { required: true, message: '请填写纳税识别号', trigger: 'blur' },
        ],
        companyAddress: [
          { required: true, message: '请填写地址', trigger: 'blur' },
        ],
        companyPhone: [
          { required: true, message: '请填写电话', trigger: 'blur' },
        ],
        openBank: [
          { required: true, message: '请填写开户银行', trigger: 'blur' },
        ],
        openAccount: [
          { required: true, message: '请填写开户账号', trigger: 'blur' },
        ],
      },

      /*******************************************弹框*******************************************/
      dialogReceiptVisible: false,    // 新增收款
      dialogInvoicingVisible: false,  // 新增开票记录
      dialogEditVisible: false,       // 编辑
      dialogTransferVisible: false,   // 转给他人
      dialogDeployVisible: false,     // 配置收款计划
      dialogAnnexVisible: false,      // 附件

      follows: [],                   //  跟进列表
      dialogFolowVisible: false,      // 跟进弹框

      /****************************************跟进*********************************************/
      follows: [],                   //  跟进列表
      dialogFolowVisible: false,     //  写跟进模态框
      folowForm: {},                 //  写跟进表单
      follow_type_list: [],          //  跟进方式
      follow_status_list: [],        //  跟进状态
      follow_yxfs_list: [],          //  营销阶段
      contact_list: [], //  当前客户所有联系人列表
      followRules: {
        followType: [
          { required: true, message: '请选择跟进方式', trigger: 'change' }
        ],
        followTime: [
          { type: 'date', required: true, message: '请选择跟进时间', trigger: 'change' }
        ],
        followContent: [
          { required: true, message: '请填写跟进内容', trigger: 'blur' }
        ],
        followStatus: [
          { required: true, message: '请选择跟进状态', trigger: 'change' }
        ],
        contact: [
          { validator: checkContact, trigger: 'change' }
        ]
      },
      //  写跟进验证规则
      follow_form: {
        moduleName: 'CRM-JH-GJZT',   //  跟进表名
        followType: '',
        followTime: '',
        followContent: '',
        followStatus: '',
        contact: '',                //  联系人(工号/姓名)
        copyToUser: '',             //  通知人(工号/姓名)
      },

      /***************************************收款信息***************************************/
      receiptPlan: [],                    // 收款计划信息
      receiptPlanList: [],                // 收款计划集合
      receiptObj: {receiptstate : '未完成'},
      tableData1_1: [],                   // 付款计划弹框列表
      selectValue: [],                    // 设置完成时，勾选的客户数据

      alreadyReceipt: 0,                  // 已收款金额
      unalreadyRecript: 0,                // 未收款金额
      receiptInfoList: [],                // 收款信息集合

      invoiceInfoList: [],                // 开票信息集合
      alreadyInvoiceAmount: 0,            // 已开票金额

      /****************************************附件列表*********************************************/
      annexList: [],                  // 附件列表
      annexRemarks: '',               // 备注
      files: [],                      // 上传文件列表

    }
  },

  mounted () {
    //  获取数据字典
    let that = this
    let list = ["CRM-HTZT"]
    this.$post("/crm/getDict", {"list": list}, (data) => {
      this.htzt = data['crm-htzt']
    })
  },

  activated() {
    //  当前页面的get参数
    this.query = this.$router.currentRoute.query;
    //  获取线索详情页面信息
    this.getContractDetail()
  },

  methods: {

    /***************************************基本信息****************************************/
    // 返回前一个页面
    goBack(){
      this.$router.go(-1)
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

    //  获取线索详情信息
    getContractDetail(){
      this.$post("/crm/contractDetailPR/queryContractForOne", {moduleName: 'CRM-JH-GJZT', id : this.query.id}, (data) => {
        this.contract = data.contract
        this.follows = data.follows
        this.isOwner = data.isOwner
        this.contractEdit = this.deepClone(data.contract)
      })
      this.$post("/crm/openTicketPR/queryOpenTicket", {id : this.query.id}, (data) => {
        this.openTicket = data.openTicket
        this.openTicketEdit = this.deepClone(data.openTicket)
      })
      this.getContractField()
      this.getOpenTicket()
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
      let list = [this.contract.id]
      let params = {
        list: list,
        ownerId: this.staff,
        ifLeft: this.formTransfer.checkbox1
      }
      this.$post("/crm/contractPR/turnOther", params, (data) => {
        this.dialogTransferVisible = false
        this.$message.success("转移成功！")
        this.$router.back(-1)
      })
    },

    /**********************************************编辑信息**********************************************/
    //  基本信息
    // 获取合同字段信息
    getContractField(){
      if(!this.contractFieldList.length){
        this.$post("/crm/extFieldPR/getField", {tableName: 'crm_marketing_contract'}, (data) => {
          this.contractFieldList = data.list
        })
      }
    },
    // 获取开票字段信息
    getOpenTicket(){
      if(!this.openTicketFieldList.length){
        this.$post("/crm/extFieldPR/getField", {tableName: 'crm_open_ticket'}, (data) => {
          this.openTicketFieldList = data.list
        })
      }
    },
    // 获取所有财务经理
    getFinancialManager(){
      if (!this.financialManagers.length) {
        this.$post("/crm/getFinancialManager", {}, (data) => {
          this.financialManagers = data.financialManagers
        })
      }
    },
    //  编辑合同
    editContract(){
      this.activeName = "first"
      this.isContractEdit = true
      this.getContractField()
      this.getAllStaff()
      this.getFinancialManager()
    },
    //  取消编辑
    cancelContractEdit(){
      this.isContractEdit = false
      this.contractEdit = this.deepClone(this.contract)
    },
    //  保存编辑
    contractSave(){
      this.$refs.contractEdit.validate((valid) => {
        if (valid) {
          if(this.contractEdit.ownerCname.indexOf("/") != -1){
            this.contractEdit.ownerId = this.contractEdit.ownerCname.split("/")[0]
            this.contractEdit.ownerCname = this.contractEdit.ownerCname.split("/")[1]
          }
          if(this.contractEdit.financialManagerName.indexOf("/") != -1){
            this.contractEdit.financialManagerId = this.contractEdit.financialManagerName.split("/")[0]
            this.contractEdit.financialManagerName = this.contractEdit.financialManagerName.split("/")[1]
          }
          this.$post("/crm/contractPR/updateContract", {contract : this.contractEdit}, (data) => {
            this.$message.success("修改成功！")
            this.isContractEdit = false
            this.contract = this.deepClone(this.contractEdit)
          })
        }
      })

    },

    //  编辑开票信息
    editOpenTicket(){
      this.activeName = "first"
      this.isOpenTicketEdit = true
      this.getOpenTicket()
    },
    //  取消编辑
    cancelOpenTicketEdit(){
      this.isOpenTicketEdit = false
      // this.$refs.openTicketEdit.resetFields()
      this.openTicketEdit = this.deepClone(this.openTicketEdit)
    },
    //  保存编辑
    openTicketSave(){
      this.$refs.openTicketEdit.validate((valid) => {
        if (valid) {
          this.$post("/crm/openTicketPR/updateOpenTicket", {id : this.query.id, openTicket : this.openTicketEdit}, (data) => {
            this.$message.success("修改成功！")
            this.isOpenTicketEdit = false
            this.openTicke = this.deepClone(this.openTicketEdit)
          })
        }
      })
    },

    /***************************************删除线索****************************************/
    //  删除线索
    delContract(){
      this._confirm('确定删除吗?', () => {
        this.$post('/crm/contractPR/deleteContract', {"list": [this.contract.id]}, (data) => {
          if (data.message) {
            this.$message.error(data.message)
          } else {
            this.$message.success("删除成功！")
            this.$router.back(-1)
          }
        })
      })
    },

    /***************************************写跟进****************************************/
    //  获取数据字典
    getDict(){
      if(this.follow_type_list.length) return
      this.$post("/crm/getDict", {list: ['CRM-GJFS', 'CRM-JH-GJZT']}, (data) => {
        this.follow_type_list = data['CRM-GJFS']
        this.follow_status_list = data['CRM-JH-GJZT']
      })
    },

    //  是否显示跟进日期
    showDate(index){
      if(index > 0){
        let date1 = this.formatDate(new Date(this.follows[index-1].followTime))
        let date2 = this.formatDate(new Date(this.follows[index].followTime))
        if(date1 == date2){
          return false
        }
      }
      return true
    },

    //  打开写跟进模态框
    openFollowModal(){
      this.follow_form.followTime = new Date()
      this.getAllStaff()
      this.getDict()
    },

    //  关闭写跟进模态框
    closeFollowModal(){
      this.$refs['follow_form'].resetFields();
    },
    //  写跟进提交
    followSave(){
      this.$refs.follow_form.validate((valid) => {
        if (!valid) return

        this.dialogFolowVisible = false
        let follow = this.follow_form
        follow.parentId = this.query.id
        if(follow.contact){
          follow.contactId = follow.contact.split("/")[0]
          follow.contactCname = follow.contact.split("/")[1]
        }
        if(follow.copyToUser){
          follow.copyToUserId = follow.copyToUser.split("/")[0]
          follow.copyToUserCname = follow.copyToUser.split("/")[1]
        }
        this.$post("/crm/followPR/addOne", {follow: follow}, (data) => {
          this.$message.success("添加成功")
          this.follows.unshift(data.follow)
          this.dialogFolowVisible = false
        })
      });
    },

    /***************************************收款计划***************************************/
    // 得到已收款金额

    getReceiptPlan(){
      this.$post("/crm/contractDetailPR/queryReceiptByContractId", {id : this.query.id, customerId : this.contract.customerId, tableName : "crm_receipt_plan"}, (data) => {
        this.receiptPlanList = data.list
        this.receiptPlan = data.receiptPlan
        if (this.receiptPlan.receiptList) {
          this.tableData1_1 = data.receiptPlan.receiptList

          this.alreadyReceipt = 0
          this.unalreadyRecript = 0
          // 得到已收款金额
          this.receiptPlan.receiptList.map(item => {
            if (item.receiptstate == "已完成") {
              this.alreadyReceipt += parseInt(item.planPaymentAmount)
            }
            if (item.receiptstate == "未完成") {
              this.unalreadyRecript += parseInt(item.planPaymentAmount)
            }
          })
        }
      })
    },

    /***************************************收款信息***************************************/
    // 得到收款信息
    getReceiptInfo(){
      this.$post("/crm/contractDetailPR/queryReceiptByContractId", {id : this.query.id, customerId : this.contract.customerId, tableName : "crm_receipt_info"}, (data) => {
        this.receiptInfoList = data.receipt_list
      })
    },

    /***************************************开票信息***************************************/
    // 得到开票信息
    getInvioceInfo(){
      this.$post("/crm/contractDetailPR/queryReceiptByContractId", {id : this.query.id, customerId : this.contract.customerId, tableName : "crm_invoice_info"}, (data) => {
        this.invoiceInfoList = data.receipt_list
        console.log(this.invoiceInfoList)
        if (this.invoiceInfoList) {
          this.alreadyInvoiceAmount = 0
          this.invoiceInfoList.map(item => {
            this.alreadyInvoiceAmount += parseInt(item.invoiceAmount)
          })
        }
      })
    },

    /***************************************附件***************************************/
    //  获取附件列表
    getAttachs(){
      this.$post("/crm/getAttachs", {parentId: this.contract.id}, (data) => {
        this.annexList = data.list
      })
    },

    //  删除附件
    delAnnex(id, fileName, index, rows){
      this._confirm('确定删除吗?', () => {
        this.$post("/crm/deleteFile", {ids : [id], moduleName : '营销合同', parentId : this.query.id, content : this.contract.contractName + '删除附件【' + fileName + '】'}, (data) => {
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
      params.append("parentId", this.contract.id)
      params.append("moduleName", '营销合同')
      params.append("content", this.contract.contractName + '上传附件' + content)
      this.$post("/crm/upfile2", params, (data) => {
        this.$message.success("上传成功！")
        this.dialogAnnexVisible = false
        this.getAttachs()
      })
    },

    /**
     * 添加按钮
     */
    handleCommand(command){
      this[command] = true
    },

    /*******************************配置收款计划********************************/
    // 关闭新增模态框时，清空数据
    closeReceipttPlan (){
      this.tableData1_1 = []
    },

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

      // 计划收款金额(已经存在计划列表中金额 + 将要添加的计划金额)
      let a = 0
      this.tableData1_1.map(item => {
        a += parseInt(item.planPaymentAmount)
      })
      a += parseInt(this.receiptObj.planPaymentAmount)
      // 收款总金额
      let b = parseInt(this.contract.contracAmount)
      // console.log(a)
      // console.log(b)
      if (!b || a > b) {
        this.$message.error("计划付款金额之和不能大于收款总金额")
        return
      }
      this.tableData1_1.push(this.receiptObj)
      this.receiptObj = {receiptstate : '未完成'}
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
    receiptSave(customerId, contractId) {
      this.$refs.formDeploy.validate((valid) => {
        if (valid) {
          this.$post("/crm/contractDetailPR/updateReceiptPlan", {id : contractId, customerId : customerId, receiptList : this.tableData1_1}, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.getReceiptPlan()
            this.dialogDeployVisible = false;
          })
        }
      });
    },

    /****************************************设置完成******************************************/
    // 打开管理收款计划弹框
    openReceiptPlan(){
      this.activeName = "second"
      this.getReceiptPlan()
      this.dialogDeployVisible = true
    },
    //  设置完成
    setupFinishSave(contractId){
      var select_value = this.selectValue;
      if (select_value.length < 1) {
        this.$notify.warning({ message: '请勾选数据！'});
        return;
      };

      this._confirm('确定设置完成吗?', () => {
        let list = []
        this.selectValue.map(item => {
          list.push(item.receiptId)
        })

        this.$post("/crm/contractDetailPR/setFinish", {id : contractId, receiptIds : list}, (data) => {
          this.$message.success("设置成功！")
          this.getReceiptPlan()
        })
      })
    },

    /**----------------------------------------------------操作日志-------------------------------------------- */
    getOperateLog(){
      this.$post("/crm/queryLog", {parentId : this.query.id}, (data) => {
        this.operateLog = data.list
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
