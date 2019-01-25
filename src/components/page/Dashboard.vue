<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="static/img/666.jpg" class="user-avator" >
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">商铺:<span>{{shopName}}</span></div>
                </el-card>
                <el-card shadow="hover" style="height:300px;">
                    <div slot="header" class="clearfix">
                        <span>常见热销物品存货情况</span>
                    </div>
                    江苏大米
                    <el-progress :percentage="71.3" color="#42b983"></el-progress>
                    金龙鱼5l花生油
                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>
                    黄豆100KG
                    <el-progress :percentage="3.7"></el-progress>
                    海天生抽1.8L
                    <el-progress :percentage="0.9" color="#f56c6c"></el-progress>
                      食用盐
                    <el-progress :percentage="50" color="#f56c6c"></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234</div>
                                    <div>仓库预估成本</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321</div>
                                    <div>仓库预估利润</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>当前商铺总价值</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:450px;">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 1px 0" type="text" @click="showAddReadyDo = true">添加</el-button>
                    </div>
                    <el-table :data="todoList.slice((currentPage-1)*pagesize,currentPage*pagesize)" :height="304" style="width: 100%;font-size:14px;">
                        
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="标题">
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间">
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.createTime|moment}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <a href="javascript:;" @click="editReadyDo(scope.row.othersId)">  <i class="el-icon-edit"></i></a>
                                <a href="javascript:;" @click="deleteReadyDo(scope.row.othersId)"> <i class="el-icon-delete"></i></a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="block">
                <!-- 分页插件 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[pagesize]"  layout="total,prev,pager,next,jumper" :total="total">
                </el-pagination>
            </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :data="InComeList" type="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :data="OutComeList" type="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="提示" :visible.sync="showAddReadyDo" width="30%" center>
            <el-form :label-position="left" label-width="80px" :model="formLabelAlign">
                <el-form-item label="标题">
                    <el-input v-model="formLabelAlign.title"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <span class="demonstration"></span>
                    <el-date-picker v-model="formLabelAlign.date" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button @click="showAddReadyDo = false">取 消</el-button>
                        <el-button type="primary"  @click="saveReadyDo()" >确 定</el-button>
                      </span>
        </el-dialog>
    </div>
</template>
<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
export default {
    inject: ['reload'],
    name: 'dashboard',
    shopName: 'dashboard',
    userId: '',
    inject: ['reload'],
    /* 打开页面自动获取后台数据*/
    mounted: function() {
        this.getOthersDate();
        this.getEchartsInComeData();
        this.getEchartsOutComeData();
        this.selectPage();
    },
    data() {
        return {
            left: 'left', //代办弹出层的对齐方式
            name: localStorage.getItem('ms_username'), //获取存在localStorage的值
            shopName: localStorage.getItem('shopName'),
            userId: localStorage.getItem('userId'),
            othersId: '',
            showAddReadyDo: false, //设置代办弹框为false，点击为true显示
            todoList: [],
            InComeList: [  {
                                    name: '1699/01/01',
                                    value: 0
                                }, {
                                    name: '1699/12/32',
                                    value: 0
                                }],
            OutComeList: [  {
                                    name:'1699/01/01',
                                    value: 0
                                }, {
                                    name: '1699/12/32',
                                    value: 0
                                }],
            formLabelAlign: {
                title: '',
                date: ''
            },
            currentPage: 1,
            pagesize: 5,
            total: 0,
          


            options: {
                title: '最近七天每天入账金额（元）',
  autoWidth: true,   // 设置宽高自适应
                fillColor: 'rgb(45, 140, 240)',
                bottomPadding: 20,
                topPadding: 20
            },
            options2: {
                title: '最近七天每天出账金额（元）',
  autoWidth: true,   // 设置宽高自适应
                fillColor: '#FC6FA1',
                axisColor: '#008ACD',
                contentColor: '#EEEEEE',
                bgColor: '#F5F8FD',
                bottomPadding: 30,
                topPadding: 30
            }
        }
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    created() {
        this.handleListener();

    },
    activated() {
        this.handleListener();
    },
    deactivated() {
        window.removeEventListener('resize', this.renderChart);
        bus.$off('collapse', this.handleBus);
    },
    methods: {
        handleListener() {
            bus.$on('collapse', this.handleBus);
            // 调用renderChart方法对图表进行重新渲染
            window.addEventListener('resize', this.renderChart)
        },
        handleBus(msg) {
            setTimeout(() => {
                this.renderChart()
            }, 300);
        },
        renderChart() {
            this.$refs.bar.renderChart();
            this.$refs.line.renderChart();
        },

        handleSizeChange(val) {
            this.pagesize = val;
            console.log(`每页 ${val} 条`);

        },
        handleCurrentChange(val) {
            this.currentPage = val;
            console.log(`当前页: ${val}`);
        },
        getOthersDate() { //获取待办信息数据
/*
            this
                .$axios
                .post('/others/getOthersDate', {
                    userId: this.userId
                })
                .then((response) => {
                    this.todoList = response.data
                })
                .catch(function(error) {}.bind(this));*/

        },
        saveReadyDo() { //保存待办信息
            this
                .$axios
                .post('/others/saveReadyDo', {
                    userId: this.userId,
                    formLabelAlign: this.formLabelAlign
                })
                .then((response) => {
                    this.reload()

                })
                .catch(function(error) {}.bind(this));
        },
        getEchartsInComeData() { //获取图表数据
            this
                .$axios
                .post('/budget/getEchartsInComeData', {
                    userId: this.userId
                })
                .then((response) => {

                    this.InComeList = response.data
                })
                .catch(function(error) {}.bind(this));
        },

        getEchartsOutComeData() {
            this
                .$axios
                .post('/budget/getEchartsOutComeData', {
                    userId: this.userId
                })
                .then((response) => {

                    this.OutComeList = response.data
                })
                .catch(function(error) {}.bind(this));
        },
        editReadyDo(val) {
            console.log(val);
        },
        deleteReadyDo(val) {
            this.$confirm('此操作将永久删除该条待办, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                /*this.$message({
                    type: 'success',
                    message: '删除成功!'*/
                this
                    .$axios
                    .post('/others/deleteReadyDo', {
                        othersId: val
                    })
                    .then((response) => {
                        console.log(response.data)
                        this.reload();
                    })
                    .catch(function(error) {}.bind(this));
            }).catch(() => {

            });
        },
        selectPage(){
            this
                    .$axios
                    .post('/others/selectPage', {
                        userId: this.userId
                    })
                    .then((response) => {
                        console.log(response.data)
                        this.total=response.data.total
                        this.currentPage=response.data.current
                        this.todoList=response.data.records
                        
                    })
                    .catch(function(error) {}.bind(this));
        }
    }
}

</script>
<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 22px;
    color: #222;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}

</style>
