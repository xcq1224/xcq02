<template>
    <div class="wrap">
        <h4 class="title">待办事项</h4>
        <el-row type="flex" class="item—box" justify="space-around">
            <el-col :span="4">
                <div class="grid-content bg1">
                    <p>20</p>
                    <p>待处理的审批</p>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="grid-content bg2">
                    <p>10</p>
                    <p>待阅的审批</p>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="grid-content bg3 tx-gray">
                    <p>100</p>
                    <p>我发起的审批</p>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="grid-content bg4 tx-gray">
                    <p>20</p>
                    <p>已处理的审批</p>
                </div>
            </el-col>
        </el-row>
        <h4 class="title">
            销售简报
            <el-select class="date-select" size="small" v-model="value1">
                <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </h4>
        <el-row type="flex" class="item—box mb-0" justify="space-around" style="margin-bottom: 0px; padding-bottom: 10px">
            <el-col :span="5">
                <div class="grid-box">
                    <p class="grid-num">￥ 45000.00<i class="iconfont icon-fl-renminbi"></i></p>
                    <p class="tx-gray">合同总金额</p>
                </div>
            </el-col>
            <el-col :span="5">
                <div class="grid-box">
                    <p class="grid-num">10<i class="iconfont icon-hetong"></i></p>
                    <p class="tx-gray">合同数</p>
                </div>
            </el-col>
            <el-col :span="5">
                <div class="grid-box">
                    <p class="grid-num">￥ 45000.00<i class="iconfont icon-huikuanjihua"></i></p>
                    <p class="tx-gray">已收款金额</p>
                </div>
            </el-col>
            <el-col :span="5">
                <div class="grid-box">
                    <p class="grid-num">￥ 45000.00<i class="iconfont icon-fukuan"></i></p>
                    <p class="tx-gray">计划收款金额</p>
                </div>
            </el-col>
        </el-row>
        <el-row type="flex" class="item—box mt-0" justify="space-around">
            <el-col :span="5">
                <div class="grid-box">
                    <p class="grid-num">3<i class="iconfont icon-hailiangxiansuo"></i></p>
                    <p class="tx-gray">新增线索</p>
                </div>
            </el-col>
            <el-col :span="5">
                <div class="grid-box">
                    <p class="grid-num">3<i class="iconfont icon-kehu"></i></p>
                    <p class="tx-gray">新增客户数</p>
                </div>
            </el-col>
            <el-col :span="5">
                <div class="grid-box">
                    <p class="grid-num">3<i class="iconfont icon-lianxiren"></i></p>
                    <p class="tx-gray">新增联系人数</p>
                </div>
            </el-col>
            <el-col :span="5">
                <div class="grid-box">
                    <p class="grid-num">3<i class="iconfont icon-shangji"></i></p>
                    <p class="tx-gray">新增机会数</p>
                </div>
            </el-col>
        </el-row>
        <h4 class="title">
            销售漏斗
            <el-select class="date-select" size="small" v-model="value2">
                <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </h4>
        <div class="funnel">
            <div class="funnel-left">
                <p>初步洽谈（100）  ￥10000.00</p>
                <p>需求确定（50） ￥8000.00</p>
                <p>谈判（20） ￥8000.00</p>
                <p>合作（15）￥5000.00</p>
                <p>赢单（10）￥3000.00</p>
            </div>
            <div class="funnel-right">
                <div class="funnel-item">
                    <div class="line"></div>
                    <div class="box box1"></div>
                </div>
                <div class="funnel-item item1">
                    <div class="line"></div>
                    <div class="box box2"></div>
                </div>
                <div class="funnel-item item2">
                    <div class="line"></div>
                    <div class="box box3"></div>
                </div>
                <div class="funnel-item item3">
                    <div class="line"></div>
                    <div class="box box4"></div>
                </div>
                <div class="funnel-item item4">
                    <div class="line"></div>
                    <div class="box box5"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                options1: [{
                value: '1',
                label: '本周'
                }, {
                value: '2',
                label: '本月'
                }, {
                value: '3',
                label: '上月'
                }, {
                value: '4',
                label: '本季度'
                }],
                value1: '1',
                options2: [{
                value: '1',
                label: '本月'
                }, {
                value: '2',
                label: '本季度'
                }, {
                value: '3',
                label: '上季度'
                }, {
                value: '4',
                label: '今年'
                }, {
                value: '5',
                label: '去年'
                }],
                value2: '1'
            }
        },
    }
</script>
<style lang="less" scoped>
    .title{
        height: 32px;
        margin-bottom: 10px;
    }
    .item—box{
        background: #fff;
        margin-bottom: 40px;
        padding: 30px 0;
        .grid-content {
            border-radius: 4px;
            min-height: 36px;
            text-align: center;
            height: 80px;
            color: #fff;
            p:first-of-type{
                font-size: 20px;
                padding: 10px 0;
            }
        }
        .grid-box{
            border: 1px solid #ddd;
            height: 70px;
            text-align: center;
            .grid-num{
                margin: 8px 0;
                font-weight: bold;
            }
            i{
                float: right;
                font-size: 40px;
                color: #fff;
                background: #0090ff;
                margin: 1px 10px 10px;
                font-weight: normal;
                padding: 4px;
            }
        }
        .bg1{
            background: #ff4d4d;
        }
        .bg2{
            background: #85c8dd;
        }
        .bg3{
            background: #d3e0e2;
        }
        .bg4{
            background: #e9f6f5;
        }
        .tx-gray{
            color: #999;
        }
    }
    .date-select{
        float: right;
        top: -5px;
        width: 120px;
    }
    .funnel{
        height: 280px;
        background: #fff;
        padding: 50px;
        .funnel-left{
            float: left;
            line-height: 45px;
            p{
                margin-bottom: 10px;
                padding-right: 20px;
            }
        }
        .funnel-right{
            overflow: auto;
            height: 300px;
        }
        .funnel-item{
            display: flex;
            margin-bottom: 10px;
            .line{
                flex: 1;
                height: 1px;
                background: #999;
                position: relative;
                top: 22px;
            }
            .box{
                height: 45px;
            }
            .box1{
                background: #03a9f5;
                width: 400px;
            }
            .box2{
                background: #28b6f6;
                width: 350px;
            }
            .box3{
                background: #4fc2f8;
                width: 300px;
            }
            .box4{
                background: #81d5fa;
                width: 250px;
            }
            .box5{
                background: #b3e5fc;
                width: 200px;
            }
            &.item1{
                padding-right: 25px;
            }
            &.item2{
                padding-right: 50px;
            }
            &.item3{
                padding-right: 75px;
            }
            &.item4{
                padding-right: 100px;
            }
        }
    }
</style>
