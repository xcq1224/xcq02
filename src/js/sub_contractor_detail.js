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
                activeName: 'first',            //  tab页签
                subContractor: {},              //  基本信息
                formBasicInfo: {},              //  基本信息表单
                addLabel: [],                   //  信息字段集合
                isEdit: false,                  //  是否编辑
                tableData: [],                  //  表格
                options: regionData,            //  地区

                allStaff: [],                   //  所有员工
                dialogTransferVisible: false,   //  转给他人模态框
                staff: '',                      //  转给他人：员工
                formTransfer: {
                },                              //  转给他人checkbox

/**--------------------------------联系人---------------------------- */
                isEditContact: false,                   //  是否编辑联系人
                contacts_list:[],//联系人集合
                dialogContactdVisible: false,           //  新增联系人模态框
                contactsAddLabel: [],                   //  新增联系人label
                contactsAdd:{tags: []},                 //  联系人新增对象
                imgSrc: '',                             //  联系人头像
                inputVisible: false,                    //  是否显示编辑tag的input框
                inputValue: '',                         //  新增标签input值
                contacts_rules: {
                    name: [
                        { required: true, message: '请输入联系人姓名', trigger: 'blur' },
                    ],
                    mobilePhone: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                    ]
                }, //  新增联系人验证规则
/**---------------------------------------附件-------------------------------------------- */
                dialogAnnexVisible: false,
                annexList: [],                    //  附件列表
                files: [],                        // 上传文件列表
                annexRemarks: '',                 //  备注

                /**---------------------------------查看当前分包商参与的分包合同------------------------------------ */
                subContractorList: [],                            // 分包合同集合

                operateLog :[],                 // 操作日志

            }
        },

/**---------------------------------------------------------------------------------------- */
    activated(){
        this.query = this.$router.currentRoute.query
        this.getBaseInfo()
    },
    methods: {
      // 返回前一个页面
      goBack(){
        this.$router.go(-1)
      },

      //  获取合作伙伴信息和所有字段
      getBaseInfo(){
          this.$post("/crm/subContractorDetailPR/querySubContractorForOne", {id: this.query.id}, (data) => {
              // this.basicInfo = data.subContractor
              this.subContractor = data.subContractor
              this.follows = data.follows
              this.formBasicInfo = this.deepClone(data.subContractor)
          })
          if(!this.addLabel.length){
              this.$post("/crm/extFieldPR/getField", {tableName: 'crm_sub_contractor'}, (data) => {
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
                    this.follow_form.parentId = this.subContractor.id
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

        /**---------------------------------查看当前分包合同------------------------------------ */

        look_opportunity(){
          this.$post("/crm/subContractorDetailPR/contractBySubContractorId", {id : this.query.id}, (data) => {
            this.subContractorList = data.list
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
            // this.$refs.form.resetFields()
            this.formBasicInfo = this.deepClone(this.subContractor)
        },
        //  保存编辑
        editSave(){
            this.$post("/crm/subContractorDetailPR/updateSubContractor", {id : this.query.id, subContractor : this.formBasicInfo}, (data) => {
                this.$message.success("修改成功！")
                this.isEdit = false
                this.subContractor = this.deepClone(this.formBasicInfo)
            })
        },
/**----------------------------------------------删除合作伙伴--------------------------------------------------------- */
        del(){
            this._confirm('确定删除吗?', () => {
                this.$post('/crm/subContractorPR/deleteSubContractor', {"list": [this.subContractor.id]}, (data) => {
                  if(data.message){
                    this.$message.error(data.message)
                  }else{
                    this.$message.success("删除成功！")
                    this.$router.back(-1)
                  }
                })
            })
        },

/**-------------------------------------------------获取联系人----------------------------------------- */
        getContacts(){
            this.getContactsAddLabel()
            this.$post("/crm/contactsDetailPR/queryOtherContacts", {id: this.subContractor.id}, (data) => {
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
                    if(this.isEditContact){
                        this.contactsAdd.customerId = this.subContractor.id
                        this.contactsAdd.customerName = this.subContractor.name
                        let params = new FormData()
                        params.append('avatar', this.imgSrc)
                        params.append('contact_str', JSON.stringify(this.contactsAdd))
                        params.append('parentId', this.query.id)
                        this.$post("/crm/contactsPR/updateContact", params, (data) => {
                            this.$message.success('操作成功！');
                            this.getContacts()
                            this.dialogContactdVisible = false;
                        })
                    }else{
                        this.contactsAdd.customerId = this.subContractor.id
                        this.contactsAdd.customerName = this.subContractor.name
                        let params = new FormData()
                        params.append('avatar', this.imgSrc)
                        params.append('contactsAdd', JSON.stringify(this.contactsAdd))
                        params.append('parentId', this.query.id)
                            this.$post("/crm/contactsPR/addCrmContacts", params, (data) => {
                            this.$message.success('操作成功！');
                            this.getContacts()
                            this.dialogContactdVisible = false;
                            this.activeName = 'second'
                        })
                    }
                }
            });
        },
        //  删除联系人
        delContact(index, id){
            this._confirm('确定删除吗?', () => {
                this.$post("/crm/contactsPR/deleteCrmContacts", {"list": [id], parentId : this.query.id}, (data) => {
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
            this.$post("/crm/getAttachs", {parentId: this.subContractor.id}, (data) => {
                this.annexList = data.list
            })
        },
        //  删除附件
        delAnnex(id, fileName, index){
            this._confirm('确定删除吗?', () => {
                this.$post("/crm/deleteFile", {ids: [id], moduleName : '分包商', parentId : this.query.id, content : this.subContractor.name + '删除附件【' + fileName + '】'}, (data) => {
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
            params.append("parentId", this.subContractor.id)
            params.append("moduleName", '营销线索')
            params.append("content", this.subContractor.name + '上传附件' + content)
            this.$post("/crm/upfile2", params, (data) => {
                this.$message.success("上传成功！")
                this.dialogAnnexVisible = false
                this.getAttachs()
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
