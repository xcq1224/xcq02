<template>
    <el-dialog title="xxx公司" class="dialogCheck" width="40%" :visible.sync="dialogCheckVisible" @close='closeDialog' :close-on-click-modal='false'>
        <table>
            <tr>
                <td width='140'>统一社会信用代码：</td>
                <td>{{formCheck.credit_code}}</td>
            </tr>
            <tr>
                <td>企业名称：</td>
                <td>{{formCheck.company_name}}</td>
            </tr>
            <tr>
                <td>企业法人：</td>
                <td>{{formCheck.corporate}}</td>
            </tr>
            <tr>
                <td>企业类型：</td>
                <td>{{formCheck.company_type}}</td>
            </tr>
            <tr>
                <td>注册资金：</td>
                <td>{{formCheck.amount}}</td>
            </tr>
            <tr>
                <td>经营状态：</td>
                <td>{{formCheck.business_status}}</td>
            </tr>
            <tr>
                <td>成立时间：</td>
                <td>{{formCheck.found_time}}</td>
            </tr>
            <tr>
                <td>经营期限：</td>
                <td>{{formCheck.deadline}}</td>
            </tr>
            <tr>
                <td>核准日期：</td>
                <td>{{formCheck.approval_date}}</td>
            </tr>
            <tr>
                <td>登记机关：</td>
                <td>{{formCheck.register_office}}</td>
            </tr>
            <tr>
                <td>所属行业：</td>
                <td>{{formCheck.industry}}</td>
            </tr>
            <tr>
                <td>企业地址：</td>
                <td>{{formCheck.address}}</td>
            </tr>
            <tr>
                <td>经营范围：</td>
                <td>{{formCheck.business_scope}}</td>
            </tr>
            <tr>
                <td>电话：</td>
                <td>{{formCheck.tel}}</td>
            </tr>
            <tr>
                <td>网址：</td>
                <td>{{formCheck.internet_site}}</td>
            </tr>
            <tr>
                <td>邮箱：</td>
                <td>{{formCheck.mail}}</td>
            </tr>
            <tr>
                <td>邮编：</td>
                <td>{{formCheck.zip_code}}</td>
            </tr>
        </table>
    </el-dialog>
</template>

<script>

    export default {
    	data(){
    		return {
    			
    		}
        },
        props: ['dialogCheckVisible', 'formCheck'],
    	created(){
    		
    	},
    	computed: {
    		
    	},
		methods: {
            closeDialog(){
                this.$emit('closeDialog', false)
            }
        }
    }
</script>

<style lang="less">
	
</style>
