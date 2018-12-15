import {regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
    export default {
        data() {
            //  验证手机号
            var checkPhone = function(rule, value, callback){
                let reg = /^1[0-9]{10}$/;
                if(reg.test(value)){
                    callback()
                }else{
                    callback(new Error('手机号错误!'))
                }
            };
            //  写跟进验证（当跟进方式为到访时拜访人员为必填）
            var checkContact = (rule, value, callback) => {
                if(this.follow_form.followType == '到访' & !value){
                    callback(new Error('跟进方式为到访时请填写拜访人'));
                }else{
                    callback();
                }
            };
            return {
                query: {},                      //  页面传递参数
                logs: [],                       //  日志
                isModify: false,     //    是否可以修改
                isOwner: false,     //    是否是拥有者
                isDownload: false,     //    是否有下载权限
                activeName: 'first',            //  tab页签
                basicInfo: {},              //  基本信息
                formBasicInfo: {},              //  基本信息表单
                addLabel: [],               //  信息字段集合
                isEdit: false,                  //  是否编辑
                tableData: [],                  //  表格
                rules: {
                    name: [
                      { required: true, validator: this.isNull, trigger: 'blur' }
                    ],
                    phone: [
                      { required: true, validator: this.isNull, trigger: 'blur' }
                    ],
                }, //  新增联系人验证规则

                allStaff: [],                   //  所有员工
                dialogTransferVisible: false,   //  转给他人模态框
                staff: '',      //转给他人：员工
                formTransfer: {
                }, //  转给他人checkbox

    /**--------------------------------联系人---------------------------- */
                isEditContact: false,                   //  是否编辑联系人
                contacts_list:[],//联系人集合
                dialogContactdVisible: false,     //  新增联系人模态框
                contactsAddLabel: [],   //  新增联系人label
                contactsAdd:{tags: []},         //  联系人新增对象
                imgSrc: '', //  联系人头像
                inputVisible: false,    //  是否显示编辑tag的input框
                inputValue: '',         //  新增标签input值
                contacts_rules: {
                    name: [
                        { required: true, validator: this.isNull, trigger: 'blur' }
                    ],
                    mobilePhone: [
                        { required: true, validator: this.isNull, trigger: 'blur' }
                    ]
                }, //  新增联系人验证规则
    /**---------------------------------------附件-------------------------------------------- */
                dialogAnnexVisible: false,
                annexList: [],    //  附件列表
                files: [], // 上传文件列表
                annexRemarks: '',       //  备注
    /**---------------------------------写跟进------------------------------------ */
                follows: [],  //  跟进列表
                follow_type_list: [], //  跟进方式
                follow_status_list: [], //  跟进状态
                contact_list: [], //  当前客户所有联系人列表
                followRules: {
                    followType: [
                    { required: true, message: '请选择跟进方式', trigger: 'change' }
                    ],
                    followTime: [
                    { type: 'date', required: true, message: '请选择跟进时间', trigger: 'change' }
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
                follow_form: {},
                dialogFolowVisible: false,          //  写跟进模态框

    /**---------------------------------查看当前合作伙伴参与的线索和机会------------------------------------ */
                marketingClueList: [],                          // 线索集合
                opportunityList: [],                            // 机会集合
    /**-------------------------------设置团队成员权限--------------------------- */
                addMemberInput: '', //  新增团队成员
                dialogSettingsVisible: false,  //  权限设置模态框
                memberList: [],  //   团队成员
            }
        },

    /**---------------------------------------------------------------------------------------- */
    activated(){
        this.query = this.$router.currentRoute.query
        this.getBaseInfo()
    },
    methods: {
        //  获取合作伙伴信息和所有字段
        getBaseInfo(){
            this.$post("/crm/partnerDetailPR/queryPartnerForOne", {id: this.query.id}, (data) => {
                this.basicInfo = data.basicInfo
                this.follows = data.follows
                this.isModify = data.isModify
                this.isDownload = data.isDownload
                this.isOwner = data.isOwner
                this.formBasicInfo = this.deepClone(data.basicInfo)
                this.formBasicInfo = this.deepClone(data.basicInfo)
                this.formBasicInfo = this.deepClone(data.basicInfo)
            })
            if(!this.addLabel.length){
                this.$post("/crm/extFieldPR/getField", {tableName: 'crm_partner'}, (data) => {
                    this.addLabel = data.list;
                })
            }
        },
        //  获取所有员工
        getAllStaff(){
            if(!this.allStaff.length){
            this.$post("/crm/getAllStaff", {}, (data) => {
                this.allStaff = data.list
            })
            }
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
            this.follow_form.followTime = new Date()
            this.getAllStaff()
            this.getDict()
            this.getContacts()
        },
        //  关闭写跟进模态框
        closeFollowModal(){

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
                    this.follow_form.parentId = this.basicInfo.id
                    this.follow_form.moduleName = "crm_partner"
                    this.follow_form.followTime = this.formatDate(this.follow_form.followTime, "yyyy-MM-dd hh:mm")
                    this.$post("/crm/followPR/addOne", {follow: this.follow_form}, (data) => {
                        this.$message.success("添加成功")
                        this.follows.unshift(data.follow)
                        this.dialogFolowVisible = false
                        this.follow_form = {}
                    })
                }
            });
        },

    /**---------------------------------查看当前合作伙伴参与的线索和机会------------------------------------ */

        look_marketing_clue(){
          this.$post("/crm/partnerDetailPR/queryMarketingClueByPartnerId", {id : this.query.id}, (data) => {
            this.marketingClueList = data.list
          })
        },
        look_opportunity(){
          this.$post("/crm/partnerDetailPR/queryOpportunityByPartnerId", {id : this.query.id}, (data) => {
            this.opportunityList = data.list
          })
        },

    /**----------------------------------------编辑合作伙伴--------------------------------------------------------- */
        //  编辑
        edit(){
            this.activeName = 'first'
            this.isEdit = true
        },
        //  取消编辑
        cancelEdit(){
            this.isEdit = false
            this.$refs.form.resetFields()
        },
        //  保存编辑
        editSave(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$post("/crm/partnerPR/modifyOne", this.formBasicInfo, (data) => {
                        this.$message.success("修改成功！")
                        this.isEdit = false
                        this.basicInfo = this.deepClone(this.formBasicInfo)
                    })
                }
            });
        },
    /**----------------------------------------------删除合作伙伴--------------------------------------------------------- */
        del(){
            this._confirm('确定删除吗?', () => {
                this.$post('/crm/partnerPR/delete', {"list": [this.basicInfo.id]}, (data) => {
                    if(data.message){
                        this.$message.error(data.message)
                    }else{
                        this.$message.success("删除成功！")
                        this.$router.back(-1)
                    }
                })
            })
        },
    /*--------------------------------------------转给他人功能--------------------------------------------*/
        // 打开转给他人弹框
        turnOther(){
            //  如果没有获取所有员工请求员工数据
            this.getAllStaff()
            this.dialogTransferVisible = true
            this.formTransfer = {}
        },
        //  打开转给他人模态框
        openTurnModal(){
            this.staff = ''
            this.formTransfer = {
            checkbox1: false,
            checkbox2: false,
            checkbox3: false,
            }
        },
        // 转给他人确定按钮
        turn_other_sava(){
            if(!this.staff){
                this.$message.error("请选择新拥有者！")
                return
            }
            let params = {
                list: [this.basicInfo.id],
                ownerId: this.staff,
                ifLeft: this.formTransfer.checkbox1 || false
            }
            this.$post("/crm/partnerPR/turnOther", params, (data) => {
                this.dialogTransferVisible = false
                this.$message.success("转移成功！")
                this.$router.back(-1)
            })
        },

    /**-------------------------------------------------获取联系人----------------------------------------- */
        getContacts(){
            this.getContactsAddLabel()
            this.$post("/crm/contactsDetailPR/queryOtherContacts", {id: this.basicInfo.id}, (data) => {
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
            this.isEditContact = false
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
            // this.$refs.contactForm.resetFields();
            this.contactsAdd = {tags: []}
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
                    this.contactsAdd.customerId = this.basicInfo.id
                    let params = new FormData()
                    if(this.isEditContact){
                        params.append('contact_str', JSON.stringify(this.contactsAdd))
                        params.append('parentId', this.query.id)
                        this.$post("/crm/contactsPR/updateContact", params, (data) => {
                            this.$message.success('操作成功！');
                            this.getContacts()
                            this.dialogContactdVisible = false;
                        })
                    }else{
                        params.append('contactsAdd', JSON.stringify(this.contactsAdd))
                        params.append('parentId', this.query.id)
                        this.$post("/crm/contactsPR/addCrmContacts", params, (data) => {
                            this.$message.success('操作成功！');
                            this.getContacts()
                            this.dialogContactdVisible = false;
                        })
                    }
                }
            });
        },
        //  删除联系人
        delContact(index, id){
            this._confirm('确定删除吗?', () => {
                this.$post("/crm/contactsPR/deleteCrmContacts", {"list": [id]}, (data) => {
                    this.$message.success("删除成功")
                    this.contacts_list.splice(index, 1)
                })
            })
        },
        //  编辑联系人
        editContact(index){
            this.isEditContact = true
            this.dialogContactdVisible = true
            this.contactsAdd = this.deepClone(this.contacts_list[index])
        },
    /**------------------------------------------------附件----------------------------------------------------- */
        //  获取附件列表
        getAttachs(){
            this.$post("/crm/getAttachs", {parentId: this.basicInfo.id}, (data) => {
                this.annexList = data.list
            })
        },
        //  删除附件
        delAnnex(id, fileName, index){
            this._confirm('确定删除吗?', () => {
                this.$post("/crm/deleteFile", {ids: [id], moduleName : '合作伙伴', parentId : this.query.id, content : this.basicInfo.name + '删除附件【' + fileName + '】'}, (data) => {
                this.$message.success("删除成功")
                this.annexList.splice(index, 1)
                })
            })
        },
        //  下载附件
        downLoadAnnex(id){
            console.log('下载')
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
            params.append("parentId", this.basicInfo.id)
            params.append("moduleName", '合作伙伴')
            params.append("content", this.basicInfo.name + '上传附件' + content)
            this.$post("/crm/upfile2", params, (data) => {
                this.$message.success("上传成功！")
                this.dialogAnnexVisible = false
                this.getAttachs()
            })
        },
    /**----------------------------------------------------设置团队成员权限-------------------------------------------- */
        //  获取团队成员
        getMembers(){
            this.addMemberInput = ''
            this.dialogSettingsVisible = true
            this.$post("/crm/memberPR/getAll", {"parentId": this.query.id, "moduleName": "crm_partner"}, (data) => {
                this.memberList = data.list
            })
        },
        //  添加团队成员
        addMember(){
            if(this.addMemberInput){
                let params = {
                    parentId: this.basicInfo.id,
                    moduleName: 'crm_partner',
                    userCname: this.addMemberInput.split('/')[0],
                    userId: this.addMemberInput.split('/')[1],
                    userJobNum: this.addMemberInput.split('/')[1],
                    isModify: false,
                    isDownload: false,
                    isOwner: false,
                    moduleNames : '合作伙伴',
                     content : this.basicInfo.name + '添加【' + this.addMemberInput.split('/')[0] + '】为参与人员',
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
            this.$post("/crm/memberPR/delete", {list: [id], moduleName: '合作伙伴', parentId: this.query.id, content : this.basicInfo.name + '删除成员【' + userCname + '】'}, (data) => {
            this.memberList.splice(index, 1)
            this.$message.success("删除团队成员成功！")
            })
        },
        //  修改团队成员权限
        updateMember(flag, index, id, userCname, type){
            let content = ''
            // 编辑
            if (type == 'isModify' && flag == true) {
              content = this.basicInfo.name + '赋予了【' + userCname + '】编辑权限'
            }
            if (type == 'isModify' && flag == false) {
              content = this.basicInfo.name + '取消了【' + userCname + '】编辑权限'
            }
            // 下载
            if (type == 'isDownload' && flag == true) {
              content = this.basicInfo.name + '赋予了【' + userCname + '】下载附件权限'
            }
            if (type == 'isDownload' && flag == false) {
              content = this.basicInfo.name + '取消了【' + userCname + '】下载权限'
            }

            let params = {
            id: id,
            flag: flag,
            type: type,
            moduleName : '合作伙伴',
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
