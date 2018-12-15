<template>
  <div class="wrap">
      <input type="file">
      <a @click="upFile">上传</a>
  </div>
</template>

<script>
    export default {
        data() {
            return {

            };
        },
        mounted(){
            
        },
        methods: {
            upFile(){
                let url = "http://localhost:8080/lyyzoo-fastdfs-java/fastdfs/upload/file/sample"
                this.$axios.post(url,{}).then(res => {
                    console.log(res)
                }).catch(res=>{
                    this.$message.error("网络异常，请稍后再试！")
                    }
                )
            }
        /******************************************************************************* */
        }
    }
</script>

<style lang="less">
  
</style>
