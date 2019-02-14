<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 配置商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

<template>
  <div class="container">
            <div class="handle-box">
                <el-input v-model="selectWord" placeholder="通过商品名称或编号搜索" class="handle-input mr10" @keyup.enter.native="getGoodsInfo"></el-input>
                <el-button type="primary" icon="search" @click="getGoodsInfo()">搜索</el-button>
                <el-button type="primary" icon="insert" class="handle-del mr10" @click="editVisible = true">新增商品信息</el-button>
                
            </div>
            <el-table :data="tableData"  class="table"  style="width: 100%" height="500">
                <el-table-column prop="tradeName" label="商品名称">
                </el-table-column>
                <el-table-column prop="profit" label="预期利润·单位 %">
                </el-table-column>
                <el-table-column prop="type" label="类别">
                </el-table-column>
                <el-table-column prop="goodFrom" label="来源">
                </el-table-column>
                <el-table-column prop="location" label="存放位置">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.goodsInfoId)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <!-- 分页插件 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[pagesize]" layout="total,prev,pager,next,jumper" :total="total">
                </el-pagination>
            </div>
        </div></el-tab-pane>



    
</template>


       
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑/新增商品" :visible.sync="editVisible" width="30%" center>
            <el-form ref="form" :model="form" :rules="rules" label-width="110px" status-icon>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="创建日期" prop="createTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.createTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="商品名称" prop="tradeName">
                            <el-input v-model="form.tradeName"></el-input>
                        </el-form-item>
                    </el-col>
              
                </el-row>
                <el-row>
             
                   <el-col :span="24">
                        <el-form-item label="来源" prop="goodFrom">
                            <el-input v-model="form.goodFrom"  placeholder=" 来源于哪个批发商"></el-input>
                        </el-form-item>
                    </el-col>
                    </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="类别" prop="type">
                            <el-input v-model="form.type" placeholder=" 米、油、调料等...."></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                  <el-row>
                    <el-col :span="24">
                        <el-form-item label="预期利润" prop="profit">
                            <el-input v-model="form.profit" placeholder="输入该商品预期利润，如5%、10%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                  <el-row>
                    <el-col :span="24">
                        <el-form-item label="商品所在位置" prop="location">
                            <el-input v-model="form.location" placeholder="输入该商品所在存放位置"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer" >
                <el-button type="primary" @click="saveGoods('form')">确 定</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
                
            </span>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer" >
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteGoods()">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>
<script>
export default {
    inject: ['reload'],
    userId: '',
    mounted: function() {
        this.getGoodsInfo();
    },
    data() {
        return {
            userId: localStorage.getItem('userId'),
            tableData: [],
            selectWord: '',
            editVisible: false,
            delVisible: false,
            goodsInfoId: "",
            form: {
                createTime: '',
                tradeName: '',
                goodFrom: '',
                location: '',
                type:"",
                profit:"",
                userId: "",
                identifier: "",
            },
            idx: -1,
            currentPage: 1,
            pagesize: 5,
            total: 0,
            activeName: 'first',
            rules: {
                tradeName: [{ required: true, message: '请填商品名称', trigger: 'blur' }],
                goodFrom: [{ required: true, message: '请填写商品来自哪个批发商', trigger: 'blur' }],
                location: [{ required: true, message: '请填写商品存放位置', trigger: 'blur' }],
                 profit: [{ required: true, message: '请填写商品预期利润', trigger: 'blur' }],
                 type: [{ required: true, message: '请填写商品所属类别', trigger: 'blur' }],

            }

        }
    },

    methods: {

        /*获取商品信息*/
        getGoodsInfo() {
            this
                .$axios
                .post('/goodsinfo/getGoodsInfo', {
                    userId: this.userId,
                    selectWord: this.selectWord

                })
                .then((response) => {
                    this.total = response.data.total
                    this.currentPage = response.data.current
                    this.tableData = response.data.records

                })
                .catch(function(error) {}.bind(this));

        },
        /*保存商品信息*/
        saveGoods(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {

                    this
                        .$axios
                        .post('/goodsinfo/saveGoodsInfo', {
                            userId: this.userId,
                            form: this.form
                        })
                        .then((response) => {
                            this.$message.success(`执行成功`);
                            this.reload();
                            this.editVisible = false;
                        })
                        .catch(function(error) {}.bind(this));
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
       
        /*分页处理*/
        handleSizeChange(val) {
            this.pagesize = val;
            console.log(`每页 ${val} 条`);

        },
        /*分页处理*/
        handleCurrentChange(val) {
            this.currentPage = val;
            console.log(`当前页: ${val}`);
        },
        /*编辑商品处理*/
        handleEdit(index, row) {
            this.idx = index;
            const item = this.tableData[index];
            this.form = {
                createTime: item.createTime,
                tradeName: item.tradeName,
                goodFrom: item.goodFrom,
                location: item.location,
                price: item.price,
                quantity: item.quantity,
                goodsId: item.goodsId,
                userId: item.userId,
                identifier: item.identifier
            }
            this.editVisible = true;
        },
        /*删除处理*/
        handleDelete(goodsInfoId) {
            this.goodsInfoId = goodsInfoId;
            this.delVisible = true;
        },
       

        // 保存编辑
        saveEdit() {
            this.$set(this.tableData, this.idx, this.form);
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx+1} 行成功`);
        },
        // 确定删除
        deleteGoods() {
            this
                .$axios
                .post('/goodsinfo/deleteGoodsInfo', {
                    goodsInfoId: this.goodsInfoId
                })
                .then((response) => {
                    console.log(response.data);
                    this.reload();
                    this.$message.success('删除成功');
            this.delVisible = false;
                })
                .catch(function(error) {}.bind(this));
            

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
