webpackJsonp([38],{AcQB:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=a("mvHQ"),o=a.n(l),s=a("Wxq9"),i={data:function(){var t=this;return{query:{},activeName:"first",basicInfo:{},formBasicInfo:{},addLabel:[],isEdit:!1,tableData:[],options:s.regionData,allStaff:[],dialogTransferVisible:!1,staff:"",formTransfer:{},isEditContact:!1,contacts_list:[],dialogContactdVisible:!1,contactsAddLabel:[],contactsAdd:{tags:[]},imgSrc:"",inputVisible:!1,inputValue:"",contacts_rules:{name:[{required:!0,message:"请输入联系人姓名",trigger:"blur"}],mobilePhone:[{required:!0,message:"请输入手机号",trigger:"blur"},{validator:function(t,e,a){/^1[0-9]{10}$/.test(e)?a():a(new Error("手机号错误!"))},trigger:"blur"}]},dialogAnnexVisible:!1,annexList:[],files:[],annexRemarks:"",follows:[],follow_type_list:[],follow_status_list:[],contact_list:[],followRules:{followType:[{required:!0,message:"请选择跟进方式",trigger:"change"}],followTime:[{type:"date",required:!0,message:"请选择跟进时间",trigger:"change"}],followContent:[{required:!0,message:"请填写跟进内容",trigger:"blur"}],followStatus:[{required:!0,message:"请选择跟进状态",trigger:"change"}],contactCname:[{validator:function(e,a,l){"到访"==t.follow_form.followType&!a?l(new Error("跟进方式为到访时请填写拜访人")):l()},trigger:"change"}]},follow_form:{},dialogFolowVisible:!1}},activated:function(){this.query=this.$router.currentRoute.query,this.getBaseInfo()},methods:{getBaseInfo:function(){var t=this;this.$post("/crm/partnerDetailPR/queryPartnerForOne",{id:this.query.id},function(e){t.basicInfo=e.basicInfo,t.follows=e.follows,t.formBasicInfo=t.deepClone(e.basicInfo)}),this.addLabel.length||this.$post("/crm/extFieldPR/getField",{tableName:"crm_partner"},function(e){t.addLabel=e.list})},getAllStaff:function(){var t=this;this.allStaff.length||this.$post("/crm/getAllStaff",{},function(e){t.allStaff=e.list})},getDict:function(){var t=this;this.follow_type_list.length||this.$post("/crm/getDict",{list:["CRM-GJFS","CRM-KH-GJZT"]},function(e){t.follow_type_list=e["CRM-GJFS"],t.follow_status_list=e["CRM-KH-GJZT"]})},showDate:function(t){if(t>0&&this.formatDate(new Date(this.follows[t-1].followTime))==this.formatDate(new Date(this.follows[t].followTime)))return!1;return!0},openFollowModal:function(){this.follow_form.followTime=new Date,this.getAllStaff(),this.getDict(),this.getContacts()},closeFollowModal:function(){},followSave:function(){var t=this;this.$refs.follow_form.validate(function(e){e&&(t.follow_form.contactCname&&(t.follow_form.contactId=t.follow_form.contactCname.split("/")[0],t.follow_form.contactCname=t.follow_form.contactCname.split("/")[1]),t.follow_form.copyToUserCname&&(t.follow_form.copyToUserId=t.follow_form.copyToUserCname.split("/")[0],t.follow_form.copyToUserCname=t.follow_form.copyToUserCname.split("/")[1]),t.follow_form.parentId=t.basicInfo.id,t.follow_form.moduleName="crm_partner",console.log(t.follow_form))})},edit:function(){this.activeName="first",this.isEdit=!0},cancelEdit:function(){this.isEdit=!1,this.$refs.form.resetFields()},editSave:function(){var t=this;this.$post("/crm/partnerPR/modifyOne",this.formBasicInfo,function(e){t.$message.success("修改成功！"),t.isEdit=!1,t.basicInfo=t.deepClone(t.formBasicInfo)})},del:function(){var t=this;this._confirm("确定删除吗?",function(){t.$post("/crm/partnerPR/delete",{list:[t.basicInfo.id]},function(e){t.$message.success("删除成功！"),t.$router.back(-1)})})},turnOther:function(){this.getAllStaff(),this.staff="",this.dialogTransferVisible=!0,this.formTransfer={}},turn_other_sava:function(){var t=this;if(this.staff){var e={list:[this.basicInfo.id],ownerId:this.staff,ifLeft:this.formTransfer.checkbox1||!1};this.$post("/crm/partnerPR/turnOther",e,function(e){t.dialogTransferVisible=!1,t.$message.success("转移成功！"),t.$router.back(-1)})}else this.$message.error("请选择新拥有者！")},getContacts:function(){var t=this;this.getContactsAddLabel(),this.$post("/crm/contactsDetailPR/queryOtherContacts",{id:this.basicInfo.id},function(e){t.contacts_list=e.list})},getContactsAddLabel:function(){var t=this;this.contactsAddLabel.length||this.$post("/crm/extFieldPR/getField",{tableName:"crm_contacts"},function(e){t.contactsAddLabel=e.list})},addContat:function(){this.dialogContactdVisible=!0},openContactModal:function(){this.getContactsAddLabel()},closeContactModal:function(){this.imgSrc="",this.$refs.uploadInput.value="",this.contactsAdd={tags:[]}},chooseImg:function(){this.$refs.uploadInput.click()},pictureChange:function(t){t.target.files.length&&(this.imgSrc=t.target.files[0])},handleClose:function(t){this.contactsAdd.tags.splice(this.contactsAdd.tags.indexOf(t),1)},showInput:function(){var t=this;this.inputVisible=!0,this.$nextTick(function(e){t.$refs.saveTagInput.$refs.input.focus()})},handleInputConfirm:function(){var t=this.inputValue;t&&this.contactsAdd.tags.push(t),this.inputVisible=!1,this.inputValue=""},contactsSave:function(){var t=this;this.$refs.contactForm.validate(function(e){if(e)if(t.isEditContact){t.contactsAdd.customerId=t.basicInfo.id,t.contactsAdd.customerName=t.basicInfo.name;var a=new FormData;a.append("avatar",t.imgSrc),a.append("contact_str",o()(t.contactsAdd)),t.$post("/crm/contactsPR/updateContact",a,function(e){t.$message.success("操作成功！"),t.getContacts(),t.dialogContactdVisible=!1})}else{t.contactsAdd.customerId=t.basicInfo.id,t.contactsAdd.customerName=t.basicInfo.name;var l=new FormData;l.append("avatar",t.imgSrc),l.append("contactsAdd",o()(t.contactsAdd)),t.$post("/crm/contactsPR/addCrmContacts",l,function(e){t.$message.success("操作成功！"),t.getContacts(),t.dialogContactdVisible=!1})}})},delContact:function(t,e){var a=this;this._confirm("确定删除吗?",function(){a.$post("/crm/contactsPR/deleteCrmContacts",{list:[e]},function(e){a.$message.success("删除成功"),a.contacts_list.splice(t,1)})})},editContact:function(t){this.isEditContact=!0,this.dialogContactdVisible=!0,this.contactsAdd=this.deepClone(this.contacts_list[t])},getAttachs:function(){var t=this;this.$post("/crm/getAttachs",{parentId:this.basicInfo.id},function(e){t.annexList=e.list})},delAnnex:function(t,e){var a=this;this._confirm("确定删除吗?",function(){a.$post("/crm/deleteFile",{ids:[t]},function(t){a.$message.success("删除成功"),a.annexList.splice(e,1)})})},downLoadAnnex:function(t){console.log("下载")},closeAnnexModal:function(){this.annexRemarks="",this.files=[]},chooseAnnex:function(){this.$refs.annexInput.click()},changeFile:function(t){for(var e=this.$refs.annexInput.files,a=0;a<e.length;a++)this.files.push(e[a]);this.$refs.annexInput.value=""},delFile:function(t){this.files.splice(t,1)},annexSave:function(){var t=this;if(this.files.length){var e=new FormData;this.files.map(function(t,a){e.append("file"+a,t)}),e.append("remark",this.annexRemarks),e.append("parentId",this.basicInfo.id),this.$post("/crm/upfile2",e,function(e){t.$message.success("上传成功！"),t.dialogAnnexVisible=!1,t.getAttachs()})}else this.$message.error("请选择上传文件！")}}},n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"wrap"},[a("div",{staticClass:"handle-box"},[a("div",{staticClass:"header-top"},[a("span",{staticClass:"header-name"},[t._v(t._s(t.basicInfo.name)+" "),a("i",{staticClass:"iconfont icon-yduidunpaikongxin"})]),t._v(" "),a("span",[t._v("  跟进状态："+t._s(t.basicInfo.followStatus))]),t._v(" "),a("span",[t._v("  拥有者："+t._s(t.basicInfo.ownerCname))]),t._v(" "),a("span",[t._v("  参与成员： "),a("i",{staticClass:"iconfont icon-shezhi",on:{click:function(t){}}})])]),t._v(" "),a("el-row",[a("el-button",{attrs:{type:"primary",size:"mini"},nativeOn:{click:function(e){return t.goBack(e)}}},[t._v("返回")]),t._v(" "),a("el-button",{attrs:{type:"primary",size:"mini"},nativeOn:{click:function(e){return t.addContat(e)}}},[t._v("添加联系人")]),t._v(" "),a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.turnOther}},[t._v("转给他人")]),t._v(" "),a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.edit}},[t._v("编辑")]),t._v(" "),a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.del}},[t._v("删除")])],1)],1),t._v(" "),a("div",{staticStyle:{height:"20px",background:"#fafafa"}}),t._v(" "),a("div",{staticClass:"main"},[a("el-tabs",{model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},[a("el-tab-pane",{attrs:{name:"first"}},[a("span",{staticClass:"tab-item",attrs:{slot:"label"},slot:"label"},[t._v("基本信息")]),t._v(" "),a("div",{staticClass:"first"},[a("div",{staticClass:"first-left-box"},[a("div",{staticClass:"first-left"},[a("div",{staticClass:"title"},[t._v("基本信息")]),t._v(" "),a("p",{directives:[{name:"show",rawName:"v-show",value:t.isEdit,expression:"isEdit"}],staticStyle:{margin:"20px 20px 10px"}},[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.editSave}},[t._v("保存")]),t._v(" "),a("el-button",{attrs:{type:"info",size:"mini"},on:{click:t.cancelEdit}},[t._v("取消")])],1),t._v(" "),a("el-form",{ref:"form",staticClass:"form",attrs:{inline:!0,model:t.formBasicInfo,"label-position":"left","label-width":"120px",size:"small"}},t._l(t.addLabel,function(e,l){return a("el-form-item",{key:l,attrs:{label:e.label,prop:e.name}},["text"==e.editorType?a("el-input",{attrs:{type:"textarea",resize:"none",autosize:"",disabled:!t.isEdit||"name"==e.name,prop:e.name},model:{value:t.formBasicInfo[e.name],callback:function(a){t.$set(t.formBasicInfo,e.name,a)},expression:"formBasicInfo[item.name]"}}):t._e(),t._v(" "),"date"==e.editorType?a("el-date-picker",{attrs:{disabled:!t.isEdit,"value-format":"yyyy-MM-dd HH:mm",format:"yyyy-MM-dd HH:mm",type:"datetime",placeholder:"选择日期时间"},model:{value:t.formBasicInfo[e.name],callback:function(a){t.$set(t.formBasicInfo,e.name,a)},expression:"formBasicInfo[item.name]"}}):t._e(),t._v(" "),"dict"==e.editorType?a("el-select",{attrs:{disabled:!t.isEdit},model:{value:t.formBasicInfo[e.name],callback:function(a){t.$set(t.formBasicInfo,e.name,a)},expression:"formBasicInfo[item.name]"}},t._l(e.selectList,function(l){return"dict"==e.editorType?a("el-option",{key:l,attrs:{label:l,value:l}}):t._e()})):t._e(),t._v(" "),"cascade"==e.editorType?a("el-cascader",{attrs:{disabled:!t.isEdit,size:"small",options:t.cityData()},model:{value:t.formBasicInfo[e.name],callback:function(a){t.$set(t.formBasicInfo,e.name,a)},expression:"formBasicInfo[item.name]"}}):t._e()],1)}))],1)]),t._v(" "),a("div",{staticClass:"first-right"},[a("div",{staticClass:"title"},[t._v("销售动态\n                            "),a("el-button",{staticStyle:{float:"right","margin-top":"6px"},attrs:{type:"primary",size:"mini"},on:{click:function(e){t.dialogFolowVisible=!0}}},[t._v("写跟进")])],1),t._v(" "),a("div",{staticClass:"process"},[t._l(t.follows,function(e,l){return[a("div",{directives:[{name:"show",rawName:"v-show",value:t.showDate(l),expression:"showDate(index)"}],staticClass:"el-popover el-popper tooltip iconfont date",attrs:{"x-placement":"right-start"}},[a("div",{staticClass:"el-popover__title"},[t._v(t._s(t.formatDate(new Date(e.followTime))))]),t._v(" "),a("div",{staticClass:"popper__arrow",staticStyle:{top:"12.5px","border-right-color":"#0090ff"},attrs:{"x-arrow":""}})]),t._v(" "),a("div",{staticClass:"el-popover el-popper tooltip iconfont",attrs:{"x-placement":"right-start"}},[a("div",{staticClass:"el-popover__title"},[t._v(t._s(e.createUserCname)),a("span",{staticClass:"right"},[t._v(t._s(t.formatDate(new Date(e.followTime),"hh:mm")))])]),t._v(" "),a("div",{staticClass:"follow-content"},[t._v(t._s(e.followContent))]),t._v(" "),a("p",[t._v("跟进方式："+t._s(e.followType))]),t._v(" "),a("p",[t._v("跟进状态："+t._s(e.followStatus))]),t._v(" "),e.contactCname?a("p",[t._v("联系人："+t._s(e.contactCname))]):t._e(),t._v(" "),a("div",{staticClass:"popper__arrow",staticStyle:{top:"12.5px"},attrs:{"x-arrow":""}})])]})],2)])])]),t._v(" "),a("el-tab-pane",{attrs:{name:"second"}},[a("span",{staticClass:"tab-item",attrs:{slot:"label"},on:{click:t.getContacts},slot:"label"},[t._v("联系人")]),t._v(" "),a("div",{staticClass:"second"},t._l(t.contacts_list,function(e,l){return a("el-card",{key:l,staticClass:"box-card"},[a("div",[a("span",{staticClass:"del",on:{click:function(a){t.delContact(l,e.id)}}},[t._v("×")]),t._v(" "),a("span",{staticClass:"edit",on:{click:function(a){t.editContact(l,e.id)}}},[t._v("编辑")]),t._v(" "),t._l(t.contactsAddLabel,function(l,o){return a("p",{key:o},[a("span",{staticClass:"label"},[t._v(t._s(l.label)+"：")]),a("span",{staticClass:"content"},[t._v(t._s(e[l.name]))])])}),t._v(" "),a("p",[a("span",{staticClass:"label"},[t._v("标签：")]),t._v(" "),a("font",{staticClass:"content"},t._l(e.tags,function(e){return a("el-tag",{key:e,attrs:{"disable-transitions":!1}},[t._v("\n                                        "+t._s(e)+"\n                                    ")])}))],1)],2)])}))]),t._v(" "),a("el-tab-pane",{attrs:{name:"third"}},[a("span",{staticClass:"tab-item",attrs:{slot:"label"},slot:"label"},[t._v("线索")]),t._v(" "),a("div",{staticClass:"third"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,"max-height":"500",border:"","row-style":{"text-align":"center",color:"#333"},"header-cell-style":{"text-align":"center",background:"#f2f2f2","border-color":"#fff",color:"#333"}}},[a("el-table-column",{attrs:{prop:"date",label:"线索名称"}}),t._v(" "),a("el-table-column",{attrs:{prop:"name",label:"线索来源"}}),t._v(" "),a("el-table-column",{attrs:{prop:"address",label:"联系方式"}}),t._v(" "),a("el-table-column",{attrs:{prop:"address",label:"备注"}}),t._v(" "),a("el-table-column",{attrs:{prop:"address",label:"创建时间"}})],1)],1)]),t._v(" "),a("el-tab-pane",{attrs:{name:"fourth"}},[a("span",{staticClass:"tab-item",attrs:{slot:"label"},slot:"label"},[t._v("机会")]),t._v(" "),a("div",{staticClass:"fourth"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,"max-height":"500",border:"","row-style":{"text-align":"center",color:"#333"},"header-cell-style":{"text-align":"center",background:"#f2f2f2","border-color":"#fff",color:"#333"}}},[a("el-table-column",{attrs:{prop:"date",label:"机会名称"}}),t._v(" "),a("el-table-column",{attrs:{prop:"name",label:"预计营销金额"}}),t._v(" "),a("el-table-column",{attrs:{prop:"address",label:"营销阶段"}}),t._v(" "),a("el-table-column",{attrs:{prop:"address",label:"赢单率"}}),t._v(" "),a("el-table-column",{attrs:{prop:"address",label:"备注"}}),t._v(" "),a("el-table-column",{attrs:{prop:"address",label:"创建时间"}})],1)],1)]),t._v(" "),a("el-tab-pane",{attrs:{name:"fifth"}},[a("span",{staticClass:"tab-item",attrs:{slot:"label"},on:{click:t.getAttachs},slot:"label"},[t._v("附件")]),t._v(" "),a("div",{staticClass:"fifth"},[a("el-button",{staticStyle:{"margin-bottom":"10px"},attrs:{type:"primary",size:"small"},on:{click:function(e){t.dialogAnnexVisible=!0}}},[t._v("上传附件")]),t._v(" "),a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.annexList,"max-height":"500",border:"","row-style":{"text-align":"center",color:"#333"},"header-cell-style":{"text-align":"center",background:"#f2f2f2","border-color":"#fff",color:"#333"}}},[a("el-table-column",{attrs:{prop:"fileName",label:"附件名称",width:"180"}}),t._v(" "),a("el-table-column",{attrs:{prop:"fileSizeStr",label:"大小",width:"180"}}),t._v(" "),a("el-table-column",{attrs:{prop:"remark",label:"备注"}}),t._v(" "),a("el-table-column",{attrs:{prop:"upUserCname",label:"上传人"}}),t._v(" "),a("el-table-column",{attrs:{label:"创建时间"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n                                "+t._s(t.formatDate(new Date(e.row.upTime),"yyyy-MM-dd hh:mm:ss"))+"\n                            ")]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("a",{staticClass:"operating",on:{click:function(a){t.downLoadAnnex(e.row.id)}}},[t._v("下载")]),t._v(" "),a("a",{staticClass:"operating",on:{click:function(a){t.delAnnex(e.row.id,e.$index)}}},[t._v("删除")])]}}])})],1)],1)]),t._v(" "),a("el-tab-pane",{attrs:{name:"sixth"}},[a("span",{staticClass:"tab-item",attrs:{slot:"label"},slot:"label"},[t._v("操作日志")]),t._v(" "),a("div",{staticClass:"sixth"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,"max-height":"500",border:"","row-style":{"text-align":"center",color:"#333"},"header-cell-style":{"text-align":"center",background:"#f2f2f2","border-color":"#fff",color:"#333"}}},[a("el-table-column",{attrs:{prop:"date",label:"操作时间"}}),t._v(" "),a("el-table-column",{attrs:{prop:"name",label:"操作人"}}),t._v(" "),a("el-table-column",{attrs:{prop:"address",label:"操作类型"}}),t._v(" "),a("el-table-column",{attrs:{prop:"address",label:"备注"}})],1)],1)])],1)],1),t._v(" "),a("el-dialog",{attrs:{title:"转给他人",width:"40%",visible:t.dialogTransferVisible,"close-on-click-modal":!1},on:{"update:visible":function(e){t.dialogTransferVisible=e}}},[a("el-form",{attrs:{model:t.formTransfer,"label-width":"120px",size:"small"}},[a("el-form-item",{attrs:{label:"新拥有者"}},[a("el-form-item",[a("el-select",{attrs:{size:"small",filterable:"",clearable:"",placeholder:"请输入员工姓名或工号"},model:{value:t.staff,callback:function(e){t.staff=e},expression:"staff"}},t._l(t.allStaff,function(e){return a("el-option",{key:e.userName,attrs:{label:e.cname+"  "+e.userName,value:e.userName}},[a("span",{staticStyle:{float:"left"}},[t._v(t._s(e.cname))]),t._v(" "),a("span",{staticStyle:{float:"right",color:"#8492a6","font-size":"13px"}},[t._v(t._s(e.userName))])])}))],1),t._v(" "),a("el-checkbox",{model:{value:t.formTransfer.checkbox1,callback:function(e){t.$set(t.formTransfer,"checkbox1",e)},expression:"formTransfer.checkbox1"}},[t._v("保留原拥有者为团队成员")])],1),t._v(" "),a("el-form-item",{attrs:{label:"转移相关业务"}},[a("el-checkbox",{model:{value:t.formTransfer.checkbox2,callback:function(e){t.$set(t.formTransfer,"checkbox2",e)},expression:"formTransfer.checkbox2"}},[t._v("线索")]),t._v(" "),a("el-checkbox",{model:{value:t.formTransfer.checkbox3,callback:function(e){t.$set(t.formTransfer,"checkbox3",e)},expression:"formTransfer.checkbox3"}},[t._v("机会")])],1)],1),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.dialogTransferVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:t.turn_other_sava}},[t._v("确 定")])],1)],1),t._v(" "),a("el-dialog",{staticClass:"dialogAdd",attrs:{title:"新增联系人",width:"600px",visible:t.dialogContactdVisible,"close-on-click-modal":!1},on:{"update:visible":function(e){t.dialogContactdVisible=e},open:t.openContactModal,close:t.closeContactModal}},[a("el-form",{ref:"contactForm",attrs:{model:t.contactsAdd,rules:t.contacts_rules,"label-position":"left","label-width":"120px",size:"small"}},[a("el-form-item",{attrs:{label:"照片"}},[a("div",{staticClass:"upload-box",on:{click:t.chooseImg}},[a("i",{directives:[{name:"show",rawName:"v-show",value:!t.imgSrc,expression:"!imgSrc"}],staticClass:"el-icon-plus"}),t._v(" "),a("img",{directives:[{name:"show",rawName:"v-show",value:t.imgSrc,expression:"imgSrc"}],attrs:{src:t.getUrl(t.imgSrc),alt:""}}),t._v(" "),a("input",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],ref:"uploadInput",attrs:{type:"file",accept:"image/*"},on:{change:t.pictureChange}})])]),t._v(" "),t._l(t.contactsAddLabel,function(e,l){return a("el-form-item",{key:l,attrs:{prop:e.name,label:e.label}},["text"==e.editorType?a("el-input",{model:{value:t.contactsAdd[e.name],callback:function(a){t.$set(t.contactsAdd,e.name,a)},expression:"contactsAdd[item.name]"}}):t._e(),t._v(" "),"date"==e.editorType?a("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",type:"date",placeholder:"选择日期"},model:{value:t.contactsAdd[e.name],callback:function(a){t.$set(t.contactsAdd,e.name,a)},expression:"contactsAdd[item.name]"}}):t._e(),t._v(" "),"dict"==e.editorType?a("el-select",{model:{value:t.contactsAdd[e.name],callback:function(a){t.$set(t.contactsAdd,e.name,a)},expression:"contactsAdd[item.name]"}},t._l(e.selectList,function(l){return"dict"==e.editorType?a("el-option",{key:l,attrs:{label:l,value:l}}):t._e()})):t._e()],1)}),t._v(" "),a("el-form-item",{attrs:{label:"标签"}},[t._l(t.contactsAdd.tags,function(e){return a("el-tag",{key:e,attrs:{closable:"","disable-transitions":!1},on:{close:function(a){t.handleClose(e)}}},[t._v("\n                "+t._s(e)+"\n            ")])}),t._v(" "),t.inputVisible?a("el-input",{ref:"saveTagInput",staticClass:"input-new-tag",attrs:{size:"small"},on:{blur:t.handleInputConfirm},nativeOn:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.handleInputConfirm(e):null}},model:{value:t.inputValue,callback:function(e){t.inputValue=e},expression:"inputValue"}}):a("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:t.showInput}},[t._v("+ New Tag")])],2)],2),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.dialogContactdVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:t.contactsSave}},[t._v("确 定")])],1)],1),t._v(" "),a("el-dialog",{attrs:{title:"上传附件",visible:t.dialogAnnexVisible,"close-on-click-modal":!1,width:"550px"},on:{"update:visible":function(e){t.dialogAnnexVisible=e},close:t.closeAnnexModal}},[a("el-form",{attrs:{labelPosition:"left","label-width":"60px"}},[a("el-form-item",{attrs:{label:"附件："}},[a("div",[a("el-button",{attrs:{size:"small",type:"primary"},on:{click:t.chooseAnnex}},[t._v("选择文件")]),a("span",{staticStyle:{color:"#409EFF","margin-left":"10px"}},[t._v("单个文件最大支持100MB，上传请耐心等待")]),t._v(" "),t._l(t.files,function(e,l){return a("p",{key:l,staticStyle:{"line-height":"24px"}},[t._v(t._s(e.name)+"\n                        "),a("a",{staticStyle:{float:"right",color:"#409EFF"},on:{click:function(e){t.delFile(l)}}},[t._v("删除")])])})],2),t._v(" "),a("input",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],ref:"annexInput",attrs:{type:"file",multiple:""},on:{change:t.changeFile}})]),t._v(" "),a("el-form-item",{attrs:{label:"备注："}},[a("el-input",{attrs:{type:"textarea",resize:"none",autosize:{minRows:2},maxlength:"200",placeholder:"请填写备注(200字以内)"},model:{value:t.annexRemarks,callback:function(e){t.annexRemarks=e},expression:"annexRemarks"}})],1)],1),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.dialogAnnexVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:t.annexSave}},[t._v("保存")])],1)],1),t._v(" "),a("el-dialog",{attrs:{title:"跟进",visible:t.dialogFolowVisible,"close-on-click-modal":!1,width:"550px"},on:{"update:visible":function(e){t.dialogFolowVisible=e},open:t.openFollowModal,close:t.closeFollowModal}},[a("el-form",{ref:"follow_form",attrs:{inline:!0,rules:t.followRules,model:t.follow_form,labelPosition:"left"}},[a("el-form-item",{staticStyle:{"margin-right":"76px"},attrs:{required:"",prop:"followType"}},[a("el-select",{attrs:{placeholder:"请选择跟进方式",size:"small"},model:{value:t.follow_form.followType,callback:function(e){t.$set(t.follow_form,"followType",e)},expression:"follow_form.followType"}},t._l(t.follow_type_list,function(t){return a("el-option",{key:t,attrs:{label:t,value:t}})}))],1),t._v(" "),a("el-form-item",{attrs:{prop:"followTime"}},[a("el-date-picker",{attrs:{format:"yyyy-MM-dd HH:mm",type:"datetime",size:"small",placeholder:"选择日期时间"},model:{value:t.follow_form.followTime,callback:function(e){t.$set(t.follow_form,"followTime",e)},expression:"follow_form.followTime"}})],1),t._v(" "),a("el-form-item",{attrs:{prop:"followContent"}},[a("el-input",{staticStyle:{width:"500px"},attrs:{type:"textarea",autosize:{minRows:2},maxlength:"200",placeholder:"填写跟进内容(200字以内)"},model:{value:t.follow_form.followContent,callback:function(e){t.$set(t.follow_form,"followContent",e)},expression:"follow_form.followContent"}})],1),t._v(" "),a("p",{staticStyle:{"padding-bottom":"10px"}},[t._v("客户名称：    "+t._s(t.basicInfo.name))]),t._v(" "),a("el-form-item",{attrs:{label:"跟进状态：",prop:"followStatus"}},[a("el-select",{attrs:{placeholder:"",size:"small"},model:{value:t.follow_form.followStatus,callback:function(e){t.$set(t.follow_form,"followStatus",e)},expression:"follow_form.followStatus"}},t._l(t.follow_status_list,function(t){return a("el-option",{key:t,attrs:{label:t,value:t}})}))],1),t._v(" "),a("el-form-item",{attrs:{label:"拜访人员：",prop:"contactCname"}},[a("el-select",{attrs:{size:"small",filterable:"",clearable:"",placeholder:"请选择拜访人姓名"},model:{value:t.follow_form.contactCname,callback:function(e){t.$set(t.follow_form,"contactCname",e)},expression:"follow_form.contactCname"}},t._l(t.contacts_list,function(t){return a("el-option",{key:t.id,attrs:{label:t.name,value:t.id+"/"+t.name}})}))],1),t._v(" "),a("el-form-item",{attrs:{label:"通知：","label-width":"80px",prop:"copyToUserCname"}},[a("el-select",{attrs:{size:"small",filterable:"",clearable:"",placeholder:"请输入员工姓名或工号"},model:{value:t.follow_form.copyToUserCname,callback:function(e){t.$set(t.follow_form,"copyToUserCname",e)},expression:"follow_form.copyToUserCname"}},t._l(t.allStaff,function(e){return a("el-option",{key:e.userName,attrs:{label:e.cname+"  "+e.userName,value:e.userName+"/"+e.cname}},[a("span",{staticStyle:{float:"left"}},[t._v(t._s(e.cname))]),t._v(" "),a("span",{staticStyle:{float:"right",color:"#8492a6","font-size":"13px"}},[t._v(t._s(e.userName))])])}))],1)],1),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.dialogFolowVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:t.followSave}},[t._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var r=a("VU/8")(i,n,!1,function(t){a("Euog")},"data-v-178d1240",null);e.default=r.exports},Euog:function(t,e){}});
//# sourceMappingURL=38.386d4430ab8eded01a7f.js.map