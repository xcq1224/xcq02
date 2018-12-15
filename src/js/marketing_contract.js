import { mapState, mapActions, mapMutations } from 'vuex'
import {regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode} from 'element-china-area-data'

export default {
  data() {
    return {
    /*****************************************转给他人*****************************************/
      userName: '',       //  用户Id
      userCname: '',      //  用户名
      allStaff: [],   //  所有员工
      staff: '',      // 转给他人：员工

      query_show: false,          //  是否显示更多查询
    /*****************************************查询条件*****************************************/
      dsQuery: {
        contractName: '',                       // 合同名称
        contractState: '',                      // 合同状态
        cus_name: '',                           // 客户名称
        createTime: [],                         // 创建时间
        prop: 'createTime',
        order: -1
      },
      currentPage: 1,//默认开始页面
      pageSize: 2,//每页的数据条数
      count: 0,     //  总条数

      contrac_rules: {          // 规则
        customerId: [
          { required: true, message: '请选择客户', trigger: 'change' },
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
        dept: [
          { required: true, message: '请选择所属部门', trigger: 'change' },
        ],
        signatoryTime: [
          { required: true, message: '请选择签约日期', trigger: 'change' },
        ],
        financialManagerName: [
          { required: true, message: '请选择财务经理', trigger: 'change' },
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

    /*****************************************新增*************************************/
      tableData: [],
      activeName: 'first',
      contractAdd: {},              // 新增合同表单
      contractAddLabel:[],          // 新增合同label
      customers: [],                // 所有客户
      financialManagers: [],        // 所有财务经理
      opportunitys: [],             // 所有机会
      owners:[],                    // 所有拥有者
      selectValue: [],              //勾选的数据
      htzt: [],                     // 合同状态

      openTicketAdd: {},            // 开票信息表单
      openTicketAddLabel:[],        // 开票信息Lable
    
    /*************************导入******************************* */
      dialogImportVisible: false, 
      outputs: [],      //  导入的数据

      formTransfer: {},     //  转给他人表单
      dialogAddVisible: false,  // 新增
      dialogDelVisible: false,  // 删除
      dialogTransferVisible: false,  // 转给他人
    }
  },

  mounted () {
    //  获取数据字典
    let that = this
    let list = ["crm-htzt"]
    this.$post("/crm/getDict", {"list": list}, (data) => {
      this.htzt = data['crm-htzt']
    })
  },

  activated() {
    this.initTableData(1);
    this.getAllStaff()
  },

  methods: {

    //  清空查询
    clearQuery(){
      this.dsQuery = {            //  查询条件
        prop: 'createTime',
        order: -1
      }
      this.initTableData(1)
    },


  /**********************************************初始化表格数据**********************************************/
    initTableData(val){
      this.currentPage = val
      let params = this.deepClone(this.dsQuery)
      params.currentPage = val
      params.pageSize = this.pageSize
      this.$post("/crm/contractPR/queryContract", params, (data) => {
        this.tableData = data.list
        this.count = data.count
        this.userName = data.userName
        this.userCname = data.userCname
      })
    },
    sortChange(obj){
      this.dsQuery.prop = obj.prop || "createTime"
      this.dsQuery.order = obj.order == 'ascending' ? 1 : -1
      this.initTableData(1)
    },


  /**********************************************新增**********************************************/

     /**
     * 新增按钮
     */
    closeAdd(){
      this.$refs['contractAdd'].resetFields();
      this.$refs['openTicketAdd'].resetFields();
    },
    add_contract() {
      this.$post("/crm/extFieldPR/getField",{tableName: 'crm_marketing_contract'}, (data) => {
        this.contractAddLabel = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.contractAdd[item.name] = []
            }
          }
        })
        this.dialogAddVisible = true;
      })

      this.$post("/crm/extFieldPR/getField",{tableName: 'crm_open_ticket'}, (data) => {
        this.openTicketAddLabel = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.openTicketAdd[item.name] = []
            }
          }
        })
      })
    },

    // 获取所有客户
    getAllCustomer(){
      if(!this.customers.length){
        this.$post("/crm/queryAllCustomers", {}, (data) => {
          this.customers = data.customers
        })
      }
    },
    // 获取所有员工
    getAllStaff(){
      if(!this.allStaff.length){
        this.$post("/crm/getAllStaff", {}, (data) => {
          this.allStaff = data.list
        })
      }
    },

    //  打开新增模态框
    openModal(){
      this.contractAdd.ownerCname = this.userName + "/" + this.userCname
      // 获取所有客户
      this.getAllCustomer()
      // 获取所有员工
      this.getAllStaff()
      // 获取所有机会
      if (!this.opportunitys.length) {
        this.$post("/crm/opportunityPR/queryOpportunity", {prop: 'createTime', order: -1, currentPage: 1, pageSize: 999}, (data) => {
          this.opportunitys = data.list
        })
      }
      // 获取所有财务经理
      if (!this.financialManagers.length) {
        this.$post("/crm/getFinancialManager", {}, (data) => {
          this.financialManagers = data.financialManagers
        })
      }
    },

    /**
     * 保存数据合同信息和开票信息
     */
    contractSave() {
      this.$refs.contractAdd.validate((valid) => {
        if (valid) {
          let flag = false
          for(let item in this.openTicketAdd){
            if(this.openTicketAdd[item]) flag = true
          }
          if(flag){
            this.$refs.openTicketAdd.validate((valid) => {
              if (valid) {
                this.$post("/crm/contractPR/addContract", {contractAdd : this.contractAdd, openTicketAdd : this.openTicketAdd}, (data) => {
                  this.$notify.success({ message: '操作成功！'});
                  this.initTableData(1);
                  this.dialogAddVisible = false;
                })
              }
            })
          }else{
            this.$post("/crm/contractPR/addContract", {contractAdd : this.contractAdd, openTicketAdd : this.openTicketAdd}, (data) => {
              this.$notify.success({ message: '操作成功！'});
              this.initTableData(1);
              this.dialogAddVisible = false;
            })
          }
        }
      });
    },

  /**********************************************删除数据***************************************/
    /**
     * 删除机会
     */
    delete_contractAdd(){
      var select_value = this.selectValue;
      if (select_value.length < 1) {
        this.$notify.warning({ message: '请勾选数据！'});
        return;
      };

      this._confirm('确定删除吗?', () => {
        let list = []
        this.selectValue.map(item => {
          list.push(item.id)
        })
        this.$post('/crm/contractPR/deleteContract', {"list": list}, (data) => {
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

  /*--------------------------------------------转给他人功能--------------------------------------------*/
    // 打开转给他人弹框
    turnOther () {
      if (this.selectValue.length < 1) {
        this.$message.error('请勾选数据！');
        return;
      }

      //  如果没有获取所有员工请求员工数据
      if(!this.allStaff.length){
        this.$post("/crm/getAllStaff", {}, (data) => {
          this.allStaff = data.list
        })
      }
      this.dialogTransferVisible = true
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
      }
      this.$post("/crm/contractPR/turnOther", params, (data) => {
        this.dialogTransferVisible = false
        this.$message.success("转移成功！")
        this.initTableData(1)
        this.$refs.table.clearSelection()
      })
    },


    /**
     * 表格勾选
     */
    handleSelectionChange(val){
      this.selectValue = val;
    },

    /**
     * 提交审批操作
     */
    handleSubmit(){
        const h = this.$createElement;
        this.$msgbox({
            title: '提示',
            message: "确定提交审批吗？",
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then(action => {
            console.log(2)
        }).catch(()=>{});
    },
  /*******************************导入********************************* */
    importExcel(){
      this.$refs.uploadExcel.click()
    },
    //表格导入
    readExcel(e) {
      var that = this;
      const files = e.target.files;
      if(files.length<=0){//如果没有文件名
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        const data = ev.target.result;
        const workbook = XLSX.read(data, {
          type: 'binary'
        });
        const wsname = workbook.SheetNames[0];//取第一张表
        const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
        this.outputs = [];//清空接收数据
        let staffDict = {}
        this.allStaff.map(item => {
          staffDict[item.userName] = item.cname + '/' + item.userName
        })
        ws.map(item => {
          let ownerId = (item["拥有者"] || '').trim()
          let ownerCname = staffDict[ownerId] || ''
          let sheetData = {
            contractType: (item["合同类别"] || '').trim(),
            contractName: (item["合同名称"] || '').trim(),
            // implementDeptNo: (item["执行部门"] || '').trim(),
            implementDeptName: (item["执行部门"] || '').trim(),
            contracAmount: (item["合同金额(万元)"] || '') + '',
            startTime: (item["开始日期"] || '').trim(),
            endTime: (item["结束日期"] || '').trim(),
            signatoryTime: (item["签约日期"] || '').trim(),
            projectYear: (item["项目年份"] || '').trim(),
            ownerId: (item["合同负责人"] || '').trim(),
            // customerId: (item["客户名称"] || '').trim(),
            customerName: (item["客户名称"] || '').trim(),
            contractState: (item["合同状态"] || '').trim(),
            projectType: (item["项目类型"] || '').trim(),
            contractSource: (item["合同来源"] || '').trim(),
            financialManagerId: (item["财务经理"] || '').trim(),
            customerSignatory: (item["客户签约人"] || '').trim(),
            selfSignatoryId: (item["我方签约人"] || '').trim(),
          }
          this.outputs.push(sheetData);
        })
        console.log(this.outputs)
        this.$refs.uploadExcel.value = '';
        this.dialogImportVisible = true
      };
      fileReader.readAsBinaryString(files[0]);
    },
    //  保存导入的数据
    importSave(){
      if(this.$refs.importError){
        this.$message.error("红色部分有错误，请改正后再保存！")
        return
      }
      this.$post("/crm/customerPR/importCrmCustomers", {"customers" : this.outputs}, (data) => {
        if(data.message){
          this.$message.error(data.message)
        }else{
          this.$message.success("导入成功")
        }
      })
    },
  }
}
