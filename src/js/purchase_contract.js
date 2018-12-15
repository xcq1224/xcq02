import { mapState, mapActions, mapMutations } from 'vuex'
import {regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode} from 'element-china-area-data'

export default {
  data() {
    return {
      /*************************************************基本设置*****************************************************/
      allStaff: [],                             //  所有员工
      staff: '',                                // 转给他人：员工
      userName: '',                             // 工号
      userCname: '',                            // 姓名
      selectValue: [],                          // 勾选的数据
      query_show: false,                        // 是否显示更多查询
      dsQuery: {
        contractName: '',                       // 合同名称
        contractState: '',                      // 合同状态
        purchaseProject: '',                    // 分包项目
        ownerCname: '',                         // 合同负责人(拥有者)
        sub_contract: '',                       // 分包商
        createTime: [],                         // 创建时间
        prop: 'createTime',
        order: -1
      },
      currentPage: 1,//默认开始页面
      pageSize: 2,//每页的数据条数
      count: 0,     //  总条数
      htzt: [],                                 // 合同状态


      tableData: [],
      multipleSelection: [],                    //  表格选中数据
      formAdd: {},                              //  新增机会表单
      formTransfer: {},                         //  转给他人表单
      formImport: {},                           //  导入表单
      dialogAddVisible: false,                  // 新增分包合同弹框
      dialogImportVisible: false,               // 导入
      dialogDelVisible: false,                  // 删除
      dialogTransferVisible: false,             // 转给他人

      /*************************************************新增分包合同*****************************************************/
      subContractors: [],                       // 所有分包商
      financialManagers: [],                    // 所有财务经理
      purchaseContractAdd: {},                  // 新增分包合同表单
      purchaseContractAddLable: {},             // 分包合同Lable
      purchase_contract_rules: {                // 新增分包合同规则
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
    // 加载页面时，加载所有数据
    this.initTableData(1);
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

    initTableData(val){
      this.currentPage = val
      let params = this.deepClone(this.dsQuery)
      params.currentPage = val
      params.pageSize = this.pageSize
      this.$post("/crm/purchaseContractPR/queryPurchaseContract", params, (data) => {
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
      this.$refs['purchaseContractAdd'].resetFields();
    },
    add_purchase_contract() {
      this.$post("/crm/extFieldPR/getField",{tableName: 'crm_purchase_contract'}, (data) => {
        this.purchaseContractAddLable = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.purchaseContractAdd[item.name] = []
            }
          }
        })
        this.dialogAddVisible = true;
      })
    },

    //  打开新增模态框
    openModal(){
      this.purchaseContractAdd.ownerCname = this.userName + "/" + this.userCname
      // 得到所有的分包商
      if(!this.subContractors.length){
        this.$post("/crm/subContractorPR/querySubContractor", {prop: 'createTime', order: -1, currentPage: 1, pageSize: 999}, (data) => {
          this.subContractors = data.list
        })
      }
      // 获取所有员工
      if(!this.allStaff.length){
        this.$post("/crm/getAllStaff", {}, (data) => {
          this.allStaff = data.list
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
     * 保存数据合同信息
     */
    purchaseContractSave() {
      this.$refs.purchaseContractAdd.validate((valid) => {
        if (valid) {
          let purchaseContractAdd = this.deepClone(this.purchaseContractAdd)
          purchaseContractAdd.ownerId = purchaseContractAdd.ownerCname.split("/")[0]
          purchaseContractAdd.ownerCname = purchaseContractAdd.ownerCname.split("/")[1]
          this.$post("/crm/purchaseContractPR/addPurchaseContract", {purchaseContractAdd : purchaseContractAdd}, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.initTableData(1);
            this.dialogAddVisible = false;
          })
        }
      });
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
      this.$post("/crm/purchaseContractPR/turnOther", params, (data) => {
        this.dialogTransferVisible = false
        this.$message.success("转移成功！")
        this.initTableData(1)
        this.$refs.table.clearSelection()
      })
    },

    /**********************************************删除数据***************************************/
    /**
     * 删除采购合同
     */
    delete_purchase_contract(){
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
        this.$post('/crm/purchaseContractPR/deletePurchaseContract', {"list": list}, (data) => {
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

    /**
     * 表格勾选
     */
    handleSelectionChange(val){
      this.selectValue = val;
    },
    /**
     * 删除操作
     */
    handleDel(){
        const h = this.$createElement;
        this.$msgbox({
            title: '提示',
            message: "确定要删除【xxxx】吗？",
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then(action => {
            console.log(2)
        }).catch(()=>{});
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
  }
}
