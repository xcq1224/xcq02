webpackJsonp([35],{"2Amq":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});a("NYxO");var l=a("Icdr"),r=a.n(l),o=(a("4UDB"),a("GbHy"),a("miEh"),a("80cc"),a("YsUA"),a("2tOJ"),a("Oq2I"),{data:function(){return{formQuery:{},tableData:[]}},mounted:function(){this.myChart=r.a.init(document.getElementById("chart")),this.initData()},methods:{initData:function(){var e={title:{text:"",subtext:""},tooltip:{trigger:"axis"},legend:{data:["签到次数"]},toolbox:{show:!0,feature:{mark:{show:!0},dataView:{show:!0,readOnly:!1},magicType:{show:!0,type:["line","bar"]},restore:{show:!0},saveAsImage:{show:!0}}},color:["#cc33cc"],lineStyle:{type:"dotted",width:2},calculable:!0,xAxis:[{type:"category",data:["A","B","C","D","E","F","G","H","I","J","K","L"]}],yAxis:[{type:"value"}],series:[{name:"签到次数",type:"bar",data:[40,49,23,45,23,86,23,56,23,86,23,56],barWidth:"50%"}]};this.myChart.setOption(e)}}}),s={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"wrap"},[a("el-form",{staticClass:"query-form",attrs:{"label-position":"left",size:"small",inline:!0,model:e.formQuery,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"签到时间："}},[a("span",[e._v("全部")]),e._v("        \n            "),a("span",[e._v("本日")]),e._v("        \n            "),a("span",{staticStyle:{"margin-right":"120px"}},[e._v("本月")])]),e._v(" "),a("el-form-item",{attrs:{label:"自定义时间："}},[a("el-date-picker",{attrs:{type:"daterange","start-placeholder":"开始日期","end-placeholder":"结束日期","value-format":"yyyy-MM-dd","default-time":["00:00:00","23:59:59"]},model:{value:e.formQuery.recent_follow_time,callback:function(t){e.$set(e.formQuery,"recent_follow_time",t)},expression:"formQuery.recent_follow_time"}})],1),e._v(" "),a("br"),e._v(" "),a("el-form-item",{attrs:{label:"签到部门："}},[a("el-select",{attrs:{clearable:""},model:{value:e.formQuery.follow_type,callback:function(t){e.$set(e.formQuery,"follow_type",t)},expression:"formQuery.follow_type"}},[a("el-option",{attrs:{label:"区域一",value:"shanghai"}}),e._v(" "),a("el-option",{attrs:{label:"区域二",value:"beijing"}})],1)],1),e._v(" "),a("br"),e._v(" "),a("el-form-item",{attrs:{label:"签到员工："}},[a("el-select",{attrs:{clearable:""},model:{value:e.formQuery.follow_type,callback:function(t){e.$set(e.formQuery,"follow_type",t)},expression:"formQuery.follow_type"}},[a("el-option",{attrs:{label:"区域一",value:"shanghai"}}),e._v(" "),a("el-option",{attrs:{label:"区域二",value:"beijing"}})],1)],1)],1),e._v(" "),a("div",{staticClass:"chart",attrs:{id:"chart"}}),e._v(" "),a("div",{staticClass:"table-box"},[a("p",[e._v("签到次数：10次")]),e._v(" "),a("el-table",{staticClass:"table",attrs:{data:e.tableData,"max-height":"500",border:"","header-cell-style":{padding:"10px 0"}}},[a("el-table-column",{attrs:{prop:"report_type",label:"员工姓名"}}),e._v(" "),a("el-table-column",{attrs:{prop:"summary",label:"部门"}}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"签到次数"}})],1)],1)],1)},staticRenderFns:[]};var i=a("VU/8")(o,s,!1,function(e){a("FRmV")},"data-v-3400031c",null);t.default=i.exports},FRmV:function(e,t){}});
//# sourceMappingURL=35.f47b1f16b498f1283cd0.js.map