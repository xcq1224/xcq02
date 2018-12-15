<template>
    <div class="wrap-box">
        <div class="wrap-left">
            <el-tree :data="treeList" :props="defaultProps" node-key="id" :highlight-current="true" :default-expanded-keys="[1111]" style="float: left;">
                <div @click="chooseNote(data)" :class="data.id == id ? 'text-base' : ''" slot-scope="{ node, data }">
                    {{data.label}}
                </div>
            </el-tree>
        </div>
        <div class="wrap-right">
            <div class="handle">
                <a class="text-base">创建任务</a>
            </div>
            <div class="item" v-for="(item, index) in 5" :key="index" @click="showInfo">
                <div class="item-left">
                    <span>任务名称</span>
                    <span class="warn">!!!</span>
                </div>
                <div class="item-right">
                    <span class="tag" style="background: #ffff99;">标签</span><span class="tag" style="background: #cfc;">标签</span><span class="tag" style="background: #ffff99; width: 30px;">...</span>
                    <span style="color: #aaa;"><i class="iconfont icon-liebiao2" style="font-size: 18px;vertical-align: middle;margin-right: 10px;"></i>0/1</span>
                    <el-tooltip class="item" effect="dark" content="吴邪" placement="bottom">
                        <span class="mark">吴</span>
                    </el-tooltip>
                </div>
            </div>
            <div class="title">已完成</div>
            <div class="item" v-for="item in 3" :key="item.id">
                <div class="item-left">
                    <del>任务名称</del>
                    <span class="warn">!!!</span>
                </div>
                <div class="item-right">
                    <span class="tag" style="background: #f1a325;">标签</span><span class="tag" style="background: #ffff99;">标签</span><span class="tag" style="background: #ffff99; width: 30px;">...</span>
                    <span style="color: #aaa;"><i class="iconfont icon-liebiao2" style="font-size: 18px;vertical-align: middle;margin-right: 10px;"></i>0/1</span>
                    <el-tooltip class="item" effect="dark" content="吴邪" placement="bottom">
                        <span class="mark">吴</span>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div class="layer" @click="hideInfo"></div>
        <div class="info">
            <div class="handle-tab active">任务详情</div>
            <div class="handle-tab" style="top: 170px;">操作记录</div>
            <div class="info-box">
                
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isLayer: false,
                id: 1111,
                treeList: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1',
                            id: 1111,
                        }]
                    }]
                    }, {
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1',
                            id: 2222,
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1',
                            id: 3333
                        }]
                    }]
                    }, {
                    label: '一级 3',
                    children: [{
                        label: '二级 3-1',
                        children: [{
                            label: '三级 3-1-1',
                            id: 4444,
                        }]
                    }, {
                        label: '二级 3-2',
                        children: [{
                            label: '三级 3-2-1',
                            id: 5555
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tableData1: [],
                tableData2: [],
                viewText: '',
            };
        },
        mounted(){
        },
        methods: {
            viewChange(){
                // let str = this.viewText.slice(-1)
                // if(str == '@'){
                //     console.log(3333)
                //     this.viewText = this.viewText + '谢承权 '
                // }
                console.log(222)
            },
            chooseNote(data){
                if(!data.children){
                    this.id = data.id

                }
            },
            showInfo(){
                console.log(1111)
                $(".layer").show()
                $(".info").animate({right: "20px"})
            },
            hideInfo(){
                console.log(2222)
                $(".info").animate({right: "-700px"}, () => {
                    $(".layer").hide()
                })
            },
        }
    }
</script>
<style lang="less" scoped>
    .view-box{
        border: 1px solid #ddd;
        padding: 6px;
        border-radius: 6px;
    }
    .wrap-box{
        display: flex;
        height: 100%;
        font-size: 12px;
        position: relative;
    }
    .wrap-left{
        min-width: 200px;
        border-right: 1px solid #ddd;
    }
    .wrap-right{
        flex: 1;
        padding: 20px;
        .handle{
            margin-bottom: 10px;
        }
        .title{
            font-size: 18px;
            font-weight: bold;
            line-height: 40px;
        }
        .item{
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 5px 20px;
            margin-bottom: 15px;
            cursor: pointer;
            overflow: hidden;
            .item-left{
                float: left;
                line-height: 24px;
                .warn{
                    color: red;
                    font-weight: bold;
                }
            }
            .item-right{
                float: right;
                .tag{
                    display: inline-block;
                    width: 70px;
                    height: 18px;
                    text-align: center;
                    margin-right: 10px;
                }
                .mark{
                    display: inline-block;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    border: 1px solid #ddd; 
                    text-align: center;
                    line-height: 24px;
                    padding: 0;
                    margin: 0;
                    margin-left: 10px;
                    vertical-align: middle;
                }
            }
        }
    }
    .bt{
        border-bottom: 1px solid #333;
    }
    .cursor{
        cursor: pointer;
    }
    .info{
        position: fixed;
        width: 600px;
        height: 94%;
        right: -700px;
        top: 20px;
        border: 1px solid #ddd;
        background: #fff;
        padding: 0 15px;
        .info-box{
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .handle-tab{
            position: absolute;
            width:  20px;
            font-weight: bold;
            background: #ccc;
            color: #fff;
            padding: 6px;
            text-align: center;
            top: 80px;
            left: -28px;
            cursor: pointer;
            &.active{
                background: #f1a325;
            }
        }
        .info-header{
            padding: 5px 0;
            i{
                font-size: 32px;
                vertical-align: middle;
                color: #797979;
            }
            span{
                margin-right: 20px;
                cursor: pointer;
            }
        }
        .task, .record{
            flex: 1;
            overflow: auto;
        }
        .save-btn{
            display: inline-block;
            width: 60px;
            background: #169bd5;
            height: 28px;
            vertical-align: top;
            text-align: center;
            line-height: 28px;
            color: #fff;
            border-radius: 4px;
            margin-left: 5px;
        }
    }
    .icon-jia{
        vertical-align: middle;
        display: inline-block;
        line-height: 1;
    }
    .layer{
        position: absolute;
        width: 100%;
        height: 100%;
        display: none;
    }
</style>

