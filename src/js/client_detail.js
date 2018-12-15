import { mapState, mapActions, mapMutations } from 'vuex'
import {regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  data() {
    //  写跟进验证（当跟进方式为到访时拜访人员为必填）
    var checkContact = (rule, value, callback) => {
      if(this.follow_form.followType == '到访' & !value){
        callback(new Error('跟进方式为到访时请填写拜访人'));
      }else{
        callback();
      }
    };
    //  验证手机号
    var checkPhone = function(rule, value, callback){
      let reg = /^1[0-9]{10}$/;
      if(reg.test(value)){
        callback()
      }else{
        callback(new Error('手机号错误!'))
      }
    };
    return {
      query: {},                  //  url参数
    /**----------------------------------客户信息  客户全景------------------------------------- */
      customer: {area: []}, //  客户信息
      tabName: 'tab1',   //  标签页
      isModify: false,     //    是否可以修改
      isDownload: false,     //    是否有下载权限
      isOwner: false,     //    是否是拥有者

    /**-------------------------------------------基本信息-------------------------------------------- */
      customerFieldList: [],    //  客户字段集合
      customerEdit: {},         //  客户编辑信息
      customer_rules:{
        name: [
          { required: true, validator: this.isNull, trigger: 'blur' }
        ],
        no: [
          { required: true, validator: this.isNull, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: this.isNull, trigger: 'blur' }
        ],
      },//添加客户校验规则
      isEdit: false, // 是否编辑

    /**---------------------------------------附件-------------------------------------------- */
      dialogAnnexVisible: false,
      annexList: [],    //  附件列表
      files: [], // 上传文件列表
      annexRemarks: '',       //  备注

    /**-------------------------------设置团队成员权限--------------------------- */
      dialogSettingsVisible: false,                         //  权限设置模态框
      addMemberInput: '', //  新增团队成员
      allStaff: [],    //  所有员工列表
      memberList: [],  //   团队成员

    /**-------------------------------转给他人--------------------------- */
      dialogTransferVisible: false,  // 转给其他人
      staff: '',      //转给他人：员工
      userName: '',         // 员工工号
      userCname: '',        // 员工姓名
      formTransfer: {
        checkbox1: false,   //  是否保留为团队成员
        checkbox2: false,   //  是否转移线索
        checkbox3: false,   //  是否转移合同
        checkbox4: false,   //  是否转移机会
      }, //  转给他人checkbox

    /**---------------------------------写跟进------------------------------------ */
      follows: [],  //  跟进列表
      follow_type_list: [], //  跟进方式
      follow_status_list: [], //  跟进状态
      contact_list: [], //  当前客户所有联系人列表
      dialogFolowVisible: false,                      //  写跟进模态框
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
        contactCname: [
          { validator: checkContact, trigger: 'change' }
        ]
      },      //  写跟进验证规则
      follow_form: {followTime: ''},

    /**--------------------------------联系人---------------------------- */
      contacts_list:[],//联系人集合
      dialogContactdVisible: false,     //  新增联系人模态框
      contactsAddLabel: [],   //  新增联系人label
      contactsAdd:{tags: []},         //  联系人新增对象
      imgSrc: '', //  联系人头像
      inputVisible: false,    //  是否显示编辑tag的input框
      inputValue: '',         //  新增标签input值
      contacts_rules: {
        customerName: [
          { required: true, message: '请选择客户', trigger: 'change' },
        ],
        name: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
        ],
        mobilePhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }, //  新增联系人验证规则

    /**********************************添加线索*************************************/
      marketingClueAdd: {},                         // 新增线索
      marketingClueAddLabel:[],                     // 新增线索label
      dialogAddVisible:false,                       // 新增线索弹框
      customers: [],                                // 所有客户
      partner: [],                                  // 所有合作伙伴
      competitor: [],                               // 所有竞争对手
      marketingClueList: [],                        // 线索集合
      marketing_clue_rules: {                       // 新增线索规则
        name: [
          { required: true, message: '请填写线索名称', trigger: 'blur' },
        ],
        dept: [
          { required: true, message: '请选择部门', trigger: 'change' },
        ],
        ownerCname: [
          { required: true, message: '请选择拥有者', trigger: 'change' },
        ],
      },

    /**********************************添加机会*************************************/
      opportunityAdd: {dealPossible: ''},         // 新增机会
      opportunityAddLabel: {},                    // 新增机会Lable
      dialogAddOpportunity: false,                // 添加机会模态框
      opportunityList: [],                        // 机会集合
      marketingClues: [],                         // 所有线索
      opportunity_rules: {                        // 机会规则
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

    /**********************************添加合同*************************************/
      contractAdd: {},                              // 新增合同
      openTicketAdd: {},                            // 开票信息表单
      contractAddLabel: {},                         // 新增合同Lable
      dialogAddContractVisible: false,              // 添加合同模态框
      contractList: [],                             // 合同集合
      opportunitys: [],                             // 所有机会
      contrac_rules: {                              // 合同规则
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
        dept: [
          { required: true, message: '请选择所属部门', trigger: 'change' },
        ],
      },
    /*********************************日志******************************** */
      logs: [],   //  日志

      copyToUserList: [],
    }
  },
  activated(){
    this.query = this.$router.currentRoute.query;
    //  获取客户详情页面信息
    this.getCustomerDetail()

    this.getAllStaff()
  },


  methods: {
    delCopyToUser(copyToUser) {
      this.copyToUserList.splice(this.copyToUserList.indexOf(copyToUser), 1);
    },
    addCopyToUser(val){
      if(val){
        let copyToUser = val.split('/')[1] + "(" + val.split('/')[0] + ')'
        if(this.copyToUserList.indexOf(copyToUser) == -1){
          this.copyToUserList.push(copyToUser)
        }
      }
      this.follow_form.copyToUserCname = ''
    },


    //  切换tab
    chooseTab(tab, event){
      if(this[this.tabName]){
        this[this.tabName]()
      }
    },
    // 获取所有的客户
    getAllCustomers(){
      if(!this.customers.length){
        this.$post("/crm/queryAllCustomers", {}, (data) => {
          this.customers = data.customers
        })
      }
    },
    // 获取所有的合作伙伴
    getAllPartners(){
      if (!this.partner.length) {
        this.$post("/crm/queryAllPartner", {}, (data) => {
          this.partner = data.partner
        })
      }
    },

    // 获取所有的竞争对手
    getAllCompetitors(){
      if (!this.competitor.length) {
        this.$post("/crm/queryAllCompetitor", {}, (data) => {
          this.competitor = data.competitor
        })
      }
    },

  /**-------------------------------------------------新增线索----------------------------------------- */
    closeMarketingClueAdd(){
      this.$refs['marketingClueAdd'].resetFields();
    },
    //  打开新增模态框
    openMarketintClueModal(){
      // 获取所有的客户
      this.getAllCustomers()
      // 获取所有的合作伙伴
      this.getAllPartners()
      this.getAllStaff()
      this.marketingClueAdd.ownerCname = this.userName + "/" + this.userCname
    },

    add_marketing_clue() {
      this.$post("/crm/extFieldPR/getField",{tableName: 'crm_marketing_clue'}, (data) => {
        this.marketingClueAddLabel = data.list;
        data.list.map((item) => {
          if (item.fieldType != 'date'){
            // this.marketingClueAdd[item.name] = item.value
            if (item.fieldType == 'cascade' & !item.value){
              this.marketingClueAdd[item.name] = []
            }
          }
        })
        this.dialogAddVisible = true;
      })
    },

    /**
     * 保存数据
     */
    marketingClueSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.marketingClueAdd.customerId = this.customer.id
          // this.marketingClueAdd.customerName = this.customer.name

          this.$post("/crm/marketingCluePR/addMarketingClue", this.marketingClueAdd, (data) => {
            this.$message.success('添加线索成功！');
            this.dialogAddVisible = false;
            this.look_add_marketing_clue()
          })
        }
      });
    },

  /******************************************查看新增的线索*************************************************/
    look_add_marketing_clue(){
      this.$post("/crm/customerDetailPR/customerAddMarketingClue", {id : this.query.id}, (data) => {
        this.marketingClueList = data.list
      })
    },

  /**********************************************新增机会**********************************************/
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
    closeOpportunityAdd(){
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
        this.dialogAddOpportunity = true;
      })
    },

    // 获取当前客户下的所有线索
    getAllMarketingClues(){
      this.$post("/crm/opportunityPR/getMarketingClueByCustomerId", {id : this.query.id}, (data) => {
        this.marketingClues = data.list
      })
    },

    //  打开新增模态框
    openOpportunityModal(){
      // 获取当前客户下的所有线索
      this.getAllMarketingClues()
      // 获取所有的合作伙伴
      this.getAllPartners()
      // 获取所有的竞争对手
      this.getAllCompetitors()
      // 获取所有客户
      this.getAllCustomers()
      // 获取所有员工
      this.getAllStaff()
      this.opportunityAdd.ownerCname = this.userName + "/" + this.userCname
    },

    /**
     * 保存数据
     */
    opportunitySave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.opportunityAdd.customerId = this.customer.id

          this.$post("/crm/opportunityPR/addOpportunity", this.opportunityAdd, (data) => {
            this.$message.success('添加机会成功！');
            this.dialogAddOpportunity = false;
            this.look_add_opportunity()
          })
        }
      });
    },

  /******************************************查看新增的机会*************************************************/
    look_add_opportunity(){
      this.$post("/crm/customerDetailPR/customerAddOpportunity", {id : this.query.id}, (data) => {
        this.opportunityList = data.list
      })
    },

  /******************************************新增合同*************************************************/
    /**
     * 新增按钮
     */
    closeContractAdd(){
      this.$refs['contractAdd'].resetFields();
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
        this.dialogAddContractVisible = true;
      })
    },

    // 获取所有的机会
    getAllOpportunitys(){
      if (!this.opportunitys.length) {
        this.$post("/crm/opportunityPR/getOpportuniryByCustomerId", {id : this.query.id}, (data) => {
          this.opportunitys = data.list
        })
      }
    },

    //  打开新增模态框
    openContractModal(){
      // 获取所有客户
      this.getAllCustomers()
      // 获取所有员工
      this.getAllStaff()
      // 获取所有的机会
      this.getAllOpportunitys()
      this.contractAdd.ownerCname = this.userName + "/" + this.userCname
    },

    /**
     * 保存数据合同信息和开票信息
     */
    contractSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.contractAdd.customerId = this.customer.id

          this.$post("/crm/contractPR/addContract", {contractAdd : this.contractAdd, openTicketAdd : this.openTicketAdd}, (data) => {
            this.$message.success('添加合同成功！');
            this.dialogAddContractVisible = false;
            this.look_add_contract()
          })
        }
      });
    },

  /******************************************查看新增的合同*************************************************/
    look_add_contract(){
      this.$post("/crm/customerDetailPR/customerAddContract", {id : this.query.id}, (data) => {
        this.contractList = data.list
      })
    },

  /**-------------------------------------------------获取联系人----------------------------------------- */
    //  获取联系人列表
    getContacts(){
      this.getContactsAddLabel()
      this.$post("/crm/contactsDetailPR/queryOtherContacts", {id: this.customer.id}, (data) => {
        this.contacts_list = data.list
      })
    },
    getContactsAddLabel(){
      if(!this.contactsAddLabel.length){
        this.$post("/crm/extFieldPR/getField", {tableName: 'crm_contacts'}, (data) => {
          this.contactsAddLabel = data.list;
        })
      }
    },
    //  新增联系人按钮
    addContat() {
      this.dialogContactdVisible = true;
    },
    //  打开新增模态框
    openContactModal(){
      this.getContactsAddLabel()
    },
    //  关闭新增模态框，清除数据
    closeContactModal(){
      this.imgSrc = ''
      this.$refs.uploadInput.value = ''
      this.$refs.contactForm.resetFields();
    },
    //  打开input file
    chooseImg(){
      this.$refs.uploadInput.click()
    },
    //  选择图片
    pictureChange(e){
      if(e.target.files.length) this.imgSrc = e.target.files[0]
    },
    //  添加标签
    handleClose(tag) {
      this.contactsAdd.tags.splice(this.contactsAdd.tags.indexOf(tag), 1);
    },
    //  添加标签
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //  添加标签
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.contactsAdd.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    //  保存联系人
    contactsSave(){
      this.$refs.contactForm.validate((valid) => {
          if (valid) {
              this.contactsAdd.customerId = this.customer.id
              this.contactsAdd.customerName = this.customer.name
              let params = new FormData()
              params.append('avatar', this.imgSrc)
              params.append('contactsAdd', JSON.stringify(this.contactsAdd))
              params.append('parentId', this.query.id)
                  this.$post("/crm/contactsPR/addCrmContacts", params, (data) => {
                  this.$message.success('操作成功！');
                  this.getContacts()
                  this.dialogContactdVisible = false;
              })
          }
      });
    },
  /*--------------------------------------------转给他人功能--------------------------------------------*/
    // 打开转给他人弹框
    turnOther(){
      this.getAllStaff()
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
      let list = [this.customer.id]
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
        this.$router.back(-1)
      })
    },
    //  转移至公海
    turnSea(command){
      this._confirm('确定要将【' + this.customer.name + '】转至公海客户池吗？转移成功后，此客户属于公共资源，原拥有者不能再维护跟进。', () => {
        this.$post('/crm/customerPR/moveToSea', {"list": [this.customer.id]}, (data) => {
          this.$message.success("转移成功！")
          this.$router.back(-1)
        })
      })
    },

    //  删除客户
    delCustomer(){
      this._confirm('确定删除吗?', () => {
        this.$post('/crm/customerPR/deleteCrmCustomer', {"list": [this.customer.id]}, (data) => {
          if(data.message){
            this.$message.error(data.message)
          }else{
            this.$message.success("删除成功！")
            this.$router.back(-1)
          }
        })
      })
    },


  /**------------------------------------------------附件----------------------------------------------------- */
    //  获取附件列表
    getAttachs(){
      this.$post("/crm/getAttachs", {parentId: this.customer.id}, (data) => {
        this.annexList = data.list
      })
    },
    //  删除附件
    delAnnex(id, fileName, index){
      this._confirm('确定删除吗?', () => {
        this.$post("/crm/deleteFile", {ids: [id], moduleName : '客户', parentId : this.query.id, content : this.customer.name + '删除附件【' + fileName + '】'}, (data) => {
          this.$message.success("删除成功")
          this.annexList.splice(index, 1)
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
    //  关闭附件模态框
    closeAnnexModal(){
      this.annexRemarks = '',
      this.files = []
    },
    //  打开选择文件
    chooseAnnex(){
      this.$refs.annexInput.click()
    },
    //  选择文件
    changeFile(e){
      let files = this.$refs.annexInput.files
      for(let i=0; i< files.length; i++){
        this.files.push(files[i])
      }
      this.$refs.annexInput.value = ''
    },
    //  删除待上传文件
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
      params.append("parentId", this.customer.id)
      params.append("moduleName", '客户')
      params.append("content", this.customer.name + '上传附件' + content)
      this.$post("/crm/upfile2", params, (data) => {
        this.$message.success("上传成功！")
        this.dialogAnnexVisible = false
        this.getAttachs()
      })
    },

  /**---------------------------------------------基本信息----------------------------------------------------- */
    //  基本信息
    tab2(){
      if(!this.customerFieldList.length){
        this.$post("/crm/extFieldPR/getField", {tableName: 'crm_customer'}, (data) => {
          this.customerFieldList = data.list
        })
      }
    },
    //  编辑客户
    editCustomer(){
      this.tabName = 'tab2'
      this.isEdit = true
      this.tab2()
    },
    //  取消编辑
    cancelEdit(){
      this.isEdit = false
      this.$refs.customerEdit.resetFields()
    },
    //  保存编辑
    customerSave(){
      this.$refs.customerEdit.validate((valid) => {
        if (valid) {
          this.$post("/crm/customerPR/updateCrmCustomer", this.customerEdit, (data) => {
            this.$message.success("修改成功！")
            this.isEdit = false
            this.customer = this.deepClone(this.customerEdit)
          })
        }
      });
    },

    //  获取客户详情信息
    getCustomerDetail(){
      this.$post("/crm/customerDetailPR/queryCrmCustomerForOne", {id: this.query.id}, (data) => {
        this.customer = data.customer
        this.follows = data.follows
        this.isOwner = data.isOwner
        this.isModify = data.isModify
        this.isDownload = data.isDownload
        this.contacts_list = data.contacts
        this.marketingClueList = data.clues
        this.opportunityList = data.opportunitys
        this.contractList = data.contracts
        this.customerEdit = this.deepClone(data.customer)
      })
    },

  /**---------------------------------------------写跟进--------------------------------------------- */
    //  获取数据字典
    getDict(){
      if(this.follow_type_list.length) return
      this.$post("/crm/getDict", {list: ['CRM-GJFS', 'CRM-KH-GJZT']}, (data) => {
        this.follow_type_list = data['CRM-GJFS']
        this.follow_status_list = data['CRM-KH-GJZT']
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
      this.follow_form.followTime = this.formatDate(new Date(), "yyyy-MM-dd hh:mm")
      this.getAllStaff()
      this.getDict()
      this.getContacts()
      console.log(this.follow_form)
    },
    //  关闭写跟进模态框
    closeFollowModal(){
      this.copyToUserList = []
    },
    //  写跟进提交
    followSave(){
      this.$refs.follow_form.validate((valid) => {
        if (valid) {
          let follow_form = this.deepClone(this.follow_form)
          if(follow_form.contactCname){
            follow_form.contactId = follow_form.contactCname.split("/")[0]
            follow_form.contactCname = follow_form.contactCname.split("/")[1]
          }
          follow_form.copyToUserCname = this.copyToUserList.join(";")
          follow_form.parentId = this.customer.id
          follow_form.moduleName = "crm_customer"
          this.$post("/crm/followPR/addOne", {follow: follow_form}, (data) => {
            this.$message.success("添加成功")
            this.follows.unshift(data.follow)
            this.dialogFolowVisible = false
            this.follow_form = {}
          })
        }
      });
    },
  /**----------------------------------------------------设置团队成员权限-------------------------------------------- */
    //  加载所有员工
    getAllStaff() {
      this.addMemberInput = ''
      if(!this.allStaff.length){
        this.$post("/crm/getAllStaff", {}, (data) => {
          this.allStaff = data.list
          this.contact_list = data.list
          this.userName = data.userid
          this.userCname = data.username
        })
      }
    },
    //  获取团队成员
    getMembers(){
      this.dialogSettingsVisible = true
      this.$post("/crm/memberPR/getAll", {"parentId": this.query.id, "moduleName": "crm_customer"}, (data) => {
        this.memberList = data.list
      })
    },
    //  添加团队成员
    addMember(){
      if(this.addMemberInput){
        let params = {
          parentId: this.query.id,
          moduleName: 'crm_customer',
          userCname: this.addMemberInput.split('/')[0],
          userId: this.addMemberInput.split('/')[1],
          userJobNum: this.addMemberInput.split('/')[1],
          isModify: false,
          isDownload: false,
          isOwner: false,
          moduleNames : '客户',
          content : this.customer.name + '添加【' + this.addMemberInput.split('/')[0] + '】为参与人员',
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
      this.$post("/crm/memberPR/delete", {list: [id], moduleName: '客户', parentId: this.query.id, content : this.customer.name + '删除成员【' + userCname + '】'}, (data) => {
        this.memberList.splice(index, 1)
        this.$message.success("删除团队成员成功！")
      })
    },
    //  修改团队成员权限
    updateMember(flag, index, id, userCname, type){
      console.log(flag)
      console.log(type)
      let content = ''
      // 编辑
      if (type == 'isModify' && flag == true) {
        content = this.customer.name + '赋予了【' + userCname + '】编辑权限'
      }
      if (type == 'isModify' && flag == false) {
        content = this.customer.name + '取消了【' + userCname + '】编辑权限'
      }
      // 下载
      if (type == 'isDownload' && flag == true) {
        content = this.customer.name + '赋予了【' + userCname + '】下载附件权限'
      }
      if (type == 'isDownload' && flag == false) {
        content = this.customer.name + '取消了【' + userCname + '】下载权限'
      }

      let params = {
        id: id,
        flag: flag,
        type: type,
        moduleName : '客户',
        parentId : this.query.id,
        content : content
      }
      this.memberList[index][type] = !flag
      this.$post("/crm/memberPR/update", params, (data) => {
        this.memberList[index][type] = flag
        this.$message.success("权限修改成功！")
      })
    },
  /**----------------------------------------------------获取日志-------------------------------------------- */
    //  获取日志
    getLogs(){
      this.$post("/crm/queryLog", {parentId: this.query.id}, (data) => {
        this.logs = data.list
      })
    },
  }
}
