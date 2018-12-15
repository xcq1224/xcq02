import { mapState, mapActions, mapMutations } from 'vuex'
import {regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode} from 'element-china-area-data'

export default {
  data() {
    return {
      /*****************************************转给他人*****************************************/
      userName: '',   //  用户Id
      userCname: '',     //  用户名
      allStaff: [],   //  所有员工
      staff: '',      //转给他人：员工

      /*****************************************基本数据设置*****************************************/
      query_show: false,          //  是否显示更多查询

      marketingClueAdd:{ownerCname: ''},//新增线索
      marketingClueAddLabel:[],//新增线索label
      tableData: [],//营销线索表格数据
      selectValue: [],//勾选的客户数据
      customers: [],    //  所有客户
      customer: '',     //  客户（客户id + 客户姓名）
      marketing_clue_rules: {                     // 新增线索规则
        name: [
          { required: true, message: '请填写线索名称', trigger: 'blur' },
        ],
        customerId: [
          { required: true, message: '请选择客户名称', trigger: 'change' },
        ],
        dept: [
          { required: true, message: '请选择部门', trigger: 'change' },
        ],
        ownerCname: [
          { required: true, message: '请选择拥有者', trigger: 'change' },
        ],
      }, //  新增联系人验证规则

      savaflag:'',//保存标识符

      /*****************************************数据字典下拉框*****************************************/
      xsly: [],         // 线索来源
      gjzt: [],         // 跟进状态
      jhly: [],         // 机会来源
      jhlx: [],         // 机会类型
      yxjd: [],         // 营销阶段

      /*****************************************查询条件*****************************************/
      dsQuery: {//查询条件
        name: '',                   //  线索名称
        type: '',                   //  线索来源
        cus_name: '',               //  客户名称
        state:'',                   //  跟进状态
        marketingClueState:'',      //  线索状态
        classify: '',              //  分类
        recent_follow_time: [],     //  最近跟进时间
        prop: 'createTime',
        order: -1
      },
      currentPage: 1,//默认开始页面
      pageSize: 2,//每页的数据条数
      count: 0,     //  总条数

      options: regionData,    //  省市区配置

      /*****************************************弹框*****************************************/
      dialogAddVisible:false,//新增弹框
      dialogTransferVisible: false,  // 转给其他人

      /****************************************转化为机会*************************************************/
      marketingClue: {},                  // 线索信息
      partnerId: '',                      // 合作伙伴Id
      partnerName: '',                    // 合作伙伴名称
      dialogContractVisible: false,       // 转化为机会
      formOpportunity: {dealPossible: ''},                //  转化为机会表单
      customers: [],                      // 所有客户
      partner: [],                        // 合作伙伴
      yxjd: [],                           // 营销阶段
      gjzt: [],                           // 跟进状态
      jhly: [],                           // 机会来源
      jhlx: [],                           // 机会类型
      partner: [],                        // 合作伙伴
      competitor: [],                     // 竞争对手
      form_opportunity_rules: {           // 转化为机会规则
        opportunityName: [
          { required: true, message: '请填写机会名称', trigger: 'blur' },
        ],
        customerId: [
          { required: true, message: '请选择客户', trigger: 'change' },
        ],
        amount: [
          { required: true, message: '请填写预计营销额', trigger: 'blur' },
        ],
        ownerCname: [
          { required: true, message: '请选择拥有者', trigger: 'change' },
        ],
      },
    }
  },

  mounted () {
    //  获取数据字典
    let that = this
    let list = ["crm-xsly", "crm-xs-gjzt", "crm-jhly", "crm-jhlx", "crm-yxjd"]
    this.$post("/crm/getDict", {"list": list}, (data) => {
      this.xsly = data['crm-xsly']
      this.gjzt = data['crm-xs-gjzt']
      this.jhly = data['crm-jhly']
      this.jhlx = data['crm-jhlx']
      this.yxjd = data['crm-yxjd']
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

    /**
     * 初始化表格数据
     */
    initTableData(val){
      this.currentPage = val
      let params = this.deepClone(this.dsQuery)
      params.currentPage = val
      params.pageSize = this.pageSize
      this.$post("/crm/marketingCluePR/queryMarketingClue", params, (data) => {
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


    /**
     * 分页
     */
    handleCurrentChange(val){
      this.currentPage = val;
    },

    /**********************************************新增线索***************************************************/
    /**
     * 新增按钮
     */
    closeAdd(){
      this.$refs['marketingClueAdd'].resetFields();
    },
    add_marketing_clue() {
      this.marketingClueAdd.ownerCname = this.userName + "/" + this.userCname
      this.$post("/crm/extFieldPR/getField",{tableName: 'crm_marketing_clue'}, (data) => {
        this.marketingClueAddLabel = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            if (item.fieldType == 'cascade' & !item.value){
              this.marketingClueAdd[item.name] = []
            }
          }})
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
      // 获取所有的合作伙伴
      if (!this.partner.length) {
        this.$post("/crm/queryAllPartner", {}, (data) => {
          this.partner = data.partner
        })
      }
      this.getAllStaff()
    },


    /**
     * 保存数据
     */
    marketingClueSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$post("/crm/marketingCluePR/addMarketingClue", this.marketingClueAdd, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.initTableData(1);
            this.dialogAddVisible = false;
          })
        }
      });
    },

    /**********************************************删除线索***************************************************/
    /**
     * 删除线索
     */
    delete_marketing_clue(){
      var select_value = this.selectValue;

      if (select_value.length < 1) {
        this.$notify.warning({ message: '请勾选数据！'});
        return;
      };

      let ownerId = this.userName
      let flag = false
      this.selectValue.map(item => {
        if (ownerId != item.ownerId) {
          this.$message.error("只能删除自己是拥有者的线索！")
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
        this.$post('/crm/marketingCluePR/deleteMarketingClue', {"list": list}, (data) => {
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

    /**********************************************转化为机会***************************************************/
    changeStage(value){
      this.$post("/crm/marketingClueDetailPR/changeStage", {marketingSection : value}, (data) => {
        console.log(data.dealPossible)
        this.formOpportunity.dealPossible = data.dealPossible
      })
    },

    // 关闭模态框时，清空数据
    closeModel(){
      this.$refs['formOpportunity'].resetFields();
    },

    // 打开转化为机会模态框
    form_opportunity(){
      if (this.selectValue.length != 1) {
        this.$message.error('请勾选一条数据！');
        return;
      }

      if (this.userName != this.selectValue[0].ownerId) {
        this.$message.error('只能转化自己是拥有者的线索！');
        return;
      }

      // 得到当前勾选的线索Id
      let id = this.selectValue[0].id
      // 得到勾选的线索详细信息
      this.$post("/crm/marketingClueDetailPR/queryMarketingClueForOne", {id : id}, (data) => {
        this.marketingClue = data.marketingClue
        this.partnerId = data.partnerId
        this.partnerName = data.partnerName
        this.dialogContractVisible = true
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

    //  打开转化机会模态框时，加载对应数据
    open_form_opportunity(){
      this.formOpportunity.partnerId = this.partnerId
      this.formOpportunity.ownerCname = this.userName + "/" + this.userCname
      // 获取所有客户
      if(!this.customers.length){
        this.$post("/crm/queryAllCustomers", {}, (data) => {
          this.customers = data.customers
        })
      }
      // 获取所有的合作伙伴
      if (!this.partner.length) {
        this.$post("/crm/queryAllPartner", {}, (data) => {
          this.partner = data.partner
        })
      }
      // 获取所有的竞争对手
      if (!this.competitor.length) {
        this.$post("/crm/queryAllCompetitor", {}, (data) => {
          this.competitor = data.competitor
        })
      }
      // 获取所有员工
      this.getAllStaff()
    },

    // 转化为机会确定按钮
    form_opportunity_save(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formOpportunity.marketingClueName = this.marketingClue.name
          this.formOpportunity.customerId = this.marketingClue.customerId
          this.$post("/crm/marketingClueDetailPR/formOpportunity", {id : this.selectValue[0].id, formOpportunity : this.formOpportunity}, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.initTableData(1)
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
          this.$message.error("只能将自己是拥有者的线索转给他人！")
          flag = true
        }
      })
      if(flag){
        return
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
      this.$post("/crm/marketingCluePR/turnOther", params, (data) => {
        this.dialogTransferVisible = false
        this.$message.success("转移成功！")
        this.initTableData(1)
        this.$refs.table.clearSelection()
      })
    },

    /**
     * 搜索查询
     */
    submit(){
      console.log(this.formQuery);
    },


    /**
     * 勾选的数据
     */
    handleSelectionChange(val) {
      this.selectValue = val;
    },
  }
}
