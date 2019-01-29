<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 商品管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                
                <el-select v-model="select_cate" placeholder="商品类型" class="handle-select mr15">
                    <el-option key="1" label="米" value="米"></el-option>
                    <el-option key="2" label="油" value="油"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" >搜索</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量新增</el-button>
            </div>
            <el-table :data="tableData" border class="table"  @selection-change="handleSelectionChange">
                <el-table-column prop="tradeName" label="商品名称"  >
                </el-table-column>
                <el-table-column prop="identifier" label="编号">
                </el-table-column>
                <el-table-column prop="price" label="单价" >
                </el-table-column>
                <el-table-column prop="quantity" label="数量" >
                </el-table-column>
                <el-table-column prop="allPrice" label="总价值">
                </el-table-column>
                <el-table-column prop="creatTime" label="进货时间" >
                </el-table-column>
                <el-table-column prop="goodFrom" label="来源" >
                </el-table-column>
                <el-table-column prop="location" label="存放位置" >
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
                <div class="block">
                <!-- 分页插件 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[pagesize]"  layout="total,prev,pager,next,jumper" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑商品信息" :visible.sync="editVisible" width="60%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="进货日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="单价">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                  <el-form-item label="数量">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                  <el-form-item label="地址">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                  <el-form-item label="来源">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                  <el-form-item label="存放位置">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        inject: ['reload'],
        userId:'',
          mounted: function() {
        this.getGoodsInfo();
    },
        data() {
            return {
                userId: localStorage.getItem('userId'),
                tableData: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                editVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
                idx:-1,
            currentPage: 1,
            pagesize: 5,
            total: 0,
            }
        },
     
        methods: {
            getGoodsInfo(){
                 this
                    .$axios
                    .post('/goods/getGoodsInfo', {
                        userId: this.userId
                    })
                    .then((response) => {
                        console.log(response.data)
                        this.total=response.data.total
                        this.currentPage=response.data.current
                        this.tableData=response.data.records
                        
                    })
                    .catch(function(error) {}.bind(this));

            },
        handleSizeChange(val) {
            this.pagesize = val;
            console.log(`每页 ${val} 条`);

        },
        handleCurrentChange(val) {
            this.currentPage = val;
            console.log(`当前页: ${val}`);
        },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
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
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
</style>
