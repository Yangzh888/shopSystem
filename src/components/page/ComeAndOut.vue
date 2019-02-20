<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 收支统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="saveBudgetDailog = true">新增记录
                </el-button>
                <el-input placeholder="筛选关键词" class="handle-input mr10" v-model="selectWord"></el-input>
                <el-button type="primary" icon="search">搜索</el-button>
            </div>
            <el-tabs type="border-card">
                <el-tab-pane label="按天查看">
                    <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" stripe style="width: 100%">
                        <el-table-column label="记录日期" width="180">
                            <template slot-scope="scope">
                                <div>{{scope.row.createTime|moment1}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="inSum" label="当天营业额(元)" width="180">
                        </el-table-column>
                        <el-table-column prop="outSum" label="当天支出(元)">
                        </el-table-column>
                        <el-table-column prop="memo" label="备注信息">
                        </el-table-column>
                        <el-table-column label="时间" width="180">
                            <template slot-scope="scope">
                                <div>{{scope.row.createTime|moment1}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.budgetId)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="block">
                        <!-- 分页插件 -->
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[pagesize]" layout="total, sizes, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="按月查看">按月查看</el-tab-pane>
                <el-tab-pane label="按年查看">按年查看</el-tab-pane>
            </el-tabs>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="新增/编辑记录" :visible.sync="saveBudgetDailog" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.createTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="当日收入">
                    <el-input v-model="form.inSum"></el-input>
                </el-form-item>
                <el-form-item label="当日支出">
                    <el-input v-model="form.outSum"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.memo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                                <el-button @click="saveBudgetDailog = false">取 消</el-button>
                                <el-button type="primary" @click="saveBudget">确 定</el-button>
                            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="responseTips" width="30%" center>
            <span style="font-weight:center">{{messageTip}}</span>
            <span slot="footer" class="dialog-footer">
                                            <el-button type="primary" @click="responseTips = false">确 定</el-button>
                                          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    mounted: function() {
        this.getBubgetData();
        this.selectPage();
    },
    inject: ['reload'],
    data() {
        return {
            selectWord: "",
            responseTips: false,
            messageTip: '',
            userId: localStorage.getItem('userId'),
            tableData: [],
            saveBudgetDailog: false,
            form: {
                inSum: '',
                outSum: '',
                createTime: '',
                memo:''
            },
            currentPage: 1,
            pagesize: 5,
            total: 0



        }
    },


    methods: {
        // 保存新增收支支出数据
        saveBudget() {
            this
                .$axios
                .post('/budget/saveBudget', {
                    userId: this.userId,
                    form: this.form
                })
                .then((response) => {
                   
                    this.responseTips = true;
                    this.saveBudgetDailog = false;
if(response.data.code=='200'){
    this.$message.success(response.data.data)
}else{
    this.$message.error(response.data.data)
}
                    this.reload()
                })
                .catch(function(error) {}.bind(this));
        },
        getBubgetData() {

            this
                .$axios
                .post('/budget/getBubgetData', {
                    userId: this.userId
                })
                .then((response) => {

                    this.tableData = response.data;

                })
                .catch(function(error) {
                    console.log(error.data)
                }.bind(this));
        },
        handleSizeChange(val) {
            this.pagesize = val;
            console.log(`每页 ${val} 条`);

        },
        handleCurrentChange(val) {
            this.currentPage = val;
            console.log(`当前页: ${val}`);
        },
        selectPage() {
            this
                .$axios
                .post('/budget/selectPage', {
                    userId: this.userId,
                    selectWord: this.selectWord
                })
                .then((response) => {

                    this.total = response.data.total
                    this.currentPage = response.data.current

                })
                .catch(function(error) {}.bind(this));
        },
        handleEdit(index,row) {
            console.log(index, row)
            this.idx = index;
            const item = this.tableData[index];
            this.form = {
                inSum: item.inSum,
                outSum: item.outSum ,
                createTime: item.createTime,
                memo:item.memo,
                userId: item.userId,
                budgetId: item.budgetId
            }
            this.saveBudgetDailog = true;
        },
        handleDelete(budgetId) {
            this
                .$axios
                .post('/budget/deleteBudgetById', {
                    budgetId: this.budgetId,
                })
                .then((response) => {
                    if (response.data.code === '200') {
                        this.$message.success(response.data.data)
                    } else {
                        this.$message.error(response.data.data)
                    }

                })
                .catch(function(error) { this.$message.error(response.data.data) }.bind(this));
        }
    }
}

</script>
<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.del-dialog-cnt {
    font-size: 16px;
    text-align: center
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

</style>
