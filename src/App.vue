<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['isRouterAlive']),
  },
}
</script>

<style lang="less">
  @import './style/common';
  a{
    cursor: pointer;
    color: inherit;
  }
  html{
    color: #333;
  }
  .text-base{
    color: #0090ff;
  }
  .text-center{
    text-align: center !important;
  }
  .el-pagination{
    margin-top: 20px;
  }
  .el-header{
    background: #2db7f5;
    color: #fff;
    line-height: 60px;
    font-size: 30px;
    i{
      float: right;
      font-size: 32px;
    }
  }
  .wrap{
    position: relative;
    min-width: 1100px;
    min-height: 100%;
    overflow: auto;
    padding-top: 20px;
    box-sizing: border-box;
  }
  .text-red{
    color: #f00;
  }
  .bg-white{
    background: #fff;
  }


  // dialog 样式
  .el-dialog__header{
        padding-top: 10px;
        background: #409EFF;
        color: #fff;
    }
    .el-dialog__title{
        color: #fff;
    }
    .el-dialog__header .el-icon-close{
        color: #fff;
        font-size: 20px;
        font-weight: bold;
        position: relative;
        top: -8px;
    }
    .el-dialog__headerbtn:hover .el-icon-close{
        color: #eee;
    }
    .el-dialog__footer{
      border-top: 1px solid #ddd;
      padding-bottom: 10px;
    }
</style>
