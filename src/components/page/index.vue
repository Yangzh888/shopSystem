<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>商铺管理系统描述</span>
                    </div>
                    <div style="width: 100%;height: 300px">
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>待办工作</span>
                    </div>
                    <div style="width: 100%;height:300px">
                        <el-table :data="todoList" style="width: 100%;height:270px" size=mini >
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
            userId: localStorage.getItem('userId'),
            chartData: {
                columns: ['季度', '该季度营业额'],
                rows: [
                  
                ]
            },
             comeAndOutData: {
                columns: ['日期', '当天收入','当天支出'],
                rows: [
                  
                ]
            },
            todoList: [],  /*分页数据*/
            currentPage: 1,
            pagesize: 5,
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
                    year:'2019',
        
                })
                .then((response) => {
                    console.log(response.data)
                    this.chartData.rows=response.data

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
                    current:current
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
    }
}

</script>
<style scoped>
.text {
    font-size: 14px;
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
