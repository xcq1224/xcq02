webpackJsonp([15],{K1hW:function(t,e,v){"use strict";Object.defineProperty(e,"__esModule",{value:!0});v("NYxO"),v("Icdr"),v("4UDB"),v("GbHy"),v("miEh"),v("80cc"),v("YsUA"),v("2tOJ"),v("Oq2I");var a={data:function(){return{formQuery:{type:0},tableData:[],week:"",month:"",year:"",pickerOptions:{firstDayOfWeek:1}}},methods:{chooseDaily:function(){this.formQuery.type=0;var t=[],e=this.week;e.setDate(e.getDate()-1),t.push(this.formatDate(e,"yyyy-MM-dd"));for(var v=0;v<6;v++)e.setDate(e.getDate()+1),t.push(this.formatDate(e,"yyyy-MM-dd"));console.log(t)},chooseWeekly:function(){this.formQuery.type=1},chooseMonthly:function(){this.formQuery.type=2}}},_={render:function(){var t=this,e=t.$createElement,v=t._self._c||e;return v("div",{staticClass:"wrap"},[v("el-form",{staticClass:"query-form",attrs:{"label-position":"left",size:"small",model:t.formQuery,"label-width":"90px"}},[v("el-form-item",{attrs:{label:"报告类型："}},[v("span",{class:0==t.formQuery.type?"active":"",on:{click:t.chooseDaily}},[t._v("日报")]),t._v("    \n            "),v("span",{class:1==t.formQuery.type?"active":"",on:{click:t.chooseWeekly}},[t._v("周报")]),t._v("    \n            "),v("span",{class:2==t.formQuery.type?"active":"",on:{click:t.chooseMonthly}},[t._v("月报")])]),t._v(" "),v("el-form-item",{attrs:{label:"部门："}},[v("el-select",{attrs:{clearable:""},model:{value:t.formQuery.follow_type,callback:function(e){t.$set(t.formQuery,"follow_type",e)},expression:"formQuery.follow_type"}},[v("el-option",{attrs:{label:"区域一",value:"shanghai"}}),t._v(" "),v("el-option",{attrs:{label:"区域二",value:"beijing"}})],1)],1),t._v(" "),v("el-form-item",{attrs:{label:"员工："}},[v("el-select",{attrs:{clearable:""},model:{value:t.formQuery.follow_type,callback:function(e){t.$set(t.formQuery,"follow_type",e)},expression:"formQuery.follow_type"}},[v("el-option",{attrs:{label:"区域一",value:"shanghai"}}),t._v(" "),v("el-option",{attrs:{label:"区域二",value:"beijing"}})],1)],1)],1),t._v(" "),v("div",{staticClass:"table-box"},[v("el-date-picker",{directives:[{name:"show",rawName:"v-show",value:0==t.formQuery.type,expression:"formQuery.type == 0"}],attrs:{type:"week","picker-options":t.pickerOptions,format:"yyyy 第 WW 周",placeholder:"选择周"},model:{value:t.week,callback:function(e){t.week=e},expression:"week"}}),t._v(" "),v("el-date-picker",{directives:[{name:"show",rawName:"v-show",value:1==t.formQuery.type,expression:"formQuery.type == 1"}],attrs:{type:"month",format:"yyyy-MM","value-format":"yyyy-MM-dd",placeholder:"选择月"},model:{value:t.month,callback:function(e){t.month=e},expression:"month"}}),t._v(" "),v("el-date-picker",{directives:[{name:"show",rawName:"v-show",value:2==t.formQuery.type,expression:"formQuery.type == 2"}],attrs:{type:"year",placeholder:"选择年"},model:{value:t.year,callback:function(e){t.year=e},expression:"year"}}),t._v(" "),v("el-table",{directives:[{name:"show",rawName:"v-show",value:0==t.formQuery.type,expression:"formQuery.type == 0"}],staticClass:"table",attrs:{data:t.tableData,"max-height":"500",border:"","header-cell-style":{padding:"10px 0"}}},[v("el-table-column",{attrs:{prop:"report_type",label:"员工姓名"}}),t._v(" "),v("el-table-column",{attrs:{prop:"summary",label:"提交数量"}}),t._v(" "),v("el-table-column",{attrs:{prop:"",label:"未提数量"}}),t._v(" "),v("el-table-column",{attrs:{prop:"",label:"周一"}}),t._v(" "),v("el-table-column",{attrs:{prop:"",label:"周二"}}),t._v(" "),v("el-table-column",{attrs:{prop:"",label:"周三"}}),t._v(" "),v("el-table-column",{attrs:{prop:"",label:"周四"}}),t._v(" "),v("el-table-column",{attrs:{prop:"",label:"周五"}}),t._v(" "),v("el-table-column",{attrs:{prop:"",label:"周六"}}),t._v(" "),v("el-table-column",{attrs:{prop:"",label:"周日"}})],1),t._v(" "),v("table",{directives:[{name:"show",rawName:"v-show",value:1==t.formQuery.type,expression:"formQuery.type == 1"}],staticClass:"table",attrs:{cellpadding:"0",cellspacing:"0"}},[t._m(0),t._v(" "),t._m(1),t._v(" "),t._m(2)]),t._v(" "),v("table",{directives:[{name:"show",rawName:"v-show",value:2==t.formQuery.type,expression:"formQuery.type == 2"}],staticClass:"table",attrs:{cellpadding:"0",cellspacing:"0"}},[t._m(3),t._v(" "),t._m(4),t._v(" "),t._m(5)])],1)],1)},staticRenderFns:[function(){var t=this,e=t.$createElement,v=t._self._c||e;return v("tr",[v("th",{attrs:{width:"80"}},[t._v("员工姓名")]),t._v(" "),v("th",{attrs:{width:"80"}},[t._v("提交数量")]),t._v(" "),v("th",{attrs:{width:"80"}},[t._v("未提数量")]),t._v(" "),v("th",[t._v("1")]),t._v(" "),v("th",[t._v("2")]),t._v(" "),v("th",[t._v("3")]),t._v(" "),v("th",[t._v("4")]),t._v(" "),v("th",[t._v("5")]),t._v(" "),v("th",[t._v("6")]),t._v(" "),v("th",[t._v("7")]),t._v(" "),v("th",[t._v("8")]),t._v(" "),v("th",[t._v("9")]),t._v(" "),v("th",[t._v("10")]),t._v(" "),v("th",[t._v("11")]),t._v(" "),v("th",[t._v("12")]),t._v(" "),v("th",[t._v("13")]),t._v(" "),v("th",[t._v("14")]),t._v(" "),v("th",[t._v("15")]),t._v(" "),v("th",[t._v("16")]),t._v(" "),v("th",[t._v("17")]),t._v(" "),v("th",[t._v("18")]),t._v(" "),v("th",[t._v("19")]),t._v(" "),v("th",[t._v("20")]),t._v(" "),v("th",[t._v("21")]),t._v(" "),v("th",[t._v("22")]),t._v(" "),v("th",[t._v("23")]),t._v(" "),v("th",[t._v("24")]),t._v(" "),v("th",[t._v("25")]),t._v(" "),v("th",[t._v("26")]),t._v(" "),v("th",[t._v("27")]),t._v(" "),v("th",[t._v("28")]),t._v(" "),v("th",[t._v("29")]),t._v(" "),v("th",[t._v("30")]),t._v(" "),v("th",[t._v("31")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("tr",[e("td",{staticClass:"empty",attrs:{colspan:"40"}},[this._v("暂无数据")])])},function(){var t=this,e=t.$createElement,v=t._self._c||e;return v("tr",{staticStyle:{display:"none"}},[v("td",[t._v("暗示法")]),t._v(" "),v("td",[t._v("23")]),t._v(" "),v("td",[t._v("43")]),t._v(" "),v("td",[t._v("x")]),t._v(" "),v("td",[t._v("x")]),t._v(" "),v("td",[t._v("x")]),t._v(" "),v("td",[t._v("x")]),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td")])},function(){var t=this,e=t.$createElement,v=t._self._c||e;return v("tr",[v("th",{attrs:{width:"80"}},[t._v("员工姓名")]),t._v(" "),v("th",{attrs:{width:"80"}},[t._v("提交数量")]),t._v(" "),v("th",{attrs:{width:"80"}},[t._v("未提数量")]),t._v(" "),v("th",[t._v("1")]),t._v(" "),v("th",[t._v("2")]),t._v(" "),v("th",[t._v("3")]),t._v(" "),v("th",[t._v("4")]),t._v(" "),v("th",[t._v("5")]),t._v(" "),v("th",[t._v("6")]),t._v(" "),v("th",[t._v("7")]),t._v(" "),v("th",[t._v("8")]),t._v(" "),v("th",[t._v("9")]),t._v(" "),v("th",[t._v("10")]),t._v(" "),v("th",[t._v("11")]),t._v(" "),v("th",[t._v("12")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("tr",[e("td",{staticClass:"empty",attrs:{colspan:"40"}},[this._v("暂无数据")])])},function(){var t=this,e=t.$createElement,v=t._self._c||e;return v("tr",{staticStyle:{display:"none"}},[v("td",[t._v("暗示法")]),t._v(" "),v("td",[t._v("23")]),t._v(" "),v("td",[t._v("43")]),t._v(" "),v("td",[t._v("x")]),t._v(" "),v("td",[t._v("x")]),t._v(" "),v("td",[t._v("x")]),t._v(" "),v("td",[t._v("x")]),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td"),t._v(" "),v("td")])}]};var l=v("VU/8")(a,_,!1,function(t){v("xM7Z")},"data-v-7975af14",null);e.default=l.exports},xM7Z:function(t,e){}});
//# sourceMappingURL=15.523a0e167247aaa90b92.js.map