<template>
	<el-container style="height: 100%">
		<el-header class="header">
			<p>中铁武汉勘察设计研究院经营管理平台<i class="iconfont icon-lingdang"></i></p>
		</el-header>
		<el-container>
			<el-aside width="200px">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" router :collapse='isCollapse'>
					<el-menu-item index="index"><i class="el-icon-menu"></i>首页</el-menu-item>
					<el-submenu index="2">
						<template slot="title"><i class="el-icon-document"></i>我的地盘</template>
						<el-menu-item v-if="showList.indexOf('bench') != -1" index="bench">工作台</el-menu-item>
						<el-menu-item v-if="showList.indexOf('approval')" index="approval">审批流程</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="el-icon-plus"></i>客户管理</template>
						<el-menu-item index="client">客户</el-menu-item>
						<el-menu-item index="contacts">联系人</el-menu-item>
						<el-menu-item index="sea_customer">公海客户</el-menu-item>
						<el-menu-item index="partner">合作伙伴</el-menu-item>
            <el-menu-item index="sub_contractor">分包商</el-menu-item>
						<el-menu-item index="competitor">竞争对手</el-menu-item>
					</el-submenu>
					<el-submenu index="4">
						<template slot="title"><i class="el-icon-star-on"></i>营销管理</template>
						<el-menu-item index="marketing_clue">营销线索</el-menu-item>
						<el-menu-item index="opportunity">机会</el-menu-item>
						<el-menu-item index="marketing_contract">营销合同</el-menu-item>
						<el-menu-item index="purchase_contract">采购合同</el-menu-item>
						<el-menu-item index="receipt">收款管理</el-menu-item>
						<el-menu-item index="payment">付款管理</el-menu-item>
						<el-menu-item index="follow_record">跟进记录</el-menu-item>
						<el-menu-item index="work_report">工作报告</el-menu-item>
					</el-submenu>
					<el-submenu index="5">
						<template slot="title"><i class="el-icon-menu"></i>数据报表</template>
						<el-submenu index="5-1">
							<template slot="title">营销过程</template>
							<el-menu-item index="marketing_funnel_report">营销漏斗报表</el-menu-item>
							<el-menu-item index="follow_record_report">跟进记录报表</el-menu-item>
							<el-menu-item index="business_statistics">业务新增统计</el-menu-item>
						</el-submenu>
						<el-submenu index="5-2">
							<template slot="title">营销业绩</template>
							<el-menu-item index="opportunity_statistics">机会统计报表</el-menu-item>
							<el-menu-item index="contract_statistics">合同统计报表</el-menu-item>
							<el-menu-item index="collection_statistics">收款统计报表</el-menu-item>
							<el-menu-item index="payment_statistics">付款统计报表</el-menu-item>
						</el-submenu>
						<el-submenu index="5-3">
							<template slot="title">营销管理</template>
							<el-menu-item index="visit_repoet">拜访数据统计</el-menu-item>
							<el-menu-item index="clue_statistics">线索转化统计</el-menu-item>
							<el-menu-item index="customer_statistics">客户数量排名</el-menu-item>
							<el-menu-item index="amount_statistics">营销金额排名</el-menu-item>
							<el-menu-item index="Work_report_statistics">工作报告统计</el-menu-item>
							<el-menu-item index="customer_analysis_statistics">客户分析统计</el-menu-item>
						</el-submenu>
					</el-submenu>
					<el-submenu index="6">
						<template slot="title"><i class="el-icon-menu"></i><span>后台管理</span></template>
						<el-submenu index="6-1">
						<template slot="title">字段管理</template>
						<el-menu-item index="CrmCustomerField">客户字段</el-menu-item>
						<el-menu-item index="crm_contacts_field">联系人字段</el-menu-item>
						<el-menu-item index="marketing_clue_field">营销线索字段</el-menu-item>
						</el-submenu>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main style="background: #fafafa; padding-bottom: 0;padding-top: 0;">
				<keep-alive>
				    <router-view v-if="isRouterAlive"></router-view>
				</keep-alive>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import {mapState, mapActions, mapMutations} from 'vuex'
	export default {

		computed: {
			...mapState(['isRouterAlive', 'showList']),
			defaultActive: function() {
				console.log(this.$route.path.replace("/", ""))
				return this.$route.path.replace("/", "");
			}
		},

		data(){
			return {
				isCollapse: false,
			}
		},
		created(){
			console.log(2222)
		},

		mounted() {

    	},

	};
</script>


<style lang="less" scoped>

</style>
