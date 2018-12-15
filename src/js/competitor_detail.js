import {regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
    export default {
        data() {
            return {
                query: {},                      //  页面传递参数
                isOwner: false,                 //  是否是拥有者
                activeName: 'first',            //  tab页签
                basicInfo: {},              //  基本信息
                addLabel: [],               //  信息字段集合
                isEdit: false,                  //  是否编辑
                tableData: [],                  //  表格
                options: regionData,            //  地区
                logs: [],                       //  日志
/**---------------------------------------附件-------------------------------------------- */
                dialogAnnexVisible: false,
                annexList: [],    //  附件列表
                files: [], // 上传文件列表
                annexRemarks: '',       //  备注

                /**---------------------------------查看当前合作伙伴参与的线索------------------------------------ */
                opportunityList: [],                            // 机会集合


            }
        },




        activated(){
            this.query = this.$router.currentRoute.query
            this.getBaseInfo()
        },
        methods: {
            //  获取竞争对手信息和所有字段
            getBaseInfo(){
                this.$post("/crm/competitorDetailPR/queryCompetitorForOne", {id: this.query.id}, (data) => {
                    this.basicInfo = data.basicInfo
                    this.isOwner = data.isOwner
                })
                if(!this.addLabel.length){
                    this.$post("/crm/extFieldPR/getField", {tableName: 'crm_competitor'}, (data) => {
                        this.addLabel = data.list;
                    })
                }
            },

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
                this.$post("/crm/competitorPR/modifyOne", this.basicInfo, (data) => {
                    this.$message.success("修改成功！")
                    this.isEdit = false
                })
            },
            //  删除
            del(){
                this._confirm('确定删除吗?', () => {
                    this.$post('/crm/competitorPR/delete', {"list": [this.basicInfo.id]}, (data) => {
                        if(data.message){
                            this.$message.error(data.message)
                        }else{
                            this.$message.success("删除成功！")
                            this.$router.back(-1)
                        }
                    })
                })
            },

            /**---------------------------------查看当前合作伙伴参与的线索------------------------------------ */
            look_opportunity(){
              this.$post("/crm/competitorDetailPR/queryOpportunityByCompetitorId", {id : this.query.id}, (data) => {
                this.opportunityList = data.list
              })
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
                    this.$post("/crm/deleteFile", {ids: [id], moduleName : '竞争对手', parentId : this.query.id, content : this.basicInfo.name + '删除附件【' + fileName + '】'}, (data) => {
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
                params.append("moduleName", '竞争对手')
                params.append("content", this.basicInfo.name + '上传附件' + content)
                this.$post("/crm/upfile2", params, (data) => {
                    this.$message.success("上传成功！")
                    this.dialogAnnexVisible = false
                    this.getAttachs()
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
