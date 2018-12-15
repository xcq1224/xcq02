import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	isRouterAlive : true,           //  是否显示当前路由
    showList:[],					//	显示的页面

}

const mutations = {

}

const actions = {

}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
