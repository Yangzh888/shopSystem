<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>商铺管理系统描述</span>
                    </div>
                    <div style="width: 100%;height: 300px">
                        <div class="text item">
                            <el-tree :data="data"  @node-click="handleNodeClick" node-key="id" :default-expanded-keys="[1,2,3,4]" :default-checked-keys="[12,13,21,22,31,32,41,42]"></el-tree>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>待办工作</span>
                    </div>
                    <div style="width: 100%;height:300px">
                        <el-table :data="todoList" style="width: 100%;height:270px" size=mini>
                            <el-table-column label="标题">
                                <template slot-scope="scope">
                                    <div class="message-title">{{scope.row.title}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="内容">
                                <template slot-scope="scope">
                                    <div class="message-title">{{scope.row.memo}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="创建时间" width="180">
                                <template slot-scope="scope">
                                    <div class="todo-item">{{scope.row.createTime|moment}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <!--  <a href="javascript:;" @click="editReadyDo(scope.row.othersId)">  <i class="el-icon-edit"></i></a> -->
                                    <a href="javascript:;" @click="deleteReadyDo(scope.row.othersId)"> <i class="el-icon-delete"></i></a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[pagesize]" layout="total, sizes, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row style="height:30px"></el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>商铺2019年各个季度营业额</span>
                    </div>
                    <ve-pie :data="chartData"></ve-pie>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>最近七天销售情况</span>
                    </div>
                    <div>
                        <ve-line :data="comeAndOutData"></ve-line>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
export default {
    inject: ['reload'],
    userId: '',
    /* 打开页面自动获取后台数据*/
    mounted: function() {
        this.getRealyDoList();
        this.getQuarterInfo();
        this.getEchartsComeAndOutData();
    },
    data() {
        return {
            data: [{
                    id: 1,
                    label: '商品管理',
                    children: [{
                        id: 12,
                        label: '商品出入库记录',
                        children: [{
                            label: '新建记录前先配置商品、客户、批发商后新建选择项时即可选择'
                        }]
                    }, {
                        id: 13,
                        label: '配置商品',
                        children: [{
                            label: '预警数量，当仓库低于改数量时，顶部左上角会产生一条待办提醒进货。'
                        },
                        ]
                    },
                    {
                        id: 14,
                        label: '预计利润',
                        children: [{
                            label: '预计利润为百分百，往后计算的利润都是按该百分比计算利润总额'
                        },
                        
                        ]
                    }]
                },
                {
                    id: 2,
                    label: '待办管理',
                    children: [{
                        id: 21,
                        label: '待办介绍',
                        children: [{
                            label: '可自定义创建待办，系统在商品数量低于自定义库存警告时自动生成待办。'
                        }]
                    }],

                },
                {
                    id: 3,
                    label: '客户管理',
                    children: [{
                        id: 31,
                        label: '批发商管理',
                        children: [{
                            label: '创建批发商后可以关联入库订单。出入库记录成功后可查看该批发商的相关订单'
                        }]
                    }, {
                        id: 32,
                        label: '客户管理',
                        children: [{
                            label: '创建客户成可以关联出库订单。即售出订单。出入库记录成功后可查看该客户的相关订单'
                        }]
                    }]
                },
                {
                    id: 4,
                    label: '收支统计',
                    children: [{
                        id: 41,
                        label: '按日记录',
                        children: [{
                            label: '记录当天的某一笔订单金额，同一天可多次记录。'
                        }]
                    }, {
                        id: 42,
                        label: '收支分析',
                        children: [{
                            label: '可查看某年某月的收支信息，如无记录，则当月显示无'
                        }]
                    }]
                },
            ],

            userId: localStorage.getItem('userId'),
            level: localStorage.getItem('level'),
            chartData: {
                columns: ['季度', '该季度营业额'],
                rows: [

                ]
            },
            comeAndOutData: {
                columns: ['日期', '当天收入', '当天支出'],
                rows: [

                ]
            },
            todoList: [],
            /*分页数据*/
            currentPage: 1,
            pagesize: 3,
            total: 0,
            currentPage: 1
        }
    },
    methods: {
        saveReadyDo() { //保存待办信息
            this
                .$axios
                .post('/others/saveReadyDo', {
                    userId: this.userId,
                    readyDoform: this.readyDoform,

                })
                .then((response) => {
                    this.reload()

                })
                .catch(function(error) {}.bind(this));
        },
        getQuarterInfo() { //获取季度图表信息
            this
                .$axios
                .post('/budget/getQuarterInfo', {
                    userId: this.userId,
                    year: '2019',

                })
                .then((response) => {
                    console.log(response.data)
                    this.chartData.rows = response.data

                })
                .catch(function(error) {}.bind(this));
        },
        handleSizeChange(val) {
            this.pagesize = val;
            console.log(`每页 ${val} 条`);

        },
        handleCurrentChange(val) {
            this.getRealyDoList(val);
            console.log(`当前页: ${val}`);
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

                        this.reload();
                    })
                    .catch(function(error) {}.bind(this));
            }).catch(() => {

            });
        },
        getRealyDoList(current) {
            this
                .$axios
                .post('/others/selectPage', {
                    userId: this.userId,
                    status: 'unRead',
                    current: current
                })
                .then((response) => {

                    this.total = response.data.total
                    this.currentPage = response.data.current
                    this.todoList = response.data.records

                })
                .catch(function(error) {}.bind(this));
        },
        getSumByUserId() {
            this
                .$axios
                .post('/goods/getSumByUserId', {
                    userId: this.userId
                })
                .then((response) => {

                    this.sum = response.data.data

                })
                .catch(function(error) {}.bind(this));
        },
        getEchartsComeAndOutData() {
            this
                .$axios
                .post('/budget/getEchartsComeAndOutData', {
                    userId: this.userId
                })
                .then((response) => {

                    this.comeAndOutData.rows = response.data
                })
                .catch(function(error) {}.bind(this));
        },
        handleNodeClick(data) {
            console.log(data);
        }
    }
}

</script>
<style scoped>
.text {
    font-size: 14px;
}

.indexPtype {
    margin: 10px;
    font-size: 18px;
    color: red;
    font-weight: bold;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 100%;
}

</style>
