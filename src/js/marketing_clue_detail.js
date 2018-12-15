import { mapState, mapActions, mapMutations } from 'vuex'
import {regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
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
          query: {},                      //  页面传参
          activeName: 'first',            //  tab页签
          formBasicInfo: {},              //  基本信息
          formAdd: {},                    //  添加联系人表单
          formEdit: {},                   //  编辑机会表单
          formLost: {},                   //  丢单表单
          formTransfer: {},               //  转给他人表单
          dialogAddVisible: false,        // 添加联系人
          dialogEditVisible: false,       // 编辑
          dialogDelVisible: false,        // 删除
          dialogContractVisible: false,   // 转化为机会
          dialogLostVisible: false,       // 丢单
          operateLog :[],                 // 操作日志

          /****************************************基本信息*********************************************/
          options: regionData,            //  地区总数据
          isEdit: false,                  // 是否编辑
          opportunityList: [],            // 机会集合
          marketingClueEdit: {},          // 编辑机会
          marketingClue: {},              // 线索信息

          marketingClueFieldList: [],     // 线索字段集合
          marketing_clue_rules: {},       // 线索字段校验

          /****************************************附件列表*********************************************/
          dialogAnnexVisible: false,      // 上传附件弹框
          annexList: [],                  // 附件列表
          annexRemarks: '',               // 备注
          files: [],                      // 上传文件列表

          /****************************************转给他人*********************************************/
          dialogTransferVisible: false,  // 转给其他人
          staff: '',                     // 转给他人：员工
          allStaff: [],                  // 所有员工列表

          /****************************************跟进*********************************************/
          follows: [],                   //  跟进列表
          dialogFolowVisible: false,     //  写跟进模态框
          folowForm: {},                 //  写跟进表单
          follow_type_list: [],          //  跟进方式
          follow_status_list: [],        //  跟进状态
          contact_list: [], //  当前客户所有联系人列表
          followRules: {
            followType: [
              { required: true, message: '请选择跟进方式', trigger: 'change' }
            ],
            followTime: [
              { required: true, message: '请选择跟进时间', trigger: 'change' }
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
          follow_form: { followTime: '' },
          contacts_list: [],             // 拜访人员（客户的联系人集合）

          /****************************************转化为机会*************************************************/
          userName: '',                       //  用户Id
          userCname: '',                      //  用户名
          partnerId: '',                      // 合作伙伴Id
          formOpportunity: {dealPossible: ''},                //  转化为机会表单
          customers: [],                      // 所有客户
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
          /**-------------------------------设置团队成员权限--------------------------- */
          dialogSettingsVisible: false,                         //  权限设置模态框
          addMemberInput: '',                                   //  新增团队成员
          memberList: [],                                       //   团队成员
          isModify: false,                                      //    是否可以修改
          isDownload: false,                                    //    是否有下载权限
          isOwner: false,                                       //    是否是拥有者

          /**-------------------------------关闭线索按钮--------------------------- */
          dialogClose: false,                                   // 关闭线索模态框
          closeMarketingClue: {},                               // 关闭线索表单
          close_rules: {
            closeReason: [
              { required: true, message: '请填写关闭原因', trigger: 'blur' },
            ],
          },
      }
  },

  mounted () {
    //  获取数据字典
    let that = this
    let list = ["crm-kh-gjzt", "crm-jhly", "crm-jhlx", "crm-yxjd"]
    this.$post("/crm/getDict", {"list": list}, (data) => {
      this.gjzt = data['crm-kh-gjzt']
      this.jhly = data['crm-jhly']
      this.jhlx = data['crm-jhlx']
      this.yxjd = data['crm-yxjd']
    })
  },

  activated(){
    //  当前页面的get参数
    this.query = this.$router.currentRoute.query;
    //  获取线索详情页面信息
    this.getMarketingClueDetail()
  },
  methods: {

    // 返回前一个页面
    goBack(){
      this.$router.go(-1)
    },

    /***************************************基本信息**************************************/
    //  获取线索详情信息
    getMarketingClueDetail(){
      this.$post("/crm/marketingClueDetailPR/queryMarketingClueForOne", {moduleName: 'crm_marketing_clue', id: this.query.id}, (data) => {
        this.marketingClue = data.marketingClue
        this.follows = data.follows
        this.isOwner = data.isOwner
        this.isModify = data.isModify
        this.isDownload = data.isDownload
        this.userName = data.userName
        this.userCname = data.userCname
        this.partnerId = data.partnerId
        this.marketingClueEdit = this.deepClone(data.marketingClue)
        console.log(data)
      })
      this.$post("/crm/extFieldPR/getField", {tableName: 'crm_marketing_clue'}, (data) => {
        this.marketingClueFieldList = data.list
      })
    },

    /***************************************查看转化的机会****************************************/
    form_opportunity(){
      this.$post("/crm/marketingClueDetailPR/opportunityByMarketingClueId", {id : this.query.id}, (data) => {
        this.opportunityList = data.list
      })
    },

    /***************************************转化为机会****************************************/
    changeStage(value){
      this.$post("/crm/marketingClueDetailPR/changeStage", {marketingSection : value}, (data) => {
        console.log(data.dealPossible)
        this.formOpportunity.dealPossible = data.dealPossible
      })
    },
    // 获取所有的合作伙伴
    getAllPartner(){
      if (!this.partner.length) {
        this.$post("/crm/queryAllPartner", {}, (data) => {
          this.partner = data.partner
        })
      }
    },
    // 获取所有的竞争对手
    getAllCompetitor(){
      if (!this.competitor.length) {
        this.$post("/crm/queryAllCompetitor", {}, (data) => {
          this.competitor = data.competitor
        })
      }
    },

    // 获取所有客户
    getAllCustomer(){
      if(!this.customers.length){
        this.$post("/crm/queryAllCustomers", {}, (data) => {
          this.customers = data.customers
        })
      }
    },

    //  打开转化机会模态框
    openModal(){
      this.formOpportunity.partnerId = this.partnerId
      this.formOpportunity.ownerCname = this.userName + "/" + this.userCname
      // 获取所有客户
      this.getAllCustomer()
      // 获取所有的合作伙伴
      this.getAllPartner()
      // 获取所有的竞争对手
      this.getAllCompetitor()
      // 获取所有员工
      this.getAllStaff()
    },

    closeModel(){
      this.$refs['formOpportunity'].resetFields();
    },

    // 转化为机会确定按钮
    form_opportunity_save(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formOpportunity.marketingClueName = this.marketingClue.name
          this.formOpportunity.customerId = this.marketingClue.customerId
          this.$post("/crm/marketingClueDetailPR/formOpportunity", {id : this.query.id, formOpportunity : this.formOpportunity}, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.dialogContractVisible = false;
          })
        }
      });
    },

    /***************************************转给他人****************************************/
    // 打开转给他人弹框
    turnOther(){
      this.getAllStaff()
      this.dialogTransferVisible = true
    },

    //  加载所有员工
    getAllStaff() {
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
      let list = [this.marketingClue.id]
      let params = {
        list: list,
        ownerId: this.staff,
        ifLeft: this.formTransfer.checkbox1
      }
      this.$post("/crm/marketingCluePR/turnOther", params, (data) => {
        this.dialogTransferVisible = false
        this.$message.success("转移成功！")
        this.$router.back(-1)
      })
    },

    /***************************************编辑线索****************************************/
    // 编辑线索，弹出模态框
    edit_marketing_clue() {
      this.isEdit = true
      this.$post("/crm/extFieldPR/getField",{tableName: 'crm_marketing_clue'}, (data) => {
        this.marketingClueFieldList = data.list;
      })
      this.getAllPartner()
      this.getAllStaff()
    },

    //  保存编辑
    marketingClueSave(){
      if(this.marketingClueEdit.partnerName && this.marketingClueEdit.partnerName.indexOf("/") != -1){
        this.marketingClueEdit.partnerId = this.marketingClueEdit.partnerName.split("/")[1]
        this.marketingClueEdit.partnerName = this.marketingClueEdit.partnerName.split("/")[0]
      }
      this.$post("/crm/marketingCluePR/updateMarketingClue", this.marketingClueEdit, (data) => {
        this.$message.success("修改成功！")
        this.isEdit = false
        this.marketingClue = this.deepClone(this.marketingClueEdit)
      })
      this.dialogEditVisible = false;
    },

    //  取消编辑
    cancelEdit(){
      this.isEdit = false
      this.marketingClueEdit = this.deepClone(this.marketingClue)
    },

    /***************************************删除线索****************************************/
    //  删除线索
    delMarketingClue(){
      this._confirm('确定删除吗?', () => {
        this.$post('/crm/marketingCluePR/deleteMarketingClue', {"list": [this.marketingClue.id]}, (data) => {
          if(data.message){
            this.$message.error(data.message)
          }else{
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
      this.$post("/crm/getDict", {list: ['CRM-GJFS', 'CRM-XS-GJZT']}, (data) => {
        this.follow_type_list = data['CRM-GJFS']
        this.follow_status_list = data['CRM-XS-GJZT']
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

    //  获取联系人列表
    getContacts(){
      console.log(this.marketingClue.customerId)
      this.$post("/crm/contactsDetailPR/queryOtherContacts", {id: this.marketingClue.customerId}, (data) => {
        this.contacts_list = data.list
      })
    },

    //  打开写跟进模态框
    openFollowModal(){
      this.follow_form.followTime = this.formatDate(new Date(), "yyyy-MM-dd hh:mm")
      this.getAllStaff()
      this.getDict()
      this.getContacts()
      console.log(this.follow_form)
    },

    //  关闭写跟进模态框
    closeFollowModal(){
      this.$refs['follow_form'].resetFields();
    },
    //  写跟进提交
    followSave(){
      this.$refs.follow_form.validate((valid) => {
        if (valid) {
          if(this.follow_form.contactCname){
            this.follow_form.contactId = this.follow_form.contactCname.split("/")[0]
            this.follow_form.contactCname = this.follow_form.contactCname.split("/")[1]
          }
          if(this.follow_form.copyToUserCname){
            this.follow_form.copyToUserId = this.follow_form.copyToUserCname.split("/")[0]
            this.follow_form.copyToUserCname = this.follow_form.copyToUserCname.split("/")[1]
          }
          this.follow_form.parentId = this.query.id
          this.follow_form.moduleName = "crm_marketing_clue"

          this.$post("/crm/followPR/addOne", {follow : this.follow_form}, (data) => {
            this.$message.success("添加成功")
            this.follows.unshift(data.follow)
            this.dialogFolowVisible = false
            this.follow_form = {}
          })
        }
      });
    },

    /***************************************附件***************************************/
    //  获取附件列表
    getAttachs(){
      this.$post("/crm/getAttachs", {parentId: this.marketingClue.id}, (data) => {
        this.annexList = data.list
      })
    },

    //  删除附件
    delAnnex(id, fileName, index, rows){
      console.log(rows[index])
      this._confirm('确定删除吗?', () => {
        this.$post("/crm/deleteFile", {ids : [id], moduleName : '营销线索', parentId : this.query.id, content : this.marketingClue.name + '删除附件【' + fileName + '】'}, (data) => {
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
      console.log(this.files)
      let params = new FormData()
      let content = ''
      this.files.map((item, index) => {
        params.append("file" + index, item)
        content += '【' + item.name + '】'
      })
      params.append("remark", this.annexRemarks)
      params.append("parentId", this.marketingClue.id)
      params.append("moduleName", '营销线索')
      params.append("content", this.marketingClue.name + '上传附件' + content)
      this.$post("/crm/upfile2", params, (data) => {
        this.$message.success("上传成功！")
        this.dialogAnnexVisible = false
        this.getAttachs()
      })
    },

    /**----------------------------------------------------设置团队成员权限-------------------------------------------- */

    //  获取团队成员
    getMembers(){
      this.dialogSettingsVisible = true
      this.$post("/crm/memberPR/getAll", {"parentId": this.query.id, "moduleName": "crm_marketing_clue"}, (data) => {
        this.memberList = data.list
      })
    },
    //  添加团队成员
    addMember(){
      if(this.addMemberInput){
        let params = {
          parentId: this.query.id,
          moduleName: 'crm_marketing_clue',
          userCname: this.addMemberInput.split('/')[0],
          userId: this.addMemberInput.split('/')[1],
          userJobNum: this.addMemberInput.split('/')[1],
          isModify: false,
          isDownload: false,
          isOwner: false,
          moduleNames : '营销线索',
          content : this.marketingClue.name + '添加【' + this.addMemberInput.split('/')[0] + '】为参与人员',
        }
        this.$post("/crm/memberPR/addOne", params, (data) => {
          this.memberList.push(data.member)
        })
      }else{
        this.$message.error("请输入员工姓名或工号")
      }
    },
    //  删除团队成员
    deleteMember(id, userCname, index){
      this.$post("/crm/memberPR/delete", {list: [id], moduleName: '营销线索', parentId: this.query.id, content : this.marketingClue.name + '删除成员【' + userCname + '】'}, (data) => {
        this.memberList.splice(index, 1)
        this.$message.success("删除团队成员成功！")
      })
    },
    //  修改团队成员权限
    updateMember(flag, index, id, userCname, type){
      let content = ''
      // 编辑
      if (type == 'isModify' && flag == true) {
        content = this.marketingClue.name + '赋予了【' + userCname + '】编辑权限'
      }
      if (type == 'isModify' && flag == false) {
        content = this.marketingClue.name + '取消了【' + userCname + '】编辑权限'
      }
      // 下载
      if (type == 'isDownload' && flag == true) {
        content = this.marketingClue.name + '赋予了【' + userCname + '】下载附件权限'
      }
      if (type == 'isDownload' && flag == false) {
        content = this.marketingClue.name + '取消了【' + userCname + '】下载权限'
      }

      let params = {
        id: id,
        flag: flag,
        type: type,
        moduleName : '营销线索',
        parentId : this.query.id,
        content : content
      }
      this.memberList[index][type] = !flag
      this.$post("/crm/memberPR/update", params, (data) => {
        this.memberList[index][type] = flag
        this.$message.success("权限修改成功！")
      })
    },

    /**----------------------------------------------------关闭线索-------------------------------------------- */
    // 关闭模态框，清空数据
    colse_marketing_clue(){
      this.$refs['closeMarketingClue'].resetFields();
    },

    colse_marketing_clue_save(){
      this.$refs.closeMarketingClue.validate((valid) => {
        if (valid) {
          this.$post("/crm/marketingCluePR/updateMarketingClue", {id : this.query.id, flag : 'close', closeMarketingClue : this.closeMarketingClue}, (data) => {
            this.$message.success("修改成功！")
            this.getMarketingClueDetail()
            // this.marketingClue = this.deepClone(this.marketingClueEdit)
          })
          this.dialogClose = false
        }
      })
    },

    /**----------------------------------------------------操作日志-------------------------------------------- */
    getOperateLog(){
      this.$post("/crm/queryLog", {parentId : this.query.id}, (data) => {
        this.operateLog = data.list
      })
    },
  }
}
