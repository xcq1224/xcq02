import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {

      currentPage: 1,//默认开始页面
      pagesize: 50,//每页的数据条数

      tableData: [],//table数据
      dialogVisible: false,//弹框是否显示
      savaflag :'',//操作标识符
      
      crmMarketingClueFieldAdd: {
        'id': '',
        'fieldNo': '',
        'fieldName': '',
        'isShow': '',
        'fieldType': '',
        'dictName': '',
        'cosSpan': '',
        'sortNum':'',
      },    //  添加对象
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

      },

    }
  },


  activated() {

    this.initTableData();

  },

  methods: {

    /**
     * 初始化表格数据
     */
    initTableData (){
      this.$post("/crm/marketingClueFieldPR/queryCrmMarketingClueField", {}, (data) => {
        this.tableData = data.list
      })
    },

    /**
     * 分页
     */
    handleCurrentChange(val){
      this.currentPage = val;
    },

    /**
       * 关闭弹框清空表单
       */
      dlgClose(formName){
        this.$refs[formName].resetFields();
      },

    /**
     * 新增按钮
     */
    addField() {
      // Object.assign(this.fieldAdd, this.$options.data().fieldAdd);
      this.savaflag = 'add';
      this.dialogVisible = true;
      // var url = this.$store.state.crmPath+'/crm/crmMarketingClueFieldPR/getDefaultFieldNo';
      this.$post("/crm/marketingClueFieldPR/getDefaultFieldNo", {}, (data) => {   
          this.crmMarketingClueFieldAdd.fieldNo = data.field_no;
          this.crmMarketingClueFieldAdd.sortNum = data.sortNo;
      })
    },


    /**
     * 修改按钮
     */
    updateField() {
      var select_value = this.selectValue;
      //只能勾选一条数据
      if (select_value.length !=1) {
        this.$notify({ message: '请勾选一条数据！', position: 'bottom-right'});
        return;
      };

      //取勾选的数据
      this.crmMarketingClueFieldAdd = this.selectValue[0];
      //设置保存时标识符
      this.savaflag = 'edit';
      //显示弹框
      this.dialogVisible = true;
    },

    /**
     * 删除按钮
     */
    deleteField() {

        var select_value = this.selectValue;
        if (select_value.length < 1) {
            this.$notify({ message: '请勾选数据！', position: 'bottom-right'});
            return;
        };

        let list = []
        this.selectValue.map(item => {
            list.push(item.id)
        })
        // var url = this.$store.state.crmPath+'/crm/crmMarketingClueFieldPR/deleteCrmMarketingClueField';
        this.$post("/crm/marketingClueFieldPR/deleteCrmMarketingClueField", {"list": list}, (data) => {
            this.initTableData();
            this.$notify({ message: '操作成功！', position: 'bottom-right'});
        })

    },

    /**
     * 保存数据
     */
    crmMarketingClueFieldSave() {
      var url = '';

      if ('add'== this.savaflag) {
        url = "/crm/marketingClueFieldPR/addCrmMarketingClueField";
      }

      if ('edit'== this.savaflag) {
        url = "/crm/marketingClueFieldPR/updateCrmMarketingClueField";
      }

      console.log(url);

      this.$post(url, this.crmMarketingClueFieldAdd, (data) => {
          this.$notify({ message: '操作成功！', position: 'bottom-right'});
          this.initTableData();
          this.dialogVisible = false;
      })
    },

    /**
     * 勾选的数据
     */
    handleSelectionChange(val) {
      this.selectValue = val;
    }



  }
}
