webpackJsonp([19],{Hqdc:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});a("NYxO");var l=a("Icdr"),r=a.n(l),o=(a("4UDB"),a("GbHy"),a("miEh"),a("80cc"),a("YsUA"),a("2tOJ"),a("Oq2I"),{data:function(){return{formQuery:{},tableData:[]}},mounted:function(){this.myChart=r.a.init(document.getElementById("chart")),this.initData()},methods:{initData:function(){this.myChart.setOption({tooltip:{trigger:"axis"},toolbox:{show:!0,feature:{mark:{show:!0},dataView:{show:!0,readOnly:!1},magicType:{show:!0,type:["line","bar"]},restore:{show:!0},saveAsImage:{show:!0}}},calculable:!0,color:["#f7a35c","#48c9b3"],legend:{data:["合同数量","合同总金额"]},xAxis:[{type:"category",data:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]}],yAxis:[{type:"value",name:"赢单数"},{type:"value",name:"金额(￥)"}],series:[{name:"合同数量",type:"line",data:[0,0,0,23.2,25.6,76.7,135.6,162.2,32.6,20,6.4,3.3]},{name:"合同总金额",type:"bar",yAxisIndex:1,barWidth:40,data:[2,2.2,3.3,4.5,6.3,10.2,20.3,23.4,23,16.5,12,6.2]}]})}}}),s={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"wrap"},[a("el-form",{staticClass:"query-form",attrs:{"label-position":"left",size:"small",model:e.formQuery,"label-width":"90px"}},[a("el-form-item",{attrs:{label:"合同类型："}},[e._v("\n            营销合同    采购合同\n        ")]),e._v(" "),a("el-form-item",{attrs:{label:"时间："}},[a("el-date-picker",{attrs:{type:"daterange","start-placeholder":"开始日期","end-placeholder":"结束日期","value-format":"yyyy-MM-dd","default-time":["00:00:00","23:59:59"]},model:{value:e.formQuery.recent_follow_time,callback:function(t){e.$set(e.formQuery,"recent_follow_time",t)},expression:"formQuery.recent_follow_time"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"合同状态："}},[e._v("\n            全部    执行中    意外终止    结束\n        ")]),e._v(" "),a("el-form-item",{attrs:{label:"所属部门："}},[a("el-select",{attrs:{clearable:""},model:{value:e.formQuery.follow_type,callback:function(t){e.$set(e.formQuery,"follow_type",t)},expression:"formQuery.follow_type"}},[a("el-option",{attrs:{label:"区域一",value:"shanghai"}}),e._v(" "),a("el-option",{attrs:{label:"区域二",value:"beijing"}})],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"拥有者："}},[a("el-input",{attrs:{size:"small",clearable:"",placeholder:""},model:{value:e.formQuery.phone,callback:function(t){e.$set(e.formQuery,"phone",t)},expression:"formQuery.phone"}})],1)],1),e._v(" "),a("div",{staticClass:"chart",attrs:{id:"chart"}}),e._v(" "),a("div",{staticClass:"table-box"},[a("p",[e._v("合同数量：20     合同总金额：￥200000")]),e._v(" "),a("el-table",{staticClass:"table",attrs:{data:e.tableData,"max-height":"500",border:"","header-cell-style":{padding:"10px 0"}}},[a("el-table-column",{attrs:{prop:"report_type",label:"月份"}}),e._v(" "),a("el-table-column",{attrs:{prop:"summary",label:"合同数量"}}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"合同总金额"}})],1)],1)],1)},staticRenderFns:[]};var i=a("VU/8")(o,s,!1,function(e){a("dYZK")},"data-v-714ec2b8",null);t.default=i.exports},dYZK:function(e,t){}});
//# sourceMappingURL=19.2fe49d3dfeba5d18f99b.js.map