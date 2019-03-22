<template >
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
                    <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" stripe style="width: 100%" height="500" >
                        <el-table-column label="记录日期" width="180">
                            <template slot-scope="scope">
                                <div>{{scope.row.createTime|moment1}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="inSum" label="本次收入(元)" width="180">
                        </el-table-column>
                        <el-table-column prop="outSum" label="本次支出(元)">
                        </el-table-column>
                         <el-table-column prop="updater" label="记录人">
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
                                <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.creator==relationUserInfoId||level>0">编辑</el-button>
                                <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.budgetId)" v-if="scope.row.creator==relationUserInfoId||level>0">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="block">
                        <!-- 分页插件 -->
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[pagesize]" layout="total, sizes, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
              
            </el-tabs>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="新增/编辑记录" :visible.sync="saveBudgetDailog" width="30%">
            <el-form ref="form" :model="form" label-width="100px" :rules="rules" status-icon>
                <el-form-item label="日期" prop="createTime">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.createTime"  style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="本次收入" prop="inSum">
                    <el-input v-model.number="form.inSum"></el-input>
                </el-form-item>
                <el-form-item label="本次支出" prop="outSum">
                    <el-input v-model.number="form.outSum"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="form.memo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                                <el-button @click="saveBudgetDailog = false">取 消</el-button>
                                <el-button type="primary" @click="saveBudget('form')">确 定</el-button>
                            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    mounted: function() {
        this.getBubgetData();
        this.selectPage();
        this.getOneMonthComeAndOut();
    },
    inject: ['reload'],
    data() {
        return {
             level: localStorage.getItem('level'),
                  relationUserInfoId: localStorage.getItem('relationUserInfoId'),
            selectWord: "",
            selectMonth: '',
            messageTip: '',
            userId: localStorage.getItem('userId'),
            tableData: [],
            saveBudgetDailog: false,
            form: {
                     updater: localStorage.getItem('relationUserInfoName'),         //默认该字段为创建人姓名
                creator: localStorage.getItem('relationUserInfoId'),//默认该字段为创建人Id
                inSum: '',
                outSum: '',
                createTime: '',
                memo: ''
            },
            chartData: {
                columns: ['日期', '当天收入', '当天支出'],
                rows: []
            },
            currentPage: 1,
            pagesize: 8,
            total: 0,

            rules: {
                createTime: [{ type: 'date', required: true, message: '请选择日期', trigger: 'blur' }],
                inSum: [{ required: true, message: '请输入该次记录的收入金额', trigger: 'blur' },
                    { type: 'number', message: '收入金额必须为数字值' }
                ],
                outSum: [{ required: true, message: '请输入该次记录的支出金额', trigger: 'blur' },
                    { type: 'number', message: '支出金额也必须为数字值' }
                ],

            }

        }
    },


    methods: {
        // 保存新增收支支出数据
        saveBudget(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this
                        .$axios
                        .post('/budget/saveBudget', {
                            userId: this.userId,
                            form: this.form
                        })
                        .then((response) => {


                            this.saveBudgetDailog = false;
                            if (response.data.code == '200') {
                                this.$message.success(response.data.data)
                            } else {
                                this.$message.error(response.data.data)
                            }
                            this.reload()
                        })
                        .catch(function(error) {}.bind(this));
                } else {

                    return false;
                }
            });

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
            this.selectPage(val)
            console.log(`当前页: ${val}`);
        },
        selectPage(current) {
            this
                .$axios
                .post('/budget/selectPage', {
                    userId: this.userId,
                    selectWord: this.selectWord,
                    current: current
                })
                .then((response) => {
                    this.total = response.data.total
                    this.currentPage = response.data.current

                })
                .catch(function(error) {}.bind(this));
        },
        handleEdit(index, row) {
            console.log(index, row)
            this.idx = index;
            const item = this.tableData[index];
            this.form = {
                inSum: item.inSum,
                outSum: item.outSum,
                createTime: item.createTime,
                memo: item.memo,
                userId: item.userId,
                budgetId: item.budgetId
            }
            this.saveBudgetDailog = true;
        },

        handleDelete(budgetId) {
            this.$confirm('此操作将永久删除该条待办, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this
                    .$axios
                    .post('/budget/deleteBudgetById', {
                        budgetId: budgetId,
                    })
                    .then((response) => {

                        if (response.data.code == 200) {
                            this.$message.success(response.data.data)
                        } else {
                            this.$message.error(response.data.data)
                        }
                        this.reload()

                    })
                    .catch(function(error) {}.bind(this));
            }).catch(() => {

            });
        },
        getOneMonthComeAndOut() {
            this
                .$axios
                .post('/budget/getOneMonthComeAndOut', {
                    userId: this.userId,
                    selectMonth: this.selectMonth,
                })
                .then((response) => {
                    this.chartData.rows = response.data
                })
                .catch(function(error) {}.bind(this));
        },
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
