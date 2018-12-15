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
        formBasicInfo: {},              //  基本信息
        formContract: {},               //  转化为合同表单
        formEdit: {},                   //  编辑机会表单
        formLost: {},                   //  丢单表单
        formTransfer: {},               //  转给他人表单
        operateLog: [],                 //  操作日志列表

        allStaff: [],   //  所有员工
        staff: '',      // 转给他人：员工

      /*****************************************关联联系人*********************************************** */
        lxrjs: [],    //  联系人角色
        contactForm: {
          contactId: '',
          role: '',
          isMaster: false
        },  //
        cus_contacts: [],   //  当前客户所有联系人列表
        contactRules: {
          contactId: [
            { required: true, validator: this.isNull, trigger: 'change' }
          ],
          role: [
            { required: true, validator: this.isNull, trigger: 'change' }
          ]
        },
        contacts: [],     //  机会关联联系人
        isUpdateContact: false,   //  是否编辑联系人
      /*******************************************基本信息*******************************************/
        opportunity: {},                // 机会信息
        opportunityEdit: {},            // 编辑机会信息
        isEdit: false,                  // 是否编辑
        opportunityFieldList: [],       // 机会字段集合
        opportunity_rules: {},          // 机会字段校验

      /*******************************************弹框*******************************************/
        dialogAddVisible: false,        // 添加联系人
        dialogEditVisible: false,       // 编辑
        dialogDelVisible: false,        // 删除
        dialogContractVisible: false,   // 转化为合同
        dialogTransferVisible: false,   // 转给他人

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
        follow_form: {  followTime: '' },
        contacts_list: [],             // 拜访人员（客户的联系人集合）

      /****************************************附件列表*********************************************/
        dialogAnnexVisible: false,      // 上传附件弹框
        annexList: [],                  // 附件列表
        annexRemarks: '',               // 备注
        files: [],                      // 上传文件列表

      /****************************************转化为合同*********************************************/
        userName: '',                   //  用户Id
        userCname: '',                  //  用户名
        htzt: [],                       // 合同状态
        customers: [],                  // 所有客户
        contractList: [],               // 合同集合
        form_contract: {                // 转化为合同规则
          contractName: [
            { required: true, message: '请填写合同名称', trigger: 'blur' },
          ],
          customerId: [
            { required: true, message: '请选择客户', trigger: 'change' },
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

        /**-------------------------------设置团队成员权限--------------------------- */
        dialogSettingsVisible: false,                         //  权限设置模态框
        addMemberInput: '',                                   //  新增团队成员
        memberList: [],                                       //   团队成员
        isModify: false,                                      //    是否可以修改
        isDownload: false,                                    //    是否有下载权限
        isOwner: false,                                       //    是否是拥有者

        /**-------------------------------关闭机会按钮--------------------------- */
        dialogClose: false,                                   // 关闭机会模态框
        closeOpportunity: {},                                 // 关闭机会表单
        close_rules: {
          closeReason: [
            { required: true, message: '请填写关闭原因', trigger: 'blur' },
          ],
        },
        /**-------------------------------新增竞争对手--------------------------- */
        dialogAddCompetitor: false,             // 竞争对手dialog
        competitorAdd: {},                      // 竞争对手表单
        competitor: [],                        // 所有竞争对手
        competitorList: [],                     // 所有竞争对手列表
        competitor_rules: {
          competitorId: [
            { required: true, message: '请选择竞争对手', trigger: 'change' },
          ],
        },
        /**-------------------------------点击丢单按钮--------------------------- */
        dialogLostVisible: false,       // 丢单弹框
        closeLost: {},                  // 丢单表单
        close_lost_rules: {
          lostReason: [
            { required: true, message: '请选择丢单原因', trigger: 'change' },
          ],
        }
    }
  },

  mounted () {
    this.getDict()
  },

  activated(){
    //  当前页面的get参数
    this.query = this.$router.currentRoute.query;
    //  获取线索详情页面信息
    this.getOpportunityDetail()
  },

  methods: {
    /******************************************丢单**********************************************/
    colse_lost(){
      this.$refs['closeLost'].resetFields();
    },

    setLost(){
      this.$refs.closeLost.validate((valid) => {
        if (valid) {
          this.$post("/crm/opportunityPR/updateOpportunity", {id : this.query.id, lost : this.closeLost}, (data) => {
            this.$message.success("设置丢单完成！")
            this.getOpportunityDetail()
          })
          this.dialogLostVisible = false
        }
      })
    },

    // 设置样式
    getClass(index){
      let n = this.follow_yxfs_list.indexOf(this.opportunity.marketingSection)
      if(index < n){
        return "disablesd"
      }else if(index == n){
        return "actived"
      }
    },
    // 营销阶段下一步设置
    nextStep(index){
      let n = this.follow_yxfs_list.indexOf(this.opportunity.marketingSection)
      n++
      if(index == n){
        console.log(this.follow_yxfs_list[index])

        this._confirm('是否将【机会' + this.opportunity.opportunityName + '】的营销阶段调整为' + this.follow_yxfs_list[index], () => {
          this.$post("/crm/opportunityPR/updateOpportunity", {id : this.query.id, yxjd : this.follow_yxfs_list[index]}, (data) => {
            this.$message.success("修改成功！")
            this.getOpportunityDetail()
          })
        })
      }
    },

  /***************************************基本信息****************************************/
    // 返回前一个页面
    goBack(){
      this.$router.go(-1)
    },
    //  获取数据字典
    getDict(){
      let list = ["crm-lxrjs", "crm-htzt", 'CRM-YXJD', 'CRM-GJFS', 'CRM-JH-GJZT']
      this.$post("/crm/getDict", {"list": list}, (data) => {
        this.lxrjs = data['crm-lxrjs']
        this.htzt = data['crm-htzt']
        this.follow_yxfs_list = data['CRM-YXJD']
        this.follow_type_list = data['CRM-GJFS']
        this.follow_status_list = data['CRM-JH-GJZT']
      })
    },

    //  获取线索详情信息
    getOpportunityDetail(){
      this.$post("/crm/opportunityDetailPR/queryOpportunityForOne", {moduleName: 'crm_marketing_opportunity', id: this.query.id}, (data) => {
        this.opportunity = data.opportunity
        this.follows = data.follows
        this.isOwner = data.isOwner
        this.isModify = data.isModify
        this.isDownload = data.isDownload
        this.userName = data.userName
        this.userCname = data.userCname
        this.opportunityEdit = this.deepClone(data.opportunity)
      })
      this.$post("/crm/extFieldPR/getField", {tableName: 'crm_marketing_opportunity'}, (data) => {
        this.opportunityFieldList = data.list
      })
    },
  /*******************************************添加关联联系人********************************************* */
    //  打开
    openContactBtn(){
        this.dialogAddVisible = true
        if(!this.cus_contacts.length){
          this.$post("/crm/contactsDetailPR/queryOtherContacts", {id: this.opportunity.customerId}, (data) => {
            this.cus_contacts = data.list
          })
        }
    },
    //  关闭
    contactFormClose(){
      this.$refs.contactForm.resetFields();
      this.contactForm.contactId = '';
      this.contactForm.role = '';
      this.isUpdateContact = false
    },
    //  保存
    saveContact(){
      this.$refs.contactForm.validate((valid) => {
        if (valid) {
          this.contactForm.opportunityId = this.opportunity.id
          if(this.isUpdateContact){
            //  修改
            this.$post("/crm/opportunityDetailPR/updateContact", this.contactForm, (data) => {
              if(data.status){
                this._confirm(data.message, () => {
                  this.$post("/crm/opportunityDetailPR/updateMasterContact", this.contactForm, (data) => {
                    this.$message.success("修改成功！")
                    this.dialogAddVisible = false
                    this.getContacts()
                  })
                })
              }else{
                this.$message.success("修改成功！")
                this.dialogAddVisible = false
                this.getContacts()
              }
            })
          }else{
            //  新增
            this.$post("/crm/opportunityDetailPR/addContact", this.contactForm, (data) => {
              if(data.status){
                this._confirm(data.message, () => {
                  this.$post("/crm/opportunityDetailPR/addMasterContact", this.contactForm, (data) => {
                    this.$message.success("添加成功！")
                    this.dialogAddVisible = false
                    this.getContacts()
                  })
                })
              }else{
                this.$message.success("添加成功！")
                this.dialogAddVisible = false
                this.getContacts()
              }
            })
          }
        }
      });
    },
    //  获取联系人
    getContacts(){
      this.$post("/crm/opportunityDetailPR/getContact", {id: this.opportunity.id}, (data) => {
        this.contacts = data.list
      })
    },
    //  编辑联系人按钮
    updateContact(data){
      this.contactForm.contactId = data.id
      this.contactForm.role = data.oppoInfo.role
      this.contactForm.isMaster = data.oppoInfo.isMaster
      this.isUpdateContact = true
      this.openContactBtn()
    },
    //  删除联系人
    delContact(id){
      this._confirm('确定删除吗？', () => {
        this.$post("/crm/opportunityDetailPR/delContact", {id: id}, (data) => {
          this.$message.success("删除成功！")
          this.getContacts()
        })
      })
    },
  /***************************************转化为合同****************************************/
    // 关闭模态框时，清空数据
    closeModel(){
      this.$refs['formContract'].resetFields();
    },

    // 转化为机会确定按钮
    form_contract_save(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formContract.opportunityName = this.opportunity.opportunityName
          this.formContract.customerId = this.opportunity.customerId
          this.$post("/crm/opportunityDetailPR/formContract", {id : this.query.id, formContract : this.formContract}, (data) => {
            this.$notify.success({ message: '操作成功！'});
            this.dialogContractVisible = false;
          })
        }
      });
    },

  /***************************************查看机会转化的合同****************************************/
    opportunity_to_contract(){
      this.$post("/crm/opportunityDetailPR/contractByOpportunityId", {id : this.query.id}, (data) => {
        this.contractList = data.list
      })
    },

  /***************************************写跟进****************************************/

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
      this.formContract.ownerCname = this.userName + "/" + this.userCname
      this.follow_form.followTime = this.formatDate(new Date(), "yyyy-MM-dd hh:mm")
      this.getAllCustomer()
      this.getAllStaff()
      this.getDict()
      this.getContacts()
    },

    //  获取联系人列表
    // getContacts(){
    //   console.log(this.opportunity.customerId)
    //   this.$post("/crm/contactsDetailPR/queryOtherContacts", {id: this.opportunity.customerId}, (data) => {
    //     this.contacts_list = data.list
    //   })
    // },

    getAllCustomer(){
      // 获取所有客户
      if(!this.customers.length){
        this.$post("/crm/queryAllCustomers", {}, (data) => {
          this.customers = data.customers
        })
      }
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
          this.follow_form.moduleName = "crm_marketing_opportunity"

          this.$post("/crm/followPR/addOne", {follow : this.follow_form}, (data) => {
            this.$message.success("添加成功")
            this.follows.unshift(data.follow)
            this.dialogFolowVisible = false
            this.follow_form = {}
          })
        }
      });
    },

  /******************************************转给他人***************************************/
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
          this.contact_list = data.list
        })
      }
    },

    // 转给他人确定按钮
    turn_other_sava(){
      if(!this.staff){
        this.$message.error("请选择新拥有者！")
        return
      }
      let list = [this.opportunity.id]
      let params = {
        list: list,
        ownerId: this.staff,
        ifLeft: this.formTransfer.checkbox1
      }
      this.$post("/crm/opportunityPR/turnOther", params, (data) => {
        this.dialogTransferVisible = false
        this.$message.success("转移成功！")
        this.$router.back(-1)
      })
    },

  /******************************************编辑******************************************/
    // 改变营销状态，获得对应的赢单率
    changeStage(name){
      if(name == 'marketingSection'){
        this.$post("/crm/marketingClueDetailPR/changeStage", {marketingSection : this.opportunityEdit.marketingSection}, (data) => {
          console.log(data.dealPossible)
          this.opportunityEdit.dealPossible = data.dealPossible
        })
      }
    },
    // 编辑线索
    edit_opportunity() {
      this.isEdit = true
      this.getAllStaff()
      this.$post("/crm/extFieldPR/getField",{tableName: 'crm_marketing_opportunity'}, (data) => {
        this.opportunityFieldList = data.list;
      })
    },

    //  保存编辑
    opportunitySave(){
      this.$post("/crm/opportunityPR/updateOpportunity", this.opportunityEdit, (data) => {
        this.$message.success("修改成功！")
        this.isEdit = false
        this.opportunity = this.deepClone(this.opportunityEdit)
      })
    },

    //  取消编辑
    cancelEdit(){
      this.isEdit = false
      this.opportunityEdit = this.deepClone(this.opportunity)
    },


  /***************************************删除线索****************************************/
    //  删除线索
    delOpportunity(){
      this._confirm('确定删除吗?', () => {
        this.$post('/crm/opportunityPR/deleteOpportunity', {"list": [this.opportunity.id]}, (data) => {
          if(data.message){
            this.$message.error(data.message)
          }else{
            this.$message.success("删除成功！")
            this.$router.back(-1)
          }
        })
      })
    },

  /***************************************附件***************************************/
    //  获取附件列表
    getAttachs(){
      this.$post("/crm/getAttachs", {parentId: this.opportunity.id}, (data) => {
        this.annexList = data.list
      })
    },

    //  删除附件
    delAnnex(id, fileName, index, rows){
      this._confirm('确定删除吗?', () => {
        this.$post("/crm/deleteFile", {ids : [id], moduleName : '机会', parentId : this.query.id, content : this.opportunity.opportunityName + '删除附件【' + fileName + '】'}, (data) => {
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
      params.append("parentId", this.opportunity.id)
      params.append("moduleName", '机会')
      params.append("content", this.opportunity.opportunityName + '上传附件' + content)
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
      this.$post("/crm/memberPR/getAll", {"parentId": this.query.id, "moduleName": "crm_marketing_opportunity"}, (data) => {
        this.memberList = data.list
      })
    },
    //  添加团队成员
    addMember(){
      if(this.addMemberInput){
        let params = {
          parentId: this.query.id,
          moduleName: 'crm_marketing_opportunity',
          userCname: this.addMemberInput.split('/')[0],
          userId: this.addMemberInput.split('/')[1],
          userJobNum: this.addMemberInput.split('/')[1],
          isModify: false,
          isDownload: false,
          isOwner: false,
          moduleNames : '机会',
          content : this.opportunity.opportunityName + '添加【' + this.addMemberInput.split('/')[0] + '】为参与人员',
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
      this.$post("/crm/memberPR/delete", {list: [id], moduleName: '机会', parentId: this.query.id, content : this.opportunity.opportunityName + '删除成员【' + userCname + '】'}, (data) => {
        this.memberList.splice(index, 1)
        this.$message.success("删除团队成员成功！")
      })
    },
    //  修改团队成员权限
    updateMember(flag, index, id, userCname, type){
      let content = ''
      // 编辑
      if (type == 'isModify' && flag == true) {
        content = this.opportunity.opportunityName + '赋予了【' + userCname + '】编辑权限'
      }
      if (type == 'isModify' && flag == false) {
        content = this.opportunity.opportunityName + '取消了【' + userCname + '】编辑权限'
      }
      // 下载
      if (type == 'isDownload' && flag == true) {
        content = this.opportunity.opportunityName + '赋予了【' + userCname + '】下载附件权限'
      }
      if (type == 'isDownload' && flag == false) {
        content = this.opportunity.opportunityName + '取消了【' + userCname + '】下载权限'
      }

      let params = {
        id: id,
        flag: flag,
        type: type,
        moduleName : '机会',
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
    colse_opportunity(){
      this.$refs['closeOpportunity'].resetFields();
    },

    colse_opportunity_save(){
      this.$refs.closeOpportunity.validate((valid) => {
        if (valid) {
          this.$post("/crm/opportunityPR/updateOpportunity", {id : this.query.id, flag : 'close', closeOpportunity : this.closeOpportunity}, (data) => {
            this.$message.success("修改成功！")
            this.getOpportunityDetail()
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

    /**----------------------------------------------------机会详情页查看竞争对手-------------------------------------------- */
    getCompetitor(){
      this.$post("/crm/opportunityDetailPR/queryCompetitor", {id : this.query.id}, (data) => {
        this.competitorList = data.list
      })
    },

    /**----------------------------------------------------添加竞争对手-------------------------------------------- */
    addCompetitor(){
      this.$refs.competitorAdd.validate((valid) => {
        if (valid) {
          this.$post("/crm/opportunityDetailPR/addCompetitor", {id : this.query.id, competitorAdd : this.competitorAdd}, (data) => {
            if (data.message) {
              this.$message.error(data.message)
            } else {
              this.$message.success("添加成功！")
              this.getCompetitor()
              this.dialogAddCompetitor = false
            }
          })
        }
      })
    },

    open_add_competitor(){
      this.activeName = "forth"
      // 获取所有竞争对手
      if (!this.competitor.length) {
        this.$post("/crm/queryAllCompetitor", {}, (data) => {
          this.competitor = data.competitor
        })
      }
      this.dialogAddCompetitor = true
    },

    close_competitor(){
      this.$refs['competitorAdd'].resetFields();
    },

    /**
     * 添加按钮
     */
    handleCommand(command){
      this[command] = true
    },
  }
}
