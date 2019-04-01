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
                <el-select v-model="selectType" placeholder="请选择出入库类型">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="出库" value="out"></el-option>
                    <el-option label="入库" value="come"></el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="getGoodsInfo()">搜索</el-button>
                <el-button type="primary" icon="insert" class="handle-del mr10" @click="handleDeleteeditVisible()">新增出入库记录</el-button>
            </div>
            <el-table :data="tableData" border class="table" style="width: 100%" height="570" size=mini>
                <el-table-column prop="tradeName" label="商品名称">
                </el-table-column>
                <el-table-column prop="identifier" label="出入库记录编号">
                </el-table-column>
                <el-table-column prop="statusToString" label="出库/入库">
                </el-table-column>
                <el-table-column label="单价">
                    <template slot-scope="scope">
                        <div style="color:red">{{scope.row.price}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="quantity" label="数量">
                </el-table-column>
                <el-table-column prop="sum" label="总价值">
                </el-table-column>
                <el-table-column label=出入库时间>
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime|moment1}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="客户/批发商">
                    <template slot-scope="scope">
                        <div>{{scope.row.wholesalerName?scope.row.wholesalerName:scope.row.customerName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="存放位置">
                </el-table-column>
                 <el-table-column prop="updater" label="创建人">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.creator==relationUserInfoId||level>0">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.goodsId)" v-if="scope.row.creator==relationUserInfoId||level>0">删除</el-button>
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
        <el-dialog title="新增/编辑记录" :visible.sync="editVisible" width="40%" center>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" status-icon>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="记录日期" prop="createTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.createTime" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="出入库状态" prop="status" v-if="form.userId==''">
                        <el-radio v-model="form.status" label="out">出库</el-radio>
                        <el-radio v-model="form.status" label="come">入库</el-radio>
                    </el-form-item>
                    <el-form-item label="出入库状态" prop="status" v-if="form.userId!=''">
                        <el-radio disabled v-model="form.status" label="out">出库</el-radio>
                        <el-radio disabled v-model="form.status" label="come">入库</el-radio>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <!-- <el-form-item label="商品名称" prop="tradeName">
                            <el-input v-model="form.tradeName"></el-input>
                        </el-form-item> -->
                        <el-form-item label="名称" prop="tradeName">
                            <el-select v-model="form.tradeName" filterable placeholder="商品名称" width="100%">
                                <el-option v-for="item in goodsNameList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.status=='come'" :span="12">
                        <el-form-item label="关联批发商" prop="wholesalerId">
                            <el-select v-model="form.wholesalerId" filterable placeholder="选择批发商" width="100%">
                                <el-option v-for="item in getWholesalerNameList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <!--   <el-input v-model="form.goodFrom"></el-input> -->
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.status=='out'" :span="12">
                        <el-form-item label="关联客户" prop="customerId">
                            <el-select v-model="form.customerId" filterable placeholder="选择客户" width="100%">
                                <el-option v-for="item in getcustomerNameList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <!--   <el-input v-model="form.goodFrom"></el-input> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="单价" prop="price">
                            <el-input v-model.number="form.price"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量" prop="quantity">
                            <el-input v-model.number="form.quantity"></el-input>
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
        this.getCustomerNameList();
    },
    /*  created() {
    const start = new Date();
    
    this.form.createTime =start;
},*/
    data() {
        return {
            userId: localStorage.getItem('userId'),
               level: localStorage.getItem('level'),
                  relationUserInfoId: localStorage.getItem('relationUserInfoId'),
            tableData: [],
            selectType: '',
            selectWord: '',
            editVisible: false,
            delVisible: false,
            goodsId: "",
            goodsNameList: [], //可选择商品
            getWholesalerNameList: [], //可选择批发商
            getcustomerNameList: [], //可选择客户
            form: {
                updater: localStorage.getItem('relationUserInfoName'),         //默认该字段为创建人姓名
                creator: localStorage.getItem('relationUserInfoId'),//默认该字段为创建人Id
                status: '', //出入库判断
                createTime: '',
                tradeName: '',
                goodFrom: '',
                location: '',
                price: '',
                quantity: 1,
                goodsId: "",
                userId: "",
                identifier: "",
                goodsInfoId: "",
                wholesalerId: "",
                wholesalerName: "",
                customerId: "",
                customerName: "",
            },
            idx: -1,
            currentPage: 1,
            pagesize: 10,
            total: 0,
            rules: {
                createTime: [{ required: true, message: '请选择日期', trigger: 'blur' }],
                tradeName: [{ required: true, message: '请选择商品，若无你希望的商品，请去商品配置菜单出配置', trigger: 'blur' }],
                location: [{ required: true, message: '请填写商品存放位置', trigger: 'blur' }],
                status: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
                price: [{ required: true, message: '请填写商品单价', trigger: 'blur' },
                    { type: 'number', message: '单价必须为数字值' }
                ],
                quantity: [{ required: true, message: '请填写商品数量', trigger: 'blur' },
                    { type: 'number', message: '数量也必须为数字值' }
                ],
                wholesalerId: [{ required: true, message: '批发商不能为空', trigger: 'blur' }],
                customerId: [{ required: true, message: '客户不能为空', trigger: 'blur' }],

            }
        }
    },

    methods: {

        /*获取商品信息*/
        getGoodsInfo(current) {
           
            this
                .$axios
                .post('/goods/getGoodsInfo', {
    
                    current: current,
                    userId: this.userId,
                    selectWord: this.selectWord,
                    selectType: this.selectType
                })
                .then((response) => {
                    this.total = response.data.total
                    this.currentPage = response.data.current
                    this.tableData = response.data.records

                })
                .catch(function(error) {}.bind(this));

        },
        /*保存商品出入库记录*/
        saveGoods(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this
                        .$axios
                        .post('/goods/saveGoods', {
                            userId: this.userId,
                            form: this.form,
                        })
                        .then((response) => {
                            console.log(response.data);
                            if (response.data.code === 200) {
                                this.$message.success(response.data.message);
                                this.editVisible = false;
                            } else {
                                this.$message.error(response.data.message);
                            }
                            this.reload();

                        })
                        .catch(function(error) {}.bind(this));
                } else {

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
            this.getGoodsInfo(val);
            console.log(`当前页: ${val}`);
        },
        handleDeleteeditVisible(){
            this.form.userId='';
            this.editVisible=true;
        },
        /*编辑商品处理*/
        handleEdit(index, row) {
            this.idx = index;
            const item = this.tableData[index];
            this.form = {
                status: item.status,
                createTime: item.createTime,
                tradeName: item.tradeName,
                goodFrom: item.goodFrom,
                location: item.location,
                price: item.price,
                quantity: item.quantity,
                goodsId: item.goodsId,
                userId: item.userId,
                identifier: item.identifier,
                goodsInfoId: item.goodsInfoId,
                wholesalerId: item.wholesalerId,
                wholesalerName: item.wholesalerName,
                customerId: item.customerId,
                customerName: item.customerName,
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
                    if (response.data.code === 200) {
                        this.$message.success(response.data.message);
                        this.reload();
                    } else {
                        this.$message.error(response.data.message);
                    }
                    this.delVisible = false;

                })
                .catch(function(error) {}.bind(this));


        },
        /*获取商品的信息-选择框时用到-在商品配置那里配置后可以选择*/
        getGoodsInfoList() {
            this
                .$axios
                .post('/goods/getGoodsInfoList', {
                    userId: this.userId,
                })
                .then((response) => {

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
                    status: 'wholesaler'
                })
                .then((response) => {

                    this.getWholesalerNameList = response.data
                })
                .catch(function(error) {}.bind(this));
        },
        getCustomerNameList() {
            this
                .$axios
                .post('/wholesaler/getCustomerNameList', {
                    userId: this.userId,
                    status: 'customer'
                })
                .then((response) => {

                    this.getcustomerNameList = response.data
                })
                .catch(function(error) {}.bind(this));
        },
        /*   tableRowClassName({row, rowIndex}) {
           if (rowIndex === 1) {
             return 'warning-row';
           } else if (rowIndex === 3) {
             return 'success-row';
           }
           return '';
         }*/

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

/* .table-container-el-table.warning-row {
    background: oldlace;
  }

 .table-container-el-table.success-row {
    background: #f0f9eb;
  }*/

</style>
