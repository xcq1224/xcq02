import { mapState, mapActions, mapMutations } from 'vuex'
import {regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode} from 'element-china-area-data'

export default {
  data() {
    return {
      /*****************************************转给他人*****************************************/
      userName: '',       //  用户Id
      userCname: '',      //  用户名
      allStaff: [],       //  所有员工
      staff: '',          // 转给他人：员工

      /*****************************************基本数据设置*****************************************/
      query_show: false,          //  是否显示更多查询

      tableData: [],                // 营销机会表格数据
      opportunityAdd: {dealPossible: ''},           // 新增机会表单
      opportunityAddLabel:[],       // 新增机会label
      customers: [],                // 所有客户
      owners:[],                    // 所有拥有者
      selectValue: [],              //勾选的数据
      opportunity_rules: {          // 规则
        customerId: [
          { required: true, message: '请选择客户', trigger: 'change' },
        ],
        opportunityName: [
          { required: true, message: '请填写机会名称', trigger: 'blur' },
        ],
        amount: [
          { required: true, message: '请填写预计营销额', trigger: 'blur' },
        ],
        ownerCname: [
          { required: true, message: '请选择拥有者', trigger: 'change' },
        ],
      },

      /*****************************************数据字典下拉框*****************************************/
      gjzt: [],         // 跟进状态
      jhly: [],         // 机会来源
      jhlx: [],         // 机会类型
      yxjd: [],         // 营销阶段

      /*****************************************查询条件*****************************************/
      // 查询条件
      dsQuery: {
        opportunityName: '',      // 机会名称
        owner: '',                // 拥有者
        cus_name: '',             // 客户名称
        state: '',                // 跟进状态
        phone: '',                // 手机号
        recent_follow_time: [],   // 最近跟进时间
        classify: '',            // 分类
        stage: '',                // 机会阶段
        type: '',                  // 机会类型
        prop: 'createTime',
        order: -1
      },
      currentPage: 1,//默认开始页面
      pageSize: 2,//每页的数据条数
      count: 0,     //  总条数

      options: regionData,          //  省市区配置

      partner: [],                    // 所有合作伙伴
      competitor: [],                 // 所有竞争对手

      /*****************************************弹框*****************************************/
      dialogAddVisible: false,        // 新增
      dialogImportVisible: false,     // 导入
      dialogDelVisible: false,        // 删除
      dialogTransferVisible: false,   // 转给他人

      /*****************************************转化为合同*****************************************/
      dialogContractVisible: false,               // 转化为合同弹框
      opportunity: {},                            // 机会信息
      marketingClues: [],                         // 线索集合
      formContract: {},                           //  转化为合同表单
      htzt: [],                                   // 合同状态
      form_contract_rules: {                            // 转化为合同规则
        customerId: [
          { required: true, message: '请选择客户名称', trigger: 'change' },
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
    }
  },

  mounted () {
    //  获取数据字典
    let that = this
    let list = ["crm-jh-gjzt", "crm-jhly", "crm-jhlx", "crm-yxjd", "crm-htzt"]
    this.$post("/crm/getDict", {"list": list}, (data) => {
      this.gjzt = data['crm-jh-gjzt']
      this.jhly = data['crm-jhly']
      this.jhlx = data['crm-jhlx']
      this.yxjd = data['crm-yxjd']
      this.htzt = data['crm-htzt']
    })
  },

  activated() {

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

    /**********************************************初始化表格数据**********************************************/
    initTableData(val){
      this.currentPage = val
      let params = this.deepClone(this.dsQuery)
      params.currentPage = val
      params.pageSize = this.pageSize
      this.$post("/crm/opportunityPR/queryOpportunity", params, (data) => {
        this.tableData = data.list
        this.count = data.count
        this.userName = data.userName
        this.userCname =data.userCname
      })
    },
    sortChange(obj){
      this.dsQuery.prop = obj.prop || "createTime"
      this.dsQuery.order = obj.order == 'ascending' ? 1 : -1
      this.initTableData(1)
    },

    /**********************************************新增**********************************************/
    changeStage(name){
      if(name == 'marketingSection'){
        this.$post("/crm/marketingClueDetailPR/changeStage", {marketingSection : this.opportunityAdd.marketingSection}, (data) => {
          console.log(data.dealPossible)
          this.opportunityAdd.dealPossible = data.dealPossible
        })
      }
    },
     /**
     * 新增按钮
     */
    closeAdd(){
      this.$refs['opportunityAdd'].resetFields();
    },
    add_opportunity() {
      this.$post("/crm/extFieldPR/getField",{tableName: 'crm_marketing_opportunity'}, (data) => {
        this.opportunityAddLabel = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.opportunityAdd[item.name] = []
            }
          }
        })
        this.dialogAddVisible = true;
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
    // 根据客户Id获取对应客户下的线索
    changeCustomer(val){
      console.log(val)
      this.$post("/crm/opportunityPR/getMarketingClueByCustomerId", {id : val}, (data) => {
        this.marketingClues = data.list
      })
    },
    // 获取所有线索
    // getAllMarketingClue(){
    //   if (!this.marketingClues.length) {
    //     this.$post("/crm/marketingCluePR/queryMarketingClue", {prop: 'createTime', order: -1, currentPage: 1, pageSize: 999}, (data) => {
    //       this.marketingClues = data.list
    //     })
    //   }
    // },
    // 获取所有合作伙伴
    getAllPartner(){
      if (!this.partner.length) {
        this.$post("/crm/queryAllPartner", {}, (data) => {
          this.partner = data.partner
        })
      }
    },
    // 获取所有竞争对手
    getAllCompetitor(){
      if (!this.competitor.length) {
        this.$post("/crm/queryAllCompetitor", {}, (data) => {
          this.competitor = data.competitor
        })
      }
    },

    //  打开新增模态框
    openModal(){
      this.opportunityAdd.ownerCname = this.userName + "/" + this.userCname
      // 获取所有客户
      this.getAllCustomer()
      // 获取所有员工
      this.getAllStaff()
      // 获取所有线索
      // this.getAllMarketingClue()
      // 获取所有合作伙伴
      this.getAllPartner()
      // 获取所有竞争对手
      this.getAllCompetitor()
    },

    /**
     * 保存数据
     */
    opportunitySave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$post("/crm/opportunityPR/addOpportunity", this.opportunityAdd, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.initTableData(1);
            this.dialogAddVisible = false;
          })
        }
      });
    },

    /**********************************************删除数据***************************************/
    /**
     * 删除机会
     */
    delete_opportunity(){
      var select_value = this.selectValue;
      if (select_value.length < 1) {
        this.$notify.warning({ message: '请勾选数据！'});
        return;
      };

      let ownerId = this.userName
      let flag = false
      this.selectValue.map(item => {
        if (ownerId != item.ownerId) {
          this.$message.error("只能删除自己是拥有者的机会！")
          flag = true
        }
      })
      if(flag){
        return
      }

      this._confirm('确定删除吗?', () => {
        let list = []
        this.selectValue.map(item => {
          list.push(item.id)
        })
        this.$post('/crm/opportunityPR/deleteOpportunity', {"list": list}, (data) => {
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
    /*--------------------------------------------转化为合同--------------------------------------------*/
    // 关闭模态框时，清空数据
    closeModel(){
      this.$refs['formContract'].resetFields();
    },

    // 打开转化为合同模态框
    openFormContract(){
      this.formContract.ownerCname = this.userName + "/" + this.userCname
      // 获取所有的客户
      this.getAllCustomer()
      // 获取所有的员工
      this.getAllStaff()
    },

    form_contract(){
      if (this.selectValue.length != 1) {
        this.$message.error('请勾选一条数据！');
        return;
      }

      if (this.userName != this.selectValue[0].ownerId) {
        this.$message.error('只能转化自己是拥有者的机会！');
        return;
      }

      // 得到当前勾选的线索Id
      let id = this.selectValue[0].id
      // 得到勾选的线索详细信息
      this.$post("/crm/opportunityDetailPR/queryOpportunityForOne", {id : id}, (data) => {
        this.opportunity = data.opportunity
      })
      this.dialogContractVisible = true
    },

    // 转化为合同确定按钮
    form_contract_save(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formContract.opportunityName = this.opportunity.opportunityName
          this.formContract.customerId = this.opportunity.customerId
          this.$post("/crm/opportunityDetailPR/formContract", {id : this.selectValue[0].id, formContract : this.formContract}, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.dialogContractVisible = false;
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

      let ownerId = this.userName
      let flag = false
      this.selectValue.map(item => {
        if (ownerId != item.ownerId) {
          this.$message.error("只能将自己是拥有者的机会转给他人！")
          flag = true
        }
      })
      if(flag){
        return
      }

      //  如果没有获取所有员工请求员工数据
      this.getAllStaff()
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
      this.$post("/crm/opportunityPR/turnOther", params, (data) => {
        this.dialogTransferVisible = false
        this.$message.success("转移成功！")
        this.initTableData(1)
        this.$refs.table.clearSelection()
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
