import { mapState, mapActions, mapMutations } from 'vuex'
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
        return {
            query: {},                                      //  页面传递参数
            contact: {},                                    //  联系人信息
            isEdit: false, // 是否编辑
            isModify: false,        //  是否有编辑权限
            isOwner: false,        //  是否是拥有者
            customerName: '',       //  客户名
            imgSrc: '', //  联系人头像
            inputVisible: false,    //
            inputValue: '',         //  新增标签input值
            contactsAddLabel: [],   //  新增联系人label
            contactsAdd:{},         //  联系人编辑信息
            contacts_rules: {
                name: [
                  { required: true, validator: this.isNull, trigger: 'blur' }
                ],
                mobilePhone: [
                  { required: true, validator: this.isNull, trigger: 'blur' }
                ]
            }, //  新增联系人验证规则

            otherContacts: [],          //  公司其他联系人
            opportunityList: [],            //  机会
            /**---------------------------------添加关联信息---------------------------------- */
            relationShipList: [],   //  关联人列表
            relation: '',           //  关联人关系
            relationList: [],     //  关系类型
            relationship: {tags: []},                                   //  添加关联信息人
            relationImgSrc: '',                                 //  添加关联人的头像
            hideList: ['business', 'dept',  'job', 'customerName'],             //  联系人有但关联联系人没有的字段
            relationInputVisible: false,    //
            relationInputValue: '',         //  新增标签input值

            activeName: 'first',                            //  标签页
            dynamicTags: [],        //  tag标签集合
            is_show: true,                                  //  跟进进度样式显示
            options: regionData,                            //  地区总数据
            selectedOptions: [],                            //  地区结果
            tableData1: [],                                 //  机会表格数据
            tableData2: [],                                 //  合同表格数据
            tableData3: [{name: 123,address: 123}],         //  附件表格数据
            tableData4: [],                                 //  操作日志
            dialogRelateInfoVisible: false,                   //  添加关联信息模态框
            dialogChanceVisible: false,                     //  添加机会模态框
            dialogTransferVisible: false,                         //  转移给他人模态框
            editVisible: false,                         //  编辑客戶
            dialogFolowVisible: false,                      //  写跟进模态框

            chanceForm: {},                                  //  关联信息表单
            transferForm: {},                                  //  关联信息表单
            tagVisible: false,  //  编辑tag显示
            tagValue: '',        //  编辑tag的值
            isEditRelationShip: false,      //  是否编辑关联人信息

            logs: [],           //  日志
        }
    },
    mounted() {
        this.getDict()
    },
    activated(){
        this.query = this.$router.currentRoute.query
        this.getContact()
    },
    methods: {
        //  获取联系人信息和所有联系人字段
        getContact(){
            this.$post("/crm/contactsDetailPR/queryContactsForOne", {id: this.query.id}, (data) => {
                this.contact = data.contact
                this.customerName = data.customerName
                this.isModify = data.isModify
                this.isOwner = data.isOwner
                this.contactsAdd = this.deepClone(data.contact)
                this.contactsAdd = this.deepClone(data.contact)
            })
            this.$post("/crm/extFieldPR/getField", {tableName: 'crm_contacts'}, (data) => {
                this.contactsAddLabel = data.list;
            })
        },
        //  打开input file
        chooseImg(){
            this.$refs.uploadInput.click()
        },
        //  选择图片
        pictureChange(e){
            if(e.target.files.length) this.imgSrc = e.target.files[0]
        },
        //  删除标签
        deleteTag(tag) {
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
        //  编辑联系人
        editCustomer(){
            this.activeName = 'first'
            this.isEdit = true
        },
        //  取消编辑
        cancelEdit(){
            this.isEdit = false
            this.contactsAdd = this.deepClone(this.contact)
        },
        //  保存编辑
        contactSave(){
            this.$refs.contactsAdd.validate((valid) => {
                if (valid) {
                    let params = new FormData()
                    params.append("contact_str", JSON.stringify(this.contactsAdd))
                    params.append("parentId", this.query.id)
                    this.$post("/crm/contactsPR/updateContact", params, (data) => {
                        this.$message.success("修改成功！")
                        this.isEdit = false
                        this.contact = this.deepClone(this.contactsAdd)
                    })
                }
            });
        },
    /**-----------------------------公司其他联系人------------------------------------ */
        getOtherContacts(){
            this.$post("/crm/contactsDetailPR/queryOtherContacts", {id: this.contact.customerId}, (data) => {
                this.otherContacts = []
                data.list.map((item) => {
                    if(item.id != this.contact.id){
                        this.otherContacts.push(item)
                    }
                })
            })
        },

    /**----------------------------------------添加关联人----------------------------------- */
        //  获取数据字典
        getDict(){
            let list = ["crm-lxrgx"]
            this.$post("/crm/getDict", {"list": list}, (data) => {
            this.relationList = data['crm-lxrgx']
            })
        },
        //  打开关联人input file
        chooseRelationImg(){
            this.$refs.relationInput.click()
        },
        //  选择关联人头像
        relationImgChange(e){
            if(e.target.files.length) this.relationImgSrc = e.target.files[0]
        },
        //  删除标签
        relationDeleteTag(tag) {
            this.relationship.tags.splice(this.relationship.tags.indexOf(tag), 1);
        },
        //  显示添加tag input
        relationShowInput() {
            this.relationInputVisible = true;
            this.$nextTick(_ => {
                this.$refs.relationSaveTagInput.$refs.input.focus();
            });
        },
        //  添加标签
        relationHandleInputConfirm() {
            let inputValue = this.relationInputValue;
            if (inputValue) {
                this.relationship.tags.push(inputValue);
            }
            this.relationInputVisible = false;
            this.relationInputValue = '';
        },
        //  添加关联人
        relationShipAdd(){
            if(!this.relation){
                this.$message.error({ message: '请选择与联系人关系'});
                return
            }
            this.$refs.relationship.validate((valid) => {
                if (valid) {
                    if(this.isEditRelationShip){
                        let params = new FormData()
                        params.append("relation", this.relation)
                        params.append("relationShipId", this.relationship.relationShipId)
                        delete this.relationship.relation
                        delete this.relationship.relationShipId
                        params.append("contact_str", JSON.stringify(this.relationship))
                        params.append("parentId", this.query.id)
                        this.$post("/crm/contactsPR/updateContact", params, (data) => {
                            this.$notify.success({ message: '操作成功！'});
                            this.dialogRelateInfoVisible = false
                            this.getContactRelation()
                        })
                    }else{
                        let params = new FormData()
                        params.append('avatar', this.relationImgSrc)
                        //  当前联系人id
                        params.append('id', this.query.id)
                        params.append('relation', this.relation)
                        params.append('relationship', JSON.stringify(this.relationship))
                        this.$post("/crm/contactsDetailPR/addContactRelation", params, (data) => {
                            this.$notify.success({ message: '操作成功！'});
                            this.dialogRelateInfoVisible = false
                            this.getContactRelation()
                        })
                    }
                }
            });
        },
        //  取消添加关联人
        closeRelationModal(){
            // this.$refs.relationship.resetFields()
            this.relationship = {tags: []}                  //  还原表单
            this.relation = ''                              //  清空关系
            this.relationImgSrc = ''                        //  清空上传图片
            this.relationship.tags = []                     //  清空标签
            this.$refs.relationInput.value = ''             //  清空上传图片input
            this.isEditRelationShip = false            //  编辑为false
        },

    /**--------------------------------相关联系人--------------------------------------- */
        //  获取相关联系人
        getContactRelation(){
            this.$post("/crm/contactsDetailPR/queryContactRelation", {id: this.contact.id}, (data) => {
                this.relationShipList = data.list
            })
        },
        //  删除相关联系人
        delContactRelation(index, id, relationShipId, name){
            this._confirm('确定删除吗?', () => {
                let params = {
                    id: id,
                    bId: this.contact.id,
                    relationShipId: relationShipId,
                    name: name
                }
                this.$post("/crm/contactsDetailPR/delContactRelation", params, (data) => {
                    this.$message.success("删除成功")
                    this.relationShipList.splice(index, 1)
                })
            })
        },
        //  编辑相关联系人
        editContactRelation(index){
            this.isEditRelationShip = true
            this.dialogRelateInfoVisible = true
            this.relationship = this.deepClone(this.relationShipList[index])
            this.relation = this.relationship.relation
        },
    /************************************获取机会**************************************** */
        getContactOppo(){
            this.$post("/crm/opportunityDetailPR/getContactOppo", {id: this.contact.id}, (data) => {
                this.opportunityList = data.list
            })
        },

        //  头部删除操作
        delContact(){
            this._confirm('确定删除吗?', () => {
                this.$post('/crm/contactsPR/deleteCrmContacts', {"list": [this.contact.id]}, (data) => {
                    if(data.message){
                        this.$message.error(data.message)
                    }else{
                        this.$message.success("删除成功！")
                        this.$router.back(-1)
                    }
                })
            })
            // const h = this.$createElement;
            // this.$msgbox({
            //     title: '提示',
            //     message: h('div', {style: 'width: 400px'}, [
            //         h('p', null, '确定要删除【客户名称】吗？'),
            //         h('p', null, '删除成功后，只能在回收站内恢复。')
            //     ]),
            //     showCancelButton: true,
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            // }).then(action => {
            //     console.log(2)
            // }).catch(()=>{});
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
