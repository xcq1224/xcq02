import {mapState, mapActions, mapMutations} from 'vuex'
import dialogCheck from '../components/dialogCheck'

export default {
  data() {
    //  验证手机号
    var checkNo = function(rule, value, callback){
      let reg = /^[A-Za-z]*[0-9]*$/;
      if(reg.test(value)){
        callback()
      }else{
        callback(new Error('编码为字母或者数字!'))
      }
    };

    return {
      userName: '',   //  用户名
      userId: '',   //  用户Id
      classify: '',   //  分类
      dsQuery: {            //  查询条件
        classify: '',      //  分类
        prop: 'createTime',
        order: -1
      },
      query_show: false,          //  是否显示更多查询
      tableData: [],//客户表格数据展示
      tableData1: [],//客户表格数据展示
      count: '',      //  总数据条数
      currentPage: 1,//默认开始页面
      pageSize: 2,//每页的数据条数
      selectValue: [],//勾选的客户数据
      khlx: [],         //  客户类型
      gjzt: [],         //  跟进状态

    /***************************转给他人*********************************** */
      dialogTransferVisible: false,  // 转给其他人
      allStaff: [],   //  所有员工
      staff: '',      //转给他人：员工
      formTransfer: {
        checkbox1: false,   //  是否保留为团队成员
        checkbox2: false,   //  是否转移线索
        checkbox3: false,   //  是否转移合同
        checkbox4: false,   //  是否转移机会
      }, //  转给他人checkbox

    /******************************新增客户*********************************** */
      dialogAddVisible: false,  // 新增
      customerAdd: {area: [], ownerCname: ''},//新增客户
      customerAddLabel: [],//新增客户label
      customer_rules:{
        name: [
          { required: true, validator: this.isNull, trigger: 'blur' }
        ],
        no: [
          { required: true, validator: this.isNull, trigger: 'blur' },
          { required: true, validator: checkNo, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: this.isNull, trigger: 'blur' }
        ],
        ownerCname: [
          { required: true, validator: this.isNull, trigger: 'blur' }
        ]
      },//添加客户校验规则

    /*************************合并******************************* */
      dialogMergeVisible: false,  // 合并
      data_con:{},//合并存储对象的容器
      mergeClient1: {},//合并客户数据1
      mergeClient2: {},//合并客户数据2
      formMerge: {id: ''},
    /*************************导入******************************* */
      dialogImportVisible: false, 
      outputs: [],      //  导入的数据
    


      formCheck: {},    //  查看客户
      dialogCheckVisible: false,  // 查看公司信息
      dialogChangeVisible: false,  // 团员变更
      
    };
  },
  components: {
    dialogCheck,
  },

  mounted() {
    this.getDict()
    this.$store.state.showList = ["bench"]
  },
  activated() {
    /**
     * 页面加载前获取所有客户数据
     */
    this.getCustomers(1);
    this.getAllStaff()
  },


  methods: {
  /***************************公共**************************************** */
    //  清空查询
    clearQuery(){
      this.dsQuery = {            //  查询条件
        prop: 'createTime',
        order: -1
      }
      this.getCustomers(1)
    },
    //  获取客户列表
    getCustomers(val){
      // this.currentPage = val
      // let params = this.deepClone(this.dsQuery)
      // params.currentPage = val
      // params.pageSize = this.pageSize
      // this.$post("/crm/customerPR/queryCrmCustomer",params, (data) => {
      //   this.tableData = data.list;
      //   this.count = data.count;
      //   this.userName = data.userName
      //   this.userId = data.userId
      //   this.classify = this.dsQuery.classify
      // })
    },
    // 排序
    sortChange(obj){
      this.dsQuery.prop = obj.prop || "createTime"
      this.dsQuery.order = obj.order == 'ascending' ? 1 : -1
      this.getCustomers(1)
    },
    // 勾选的数据
    handleSelectionChange(val) {
      this.selectValue = val;
    },
    getAllStaff(){
      //  如果没有获取所有员工请求员工数据
      // if(!this.allStaff.length){
      //   this.$post("/crm/getAllStaff", {}, (data) => {
      //     this.allStaff = data.list
      //   })
      // }
    },
    //  获取数据字典
    getDict(){
      // let list = ["crm-khlx", "crm-kh-gjzt"]
      // this.$post("/crm/getDict", {"list": list}, (data) => {
      //   this.khlx = data['crm-khlx']
      //   this.gjzt = data['crm-kh-gjzt']
      // })
    },

  /*--------------------------------------------转给他人功能--------------------------------------------*/
    // 打开转给他人弹框
    turnOther(){
      if (this.selectValue.length < 1) {
        this.$message.error('请勾选数据！');
        return;
      }

      let ownerId = this.userId
      let flag = false
      this.selectValue.map(item => {
        if (ownerId != item.ownerId) {
          this.$message.error("只能将自己是拥有者的客户转给他人！")
          flag = true
        }
      })
      if(flag){
        return
      }

      this.dialogTransferVisible = true
    },
    //  打开转给他人模态框
    openTurnModal(){
      this.staff = ''
      this.formTransfer = {
        checkbox1: false,
        checkbox2: false,
        checkbox3: false,
        checkbox4: false,
      }
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
        ifLeft: this.formTransfer.checkbox1,
        turnClue: this.formTransfer.checkbox2,
        turnOpportunity: this.formTransfer.checkbox3,
        turnContract: this.formTransfer.checkbox4,
      }
      this.$post("/crm/customerPR/turnOther", params, (data) => {
        this.dialogTransferVisible = false
        this.$message.success("转移成功！")
        this.getCustomers(1)
        this.$refs.table.clearSelection()
      })
    },

  /**********************************************新增*************************************** */
    // 关闭新增
    closeAdd(){
      this.$refs['customerAdd'].resetFields();
    },
    checkPhone(rule, value, callback){
      //  手机号和电话验证    区号-电话号码 /电话号码/手机号
      let reg = /(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})/;
      if(reg.test(value)){
        callback()
      }else{
        callback(new Error('电话号码错误!'))
      }
    },
    addCrmCustomer() {
      this.customerAdd.ownerCname = this.userName + '/' + this.userId
      this.$post("/crm/extFieldPR/getField",{tableName: 'crm_customer'}, (data) => {
        this.customerAddLabel = data.list;
        this.dialogAddVisible = true;
      })
      this.getAllStaff()
    },

    // 新增客户数据保存确认按钮
    customerSava(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$post("/crm/customerPR/addCrmCustomer",this.customerAdd, (data) => {
            this.$message.success('操作成功！');
            this.getCustomers(1);
            this.dialogAddVisible = false;
          })
        }
      });
    },

    // 删除客户
    deleteCrmCustomer(){
      var select_value = this.selectValue;
      if (select_value.length < 1) {
        this.$notify.warning({ message: '请勾选数据！'});
        return;
      };

      let ownerId = this.userId
      let flag = false
      this.selectValue.map(item => {
        if (ownerId != item.ownerId) {
          this.$message.error("只能删除自己是拥有者的客户！")
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
        this.$post('/crm/customerPR/deleteCrmCustomer', {"list": list}, (data) => {
          if(data.message){
            this.$message.error(data.message)
          }else{
            this.$message.success("删除成功！")
          }
          this.$refs.table.clearSelection()
          this.getCustomers(1);
        })
      })
    },

  /*******************************合并客户********************************* */
    mergeClient() {
      if(this.selectValue.length == 2){
        this.mergeClient1 = this.selectValue[0]
        this.mergeClient2 = this.selectValue[1]

        if (this.mergeClient1.ownerId == this.mergeClient2.ownerId) {
          this.chooseMianMerge('mergeClient1', 'mergeClient2')
          this.dialogMergeVisible = true
        } else {
          this.$message.error('只能选择自己是拥有者的客户！');
        }
      }else{
        this.$alert('请选择2个客户', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });
      }
    },

    // 选择主记录
    chooseMianMerge(merge1,merge2){
      this.formMerge = this.deepClone(this[merge1]);
      this[merge1].area = this.formMerge.area
      this.data_con = this[merge2].id
    },
    // 合并客户
    mergeSubmit() {
      var param = new Object();
      param['data'] = JSON.stringify(this.formMerge);
      param['id'] = this.data_con;
      console.log(this.formMerge)
      this.$post("/crm/crmCustomerPR/mergeCustomer",param, (data) => {
        this.$message.success('操作成功！');
        this.dialogMergeVisible = false;
        this.getCustomers(1);
      })

    },

  /******************************查看客户****************************** */
    handleCheck(data) {
      console.log(data);
      this.formCheck = data
      this.dialogCheckVisible = true
    },
    closeCheckDialog() {
      // this.dialogCheckVisible = false;
      console.log(1);
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
        try {
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
                name: (item["客户名称"] || '').trim(),
                ownerCname: ownerCname,
                phone: (item["电话"] || '').trim(),
                mail: (item["邮箱"] || '').trim(),
                fax: (item["传真"] || '').trim(),
                area: item["国家"] && item["省"] && item["市"] ? [item["国家"],item["省"],item["市"]] : [],
                address: (item["公司地址"] || '').trim(),
                zipCode: (item["邮编"] || '').trim(),
                cusSource: (item["客户来源"] || '').trim(),
                cusType: (item["客户类型"] || '').trim(),
                industry: (item["所属行业"] || '').trim(),
                cusSize: (item["客户规模"] || '').trim(),
                // name: item["纳税识别号"],
                // name: item["开票地址"],
                // name: item["开票电话"],
                // name: item["开户银行"],
                // name: item["开户账号"],
                followStatus: (item["跟进状态"] || '').trim(),
              }
              this.outputs.push(sheetData);
            })
            console.log(this.outputs)
            this.$refs.uploadExcel.value = '';
            this.dialogImportVisible = true
        } catch (e) {
          return false;
        }
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
