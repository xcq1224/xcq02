webpackJsonp([6],{"/2An":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});a("NYxO");var l=a("Icdr"),r=a.n(l),o=(a("4UDB"),a("GbHy"),a("miEh"),a("80cc"),a("YsUA"),a("2tOJ"),a("Oq2I"),{data:function(){return{formQuery:{},tableData:[]}},mounted:function(){this.myChart=r.a.init(document.getElementById("chart")),this.initData()},methods:{initData:function(){var e={title:{text:"",subtext:""},tooltip:{trigger:"axis"},legend:{data:["计划收款金额","已完成金额","未完成金额","已开票金额"]},toolbox:{show:!0,feature:{mark:{show:!0},dataView:{show:!0,readOnly:!1},magicType:{show:!0,type:["line","bar"]},restore:{show:!0},saveAsImage:{show:!0}}},color:["#cc33cc"],lineStyle:{type:"dotted",width:2},calculable:!0,xAxis:[{type:"category",data:["A","B","C","D","E","F","G","H","I","J","K","L"]}],yAxis:[{type:"value"}],series:[{name:"计划收款金额",type:"bar",data:[40,49,23,45,23,86,23,56,23,86,23,56],barWidth:"50%"}]};this.myChart.setOption(e)}}}),s={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"wrap"},[a("el-form",{staticClass:"query-form",attrs:{"label-position":"left",size:"small",model:e.formQuery,"label-width":"90px"}},[a("el-form-item",{attrs:{label:"分类："}},[a("span",[e._v("客户类型")]),e._v("        \n            "),a("span",[e._v("客户来源")]),e._v("        \n            "),a("span",[e._v("所属类型")])]),e._v(" "),a("el-form-item",{attrs:{label:"所属部门："}},[a("el-select",{attrs:{clearable:""},model:{value:e.formQuery.follow_type,callback:function(t){e.$set(e.formQuery,"follow_type",t)},expression:"formQuery.follow_type"}},[a("el-option",{attrs:{label:"区域一",value:"shanghai"}}),e._v(" "),a("el-option",{attrs:{label:"区域二",value:"beijing"}})],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"拥有者："}},[a("el-select",{attrs:{clearable:""},model:{value:e.formQuery.follow_type,callback:function(t){e.$set(e.formQuery,"follow_type",t)},expression:"formQuery.follow_type"}},[a("el-option",{attrs:{label:"区域一",value:"shanghai"}}),e._v(" "),a("el-option",{attrs:{label:"区域二",value:"beijing"}})],1)],1)],1),e._v(" "),a("div",{staticClass:"chart",attrs:{id:"chart"}}),e._v(" "),a("div",{staticClass:"table-box"},[a("p",[e._v("签到次数：10次")]),e._v(" "),a("el-table",{staticClass:"table",attrs:{data:e.tableData,"max-height":"500",border:"","header-cell-style":{padding:"10px 0"}}},[a("el-table-column",{attrs:{prop:"report_type",label:"员工姓名"}}),e._v(" "),a("el-table-column",{attrs:{prop:"summary",label:"部门"}}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"签到次数"}})],1)],1)],1)},staticRenderFns:[]};var i=a("VU/8")(o,s,!1,function(e){a("6myD")},"data-v-d9e60f8a",null);t.default=i.exports},"6myD":function(e,t){}});
//# sourceMappingURL=6.b1a499af416480810324.js.map