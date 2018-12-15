<template>
  	<div class="login_page fillcontain">
	  	<iframe width="100%" height="100%" src="http://192.168.23.1:8085/iims5/com.wisdri.iims.main.Login.d" ></iframe>
  	</div>
</template>

<script>
    import { mapState, mapActions, mapMutations } from 'vuex'
    export default {
        computed: {
            ...mapState(['count']),
            num(){
                return 3
            }
        },
		methods: {
            send(){
                let params = new URLSearchParams();
                const data = {
                    b: 2,
                    c: {e: 5, f: 6},
                    d: [1,2,3]
                }
                this.$router.push('manage')
                // params.append('data', JSON.stringify(data))
                // this.$axios.get("http://localhost/wechat/test1").then(res => {
                //     console.log(res.data.a);
                //     // this.$router.push('manage')
                // }).catch(error => {
                //     console.log('error')
                // })
                // params.append('data', JSON.stringify(data))
                // this.$axios.post("http://192.168.168.22:8085/iims5/api/a4", params).then(res => {
                //     console.log(res.data.a);
                //     this.$router.push('manage')
                // }).catch(error => {
                //     console.log('error')
                // })
            },
            get(){
                // this.$axios.get("http://localhost/wechat/test2").then(res => {
                //     console.log(res.data.a);
                //     // this.$router.push('manage')
                // }).catch(error => {
                //     console.log('error')
                // })
            },
            ...mapActions(['inc', 'dec'])
        }
    }
</script>


