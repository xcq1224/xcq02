import { mapState, mapActions, mapMutations } from 'vuex'
import {regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  data() {
    return {

      tableData: [],                      //  表格数据
      selectValue:'',                     //勾选的数据
      dsQuery: {
        prop: 'turnTime',
        order: -1
      },
      currentPage: 1,//默认开始页面
      pageSize: 2,//每页的数据条数
      count: '',      //  总数据条数

      dialogTransferVisible: false,       //  转给他人
      allStaff: [],       //  所有员工
      staff: '',      //转给他人：员工
    }
  },

  activated () {
    this.getCustomers(1)
  },

  methods: {

    //  获取列表数据
    getCustomers(val){
      this.currentPage = val
      let params = this.deepClone(this.dsQuery)
      params.currentPage = val
      params.pageSize = this.pageSize
      this.$post("/crm/customerPR/querySeaCustomer",params, (data) => {
        this.tableData = data.list;
        this.count = data.count;
      })
    },
    //  排序
    sortChange(obj){
      this.dsQuery.prop = obj.prop || "createTime"
      this.dsQuery.order = obj.order == 'ascending' ? 1 : -1
      this.getCustomers(1)
    },

    //  删除按钮
    del() {
      var select_value = this.selectValue;
      if (select_value.length < 1) {
        this.$notify.warning({ message: '请勾选数据！'});
        return;
      };
      this._confirm('确定删除?(含有联系人、线索、机会、合同将无法删除)', () => {
        let list = []
        this.selectValue.map(item => {
          list.push(item.id)
        })
        this.$post('/crm/customerPR/deleteSeaCustomer', {"list": list}, (data) => {
          if(data.message){
            this.$message.error(data.message)
          }else{
            this.$message.success("删除成功！")
          }
          this.$refs.table.clearSelection()
          this.getCustomers(1);
        });
      });
    },

  /*--------------------------------------------转给他人功能--------------------------------------------*/
    // 打开转给他人弹框
    turnOther(){
      if (this.selectValue.length < 1) {
        this.$message.error('请勾选数据！');
        return;
      }
      //  如果没有获取所有员工请求员工数据
      this.getAllStaff()
      this.dialogTransferVisible = true
    },
    //  获取所有员工
    getAllStaff(){
      if(!this.allStaff.length){
        this.$post("/crm/getAllStaff", {}, (data) => {
          this.allStaff = data.list
        })
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
        ifLeft: false,
        turnClue : false,
        turnOpportunity : false,
        turnContract : false
      }
      this.$post("/crm/customerPR/turnOther", params, (data) => {
        this.dialogTransferVisible = false
        this.$message.success("转移成功！")
        this.$refs.table.clearSelection()
        this.getCustomers(1)
      })
    },

    //  勾选的数据
    handleSelectionChange(val) {
      this.selectValue = val;
    },
  }
}
