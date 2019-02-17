<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 商品管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="selectWord" placeholder="通过商品名称或编号搜索" class="handle-input mr10" @keyup.enter.native="getGoodsInfo"></el-input>
                <el-button type="primary" icon="search" @click="getGoodsInfo()">搜索</el-button>
                <el-button type="primary" icon="insert" class="handle-del mr10" @click="editVisible = true">新增出入库记录</el-button>
            </div>
            <el-table :data="tableData" border class="table" style="width: 100%" height="500">
                <el-table-column prop="tradeName" label="商品名称">
                </el-table-column>
                <el-table-column prop="identifier" label="出入库记录编号">
                </el-table-column>
                <el-table-column prop="status" label="出库/入库">
                </el-table-column>
                <el-table-column prop="price" label="单价">
                </el-table-column>
                <el-table-column prop="quantity" label="数量">
                </el-table-column>
                <el-table-column prop="sum" label="总价值">
                </el-table-column>
                <el-table-column label="进货时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime|moment1}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="goodFrom" label="来源">
                </el-table-column>
                <el-table-column prop="location" label="存放位置">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.goodsId)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <!-- 分页插件 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[pagesize]" layout="total,prev,pager,next,jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="新增/编辑记录" :visible.sync="editVisible" width="60%" center >
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" status-icon>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="记录日期" prop="createTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.createTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row>
                      <el-form-item label="" prop="createTime">
                <el-radio v-model="form.status" label="out">出库</el-radio>
  <el-radio v-model="form.status" label="come">入库</el-radio>
</el-form-item>
</el-row>
                <el-row>
                    <el-col :span="12">
                        <!-- <el-form-item label="商品名称" prop="tradeName">
                            <el-input v-model="form.tradeName"></el-input>
                        </el-form-item> -->
                          <el-form-item label="名称" prop="goodFrom">
                        <el-select  v-model="form.tradeName" filterable placeholder="商品名称" width="100%">
                            <el-option v-for="item in goodsNameList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                         </el-form-item>
                    </el-col>
                    <el-col v-if="form.status=='come'" :span="12" >
                        <el-form-item label="来源" prop="goodFrom" >
                             <el-select   v-model="form.goodFrom" filterable placeholder="选择批发商" width="100%">
                            <el-option v-for="item in getWholesalerNameList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                          <!--   <el-input v-model="form.goodFrom"></el-input> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="单价" prop="price">
                            <el-input v-model="form.price"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量" prop="quantity">
                            <el-input v-model="form.quantity"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="form.status=='come'">
                    <el-col :span="12">
                        <el-form-item label="存放位置" prop="location">
                            <el-input v-model="form.location"></el-input>
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
        this.getGoodsInfoList();
        this.getWholesalerList();
    },
  /*  created() {
    const start = new Date();
    
    this.form.createTime =start;
},*/
    data() {
        return {
            userId: localStorage.getItem('userId'),
            tableData: [],
        
            selectWord: '',
            editVisible: false,
            delVisible: false,
            goodsId: "",
            goodsNameList: [],         //可选择商品
            getWholesalerNameList:[],  //可选择来源
            form: {
                status:"",//出入库判断
                createTime: '',
                tradeName: '',
                goodFrom: '',
                location: '',
                price: 1,
                quantity: 1,
                goodsId: "",
                userId: "",
                identifier: "",
            },
            idx: -1,
            currentPage: 1,
            pagesize: 5,
            total: 0,
            rules: {

                tradeName: [{ required: true, message: '请填商品名称', trigger: 'blur' }],
                location: [{ required: true, message: '请填写商品存放位置', trigger: 'blur' }],
                price: [{ required: true, message: '请填写商品单价', trigger: 'blur' }],
                quantity: [{ required: true, message: '请填写商品数量', trigger: 'blur' }],

            }
        }
    },

    methods: {

        /*获取商品信息*/
        getGoodsInfo() {
            this
                .$axios
                .post('/goods/getGoodsInfo', {
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
        /*保存商品*/
        saveGoods(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {

                    this
                        .$axios
                        .post('/goods/saveGoods', {
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
        handleDelete(goodsId) {
            this.goodsId = goodsId;
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
                .post('/goods/deleteGoods', {
                    goodsId: this.goodsId
                })
                .then((response) => {
                    console.log(response.data);
                    this.reload();
                })
                .catch(function(error) {}.bind(this));
            this.$message.success('删除成功');
            this.delVisible = false;

        },
        /*获取商品的信息-选择框时用到-在商品配置那里配置后可以选择*/
        getGoodsInfoList() {
            this
                .$axios
                .post('/goods/getGoodsInfoList', {
                    userId: this.userId,
                })
                .then((response) => {
                    console.log(response.data)
                    this.goodsNameList = response.data
                })
                .catch(function(error) {}.bind(this));
        },
 /*获取批发商的信息-选择框时用到在商品配置那里配置后可以选择*/
        getWholesalerList() {
            this
                .$axios
                .post('/wholesaler/getWholesalerList', {
                    userId: this.userId,
                    status:'wholesaler'
                })
                .then((response) => {
                    console.log(response.data)
                    this.getWholesalerNameList = response.data
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
