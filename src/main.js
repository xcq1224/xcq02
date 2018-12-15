// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import {regionData, CodeToText, TextToCode} from 'element-china-area-data'
import cityData from "./js/cityData"

import XLSX from 'xlsx'
window.XLSX = XLSX

import $ from 'jquery'
window.$ = $

Vue.config.productionTip = false
Vue.use(ElementUI)
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios



//  刷新当前路由
Vue.prototype.reload = function(){
  this.$store.state.isRouterAlive = false
  this.$nextTick(() => (this.$store.state.isRouterAlive = true))
}

//  表单验证
Vue.prototype.isNull = function(rule, value, callback){
  if(value && value.trim()){
    callback()
  }else{
    callback(new Error('输入不能为空'))
  }
}

//  获取省市区数据
Vue.prototype.cityData = function(){
  return cityData.data
}

/**
 * 日期格式化
 * @param {日期} datetime
 * @param {格式化类型} fmt
 */
Vue.prototype.formatDate = function(datetime, fmt){
  var fmt = fmt || 'yyyy-MM-dd';
  var o = {
      "M+": datetime.getMonth() + 1, //月份
      "d+": datetime.getDate(), //日
      "h+": datetime.getHours(), //小时
      "m+": datetime.getMinutes(), //分
      "s+": datetime.getSeconds(), //秒
      "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
      "S": datetime.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/**
 * 获取数组长度
 * @param {数组} arr
 */
Vue.prototype.length = function(arr){
  return arr.length
}

/**
 * 返回上一页
 */
Vue.prototype.goBack = function(){
  this.$router.go(-1)
}

/**
 * 将文件转化为本地路径在页面显示
 * @param {文件流对象} file
 */
Vue.prototype.getUrl = function(file){
  return file ? URL.createObjectURL(file) : null
}

/**
 * 将地区编码转化为文字
 * @param {地区数组} arr
 */
Vue.prototype.code2text = function(arr){
  let area = '';
  if(arr){
    arr.map((code) => {
      area += CodeToText[code]
    })
  }
  return area
},

/**
 * 对象深拷贝
 * @param {要拷贝的对象} obj
 */
Vue.prototype.deepClone = function(initalObj) {
  var obj = {};
  obj = JSON.parse(JSON.stringify(initalObj));
  return obj;
}

/**
 *
 * @param {接口名} url
 * @param {post请求参数} params
 * @param {请求成功回调} success
 * @param {请求失败回调} error
 */
Vue.prototype.$post = function(action, params, success, error) {
  // let url = 'http://p-46054.wisdri.com:8085/pm' + action
  // let url = 'http://192.168.200.133/pm' + action
  let url = 'http://localhost:8085/pm' + action
  this.$axios.post(url,params).then(res => {
    if(res.data.flag){
      if(success) success(res.data)
    }else{
      this.$message.error(res.data.message);
      if(error) error(res.data)
    }
  }).catch(res=>{
      this.$message.error("网络异常，请稍后再试！")
    }
  )
}
/**
 *
 * @param {提示内容} text
 * @param {确定回调函数} confirmFun
 * @param {取消回调函数} cancelFun
 */
Vue.prototype._confirm = function(text, confirmFun, cancelFun){
  this.$confirm(text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if(confirmFun) confirmFun()
  }).catch(() => {
    if(cancelFun) cancelFun()
  });
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>',
  router,
  created: function(){
    //在页面加载时读取localStorage里的状态信息
    // console.log(this.$store.replaceState(Object.assign(this.$store.state,JSON.parse(localStorage.getItem("userMsg")))))
    localStorage.getItem("userMsg") && this.$store.replaceState(Object.assign(this.$store.state,JSON.parse(localStorage.getItem("userMsg"))));
    //
    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload",()=>{
        localStorage.setItem("userMsg",JSON.stringify(this.$store.state))
    })
  }
})
