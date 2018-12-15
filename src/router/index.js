import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const test = r => require.ensure([], () => r(require('@/page/test')), 'test');
const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const index = r => require.ensure([], () => r(require('@/page/index')), 'index');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const bench = r => require.ensure([], () => r(require('@/page/bench')), 'bench');
const approval = r => require.ensure([], () => r(require('@/page/approval')), 'approval');
const client = r => require.ensure([], () => r(require('@/page/client')), 'client');
const client_detail = r => require.ensure([], () => r(require('@/page/client_detail')), 'client_detail');
const contacts = r => require.ensure([], () => r(require('@/page/contacts')), 'contacts');
const contacts_detail = r => require.ensure([], () => r(require('@/page/contacts_detail')), 'contacts_detail');
const sea_customer = r => require.ensure([], () => r(require('@/page/sea_customer')), 'sea_customer');
const partner = r => require.ensure([], () => r(require('@/page/partner')), 'partner');
const partner_detail = r => require.ensure([], () => r(require('@/page/partner_detail')), 'partner_detail');
const sub_contractor = r => require.ensure([], () => r(require('@/page/sub_contractor')), 'sub_contractor');
const sub_contractor_detail = r => require.ensure([], () => r(require('@/page/sub_contractor_detail')), 'sub_contractor_detail');
const competitor = r => require.ensure([], () => r(require('@/page/competitor')), 'competitor');
const competitor_detail = r => require.ensure([], () => r(require('@/page/competitor_detail')), 'competitor_detail');
const marketing_clue = r => require.ensure([], () => r(require('@/page/marketing_clue')), 'marketing_clue');
const marketing_clue_detail = r => require.ensure([], () => r(require('@/page/marketing_clue_detail')), 'marketing_clue_detail');
const opportunity = r => require.ensure([], () => r(require('@/page/opportunity')), 'opportunity');
const opportunity_detail = r => require.ensure([], () => r(require('@/page/opportunity_detail')), 'opportunity_detail');
const marketing_contract = r => require.ensure([], () => r(require('@/page/marketing_contract')), 'marketing_contract');
const marketing_contract_detail = r => require.ensure([], () => r(require('@/page/marketing_contract_detail')), 'marketing_contract_detail');
const purchase_contract = r => require.ensure([], () => r(require('@/page/purchase_contract')), 'purchase_contract');
const purchase_contract_detail = r => require.ensure([], () => r(require('@/page/purchase_contract_detail')), 'purchase_contract_detail');
const receipt = r => require.ensure([], () => r(require('@/page/receipt')), 'receipt');
const payment = r => require.ensure([], () => r(require('@/page/payment')), 'payment');
const follow_record = r => require.ensure([], () => r(require('@/page/follow_record')), 'follow_record');
const work_report = r => require.ensure([], () => r(require('@/page/work_report')), 'work_report');
const report = r => require.ensure([], () => r(require('@/page/report')), 'report');
const CrmCustomerField = r => require.ensure([], () => r(require('@/page/CrmCustomerField')), 'CrmCustomerField');
const crm_contacts_field = r => require.ensure([], () => r(require('@/page/crm_contacts_field')), 'crm_contacts_field');
const marketing_clue_field = r => require.ensure([], () => r(require('@/page/marketing_clue_field')), 'marketing_clue_field');

//	报表
const marketing_funnel_report = r => require.ensure([], () => r(require('@/page/marketing_funnel_report')), 'marketing_funnel_report');
const follow_record_report = r => require.ensure([], () => r(require('@/page/follow_record_report')), 'follow_record_report');
const business_statistics = r => require.ensure([], () => r(require('@/page/business_statistics')), 'business_statistics');
const opportunity_statistics = r => require.ensure([], () => r(require('@/page/opportunity_statistics')), 'opportunity_statistics');
const contract_statistics = r => require.ensure([], () => r(require('@/page/contract_statistics')), 'contract_statistics');
const collection_statistics = r => require.ensure([], () => r(require('@/page/collection_statistics')), 'collection_statistics');
const payment_statistics = r => require.ensure([], () => r(require('@/page/payment_statistics')), 'payment_statistics');
const visit_repoet = r => require.ensure([], () => r(require('@/page/visit_repoet')), 'visit_repoet');
const clue_statistics = r => require.ensure([], () => r(require('@/page/clue_statistics')), 'clue_statistics');
const customer_statistics = r => require.ensure([], () => r(require('@/page/customer_statistics')), 'customer_statistics');
const amount_statistics = r => require.ensure([], () => r(require('@/page/amount_statistics')), 'amount_statistics');
const work_report_statistics = r => require.ensure([], () => r(require('@/page/work_report_statistics')), 'work_report_statistics');
const customer_analysis_statistics = r => require.ensure([], () => r(require('@/page/customer_analysis_statistics')), 'customer_analysis_statistics');


const routes = [
	{
		path: '/login',
		component: login
	},
	{
		path: '/test',
		component: test
	},
	{
		path: '/index',
		component: index,
		name: '',
		children: [{
			path: '',
			component: home,
		},{
			path: '/bench',
			component: bench,
			meta: ['我的地盘', '工作台']
		},{
			path: '/approval',
			component: approval,
			meta: ['我的地盘', '审批流程']
		},{
			path: '/client',
			component: client,
			meta: ['客户管理', '客户'],
		},{
		  name: 'client_detail',
			path: '/client_detail',
			component: client_detail,
			name: 'client_detail',
			meta: ['客户管理', '客户详情']
		},{
			path: '/contacts',
			component: contacts,
			meta: ['客户管理', '联系人']
		},{
			path: '/contacts_detail',
			component: contacts_detail,
			meta: ['客户管理', '联系人详情']
		},{
			path: '/sea_customer',
			component: sea_customer,
			meta: ['客户管理', '公海客户']
		},{
			path: '/partner',
			component: partner,
			meta: ['客户管理', '合作伙伴']
		},{
			path: '/partner_detail',
			component: partner_detail,
      meta: ['客户管理', '合作伙伴详情']
    },{
			path: '/sub_contractor',
			component: sub_contractor,
			meta: ['客户管理', '分包商']
		},{
			path: '/sub_contractor_detail',
			component: sub_contractor_detail,
			meta: ['客户管理', '分包商详情']
		},{
			path: '/competitor',
			component: competitor,
			meta: ['客户管理', '竞争对手']
		},{
			path: '/competitor_detail',
			component: competitor_detail,
			meta: ['客户管理', '竞争对手详情']
		},{
			path: '/marketing_clue',
			component: marketing_clue,
			meta: ['营销管理', '营销线索']
		},{
			path: '/marketing_clue_detail',
			component: marketing_clue_detail,
			meta: ['营销管理', '营销线索详情']
		},{
			path: '/opportunity',
			component: opportunity,
			meta: ['营销管理', '机会']
		},{
			path: '/opportunity_detail',
			component: opportunity_detail,
			name: 'opportunity_detail',
			meta: ['营销管理', '机会详情']
		},{
			path: '/marketing_contract',
			component: marketing_contract,
			meta: ['营销管理', '营销合同']
		},{
			path: '/marketing_contract_detail',
			component: marketing_contract_detail,
			meta: ['营销管理', '营销合同详情']
		},{
			path: '/purchase_contract',
			component: purchase_contract,
			meta: ['营销管理', '采购合同']
		},{
			path: '/purchase_contract_detail',
			component: purchase_contract_detail,
			meta: ['营销管理', '采购合同详情']
		},{
			path: '/receipt',
			component: receipt,
			meta: ['营销管理', '收款管理']
		},{
			path: '/payment',
			component: payment,
			meta: ['营销管理', '付款管理']
		},{
			path: '/follow_record',
			component: follow_record,
			meta: ['营销管理', '跟进记录']
		},{
			path: '/work_report',
			component: work_report,
			meta: ['营销管理', '工作报告']
		},{
			path: '/marketing_funnel_report',
			component: marketing_funnel_report,
			meta: ['数据报表', '营销过程', '营销漏斗报表']
		},{
			path: '/follow_record_report',
			component: follow_record_report,
			meta: ['数据报表', '营销过程', '跟进记录报表']
		},{
			path: '/business_statistics',
			component: business_statistics,
			meta: ['数据报表', '营销过程', '业务新增统计']
		},{
			path: '/opportunity_statistics',
			component: opportunity_statistics,
			meta: ['数据报表', '营销业绩', '机会统计报表']
		},{
			path: '/contract_statistics',
			component: contract_statistics,
			meta: ['数据报表', '营销业绩', '合同统计报表']
		},{
			path: '/collection_statistics',
			component: collection_statistics,
			meta: ['数据报表', '营销业绩', '收款统计报表']
		},{
			path: '/payment_statistics',
			component: payment_statistics,
			meta: ['数据报表', '营销业绩', '付款统计报表']
		},{
			path: '/visit_repoet',
			component: visit_repoet,
			meta: ['数据报表', '营销管理', '拜访数据统计']
		},{
			path: '/clue_statistics',
			component: clue_statistics,
			meta: ['数据报表', '营销管理', '线索转化统计']
		},{
			path: '/customer_statistics',
			component: customer_statistics,
			meta: ['数据报表', '营销管理', '客户数量排名']
		},{
			path: '/amount_statistics',
			component: amount_statistics,
			meta: ['数据报表', '营销管理', '营销金额排名']
		},{
			path: '/work_report_statistics',
			component: work_report_statistics,
			meta: ['数据报表', '营销管理', '工作报告统计']
		},{
			path: '/customer_analysis_statistics',
			component: customer_analysis_statistics,
			meta: ['数据报表', '营销管理', '客户分析统计']
		},{
			path: '/CrmCustomerField',
			component: CrmCustomerField,
			meta: ['后台管理',"字段管理","客户字段"],
		},{
			path: '/crm_contacts_field',
			component: crm_contacts_field,
			meta: ['后台管理',"字段管理","联系人字段"],
		},{
			path: '/marketing_clue_field',
			component: marketing_clue_field,
			meta: ['后台管理',"字段管理","营销线索字段"],
		}]
	}
]

export default new Router({
  mode: 'history',
  base: '/crm/',
  routes,
  strict: process.env.NODE_ENV !== 'production',
})
