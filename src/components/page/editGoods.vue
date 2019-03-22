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
                    <el-input v-model="selectWord" placeholder="通过商品名称搜索" class="handle-input mr10" @keyup.enter.native="getGoodsInfo"></el-input>
                    <el-button type="primary" icon="search" @click="getGoodsInfo()">搜索</el-button>
                    <el-button type="primary" icon="insert" class="handle-del mr10" @click="editVisible = true">新增商品信息</el-button>
                </div>
                <el-table :data="tableData" border class="table" style="width: 100%" height="500" size=mini>
                    <el-table-column prop="tradeName" label="商品名称">
                    </el-table-column>
                    <el-table-column prop="profit" label="预期利润·单位 %">
                        <template slot-scope="scope">
                            <div>{{scope.row.profit}}<span>%</span></div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类别">
                    </el-table-column>
                    <el-table-column prop="warmingNumber" label="警报库存">
                    </el-table-column>
                    <el-table-column prop="number" label="商品当前库存">
                    </el-table-column>
                    <el-table-column prop="location" label="存放位置">
                    </el-table-column>
                    <el-table-column label="操作" width="400" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"  v-if="scope.row.creator==relationUserInfoId||level>0">编辑</el-button>
                            <el-button type="text" icon="el-icon-edit" @click="handleEditComeAndOut(scope.row.goodsInfoId)">新增出入库信息</el-button>
                            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.goodsInfoId)"  v-if="scope.row.creator==relationUserInfoId||level>0">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <!-- 分页插件 -->
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[pagesize]" layout="total,prev,pager,next,jumper" :total="total">
                    </el-pagination>
                </div>
            </div>
            </el-tab-pane>
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
                        <el-form-item label="警报库存" prop="warmingNumber">
                            <el-input v-model.number="form.warmingNumber" placeholder=" 当商品数量低于该值会收到警报信息 "></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="类别" prop="type">
                            <el-input v-model="form.type" placeholder=" 输入该商品类别 ...."></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="预期利润" prop="profit">
                            <el-input v-model.number="form.profit" placeholder="输入该商品预期利润，如5%、10%"></el-input>
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
                <el-button type="primary" @click="saveGoodsInfo('form')">确 定</el-button>
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
        <!-- 编辑出入库弹出框 -->
        <el-dialog title="新增/编辑记录" :visible.sync="comeAndOutVisible" width="60%" center>
            <el-form ref="form" :model="comeAndOutForm" :rules="rules1" label-width="100px" status-icon>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="记录日期" prop="createTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="comeAndOutForm.createTime" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="出入库状态" prop="status">
                        <el-radio v-model="comeAndOutForm.status" label="out">出库</el-radio>
                        <el-radio v-model="comeAndOutForm.status" label="come">入库</el-radio>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <!-- <el-form-item label="商品名称" prop="tradeName">
                            <el-input v-model="form.tradeName"></el-input>
                        </el-form-item> -->
                        <el-form-item label="名称" prop="tradeName">
                            <el-select v-model="comeAndOutForm.tradeName" filterable placeholder="商品名称" width="100%">
                                <el-option v-for="item in goodsNameList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="comeAndOutForm.status=='come'" :span="12">
                        <el-form-item label="关联批发商" prop="wholesalerId">
                            <el-select v-model="comeAndOutForm.wholesalerId" filterable placeholder="选择批发商" width="100%">
                                <el-option v-for="item in getWholesalerNameList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <!--   <el-input v-model="form.goodFrom"></el-input> -->
                        </el-form-item>
                    </el-col>
                    <el-col v-if="comeAndOutForm.status=='out'" :span="12">
                        <el-form-item label="关联客户" prop="customerId">
                            <el-select v-model="comeAndOutForm.customerId" filterable placeholder="选择客户" width="100%">
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
                            <el-input v-model.number="comeAndOutForm.price"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量" prop="quantity">
                            <el-input v-model.number="comeAndOutForm.quantity"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="comeAndOutForm.status=='come'">
                    <el-col :span="12">
                        <el-form-item label="存放位置" prop="location">
                            <el-input v-model="comeAndOutForm.location"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer" >
                <el-button type="primary" @click="saveGoodsComeAndOut('form')">确 定</el-button>
                <el-button @click="comeAndOutVisible = false">取 消</el-button>
                
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
        this.getWholesalerList();
        this.getCustomerNameList();
        this.getGoodsInfoList();
    },
    data() {
        return {
            userId: localStorage.getItem('userId'),
               level: localStorage.getItem('level'),
                  relationUserInfoId: localStorage.getItem('relationUserInfoId'),
            tableData: [],
            selectWord: '',
            editVisible: false,
            delVisible: false,
            goodsInfoId: "",
            comeAndOutVisible: false,
            getcustomerNameList: '',
            getWholesalerNameList: '',
            goodsNameList: [],
            form: {
                updater: localStorage.getItem('relationUserInfoName'),         //默认该字段为创建人姓名
                creator: localStorage.getItem('relationUserInfoId'),//默认该字段为创建人Id
                createTime: '',
                tradeName: '',
                warmingNumber: '',
                location: '',
                type: "",
                profit: "",
                userId: ""
            },
            comeAndOutForm: {
                updater: localStorage.getItem('relationUserInfoName'),         //默认该字段为创建人姓名
                creator: localStorage.getItem('relationUserInfoId'),//默认该字段为创建人Id
                createTime: '',
                status: '',
                tradeName: '',
                wholesalerId: '',
                customerId: '',
                price: '',
                quantity: '',
                location: '',
                goodsId:'',
                userId:'',
                wholesalerId:'',
                customerId:'',
            },
            idx: -1,
            currentPage: 1,
            pagesize: 5,
            total: 0,
            activeName: 'first',
            rules: {//商品信息的rules
                createTime: [{ required: true, message: '请选择日期', trigger: 'blur' }],
                tradeName: [{ required: true, message: '请填商品名称', trigger: 'blur' }],
                warmingNumber: [{ required: true, message: '请填写商品警告库存，低于该值系统会发出警告', trigger: 'blur' },
                    { type: 'number', message: '单价必须为数字值' }
                ],
                location: [{ required: true, message: '请填写商品存放位置', trigger: 'blur' }],
                profit: [{ required: true, message: '请填写商品预期利润', trigger: 'blur' },
                    { type: 'number', message: '单价必须为数字值' }
                ],


            },
             rules1: {//出入库的rules
                createTime: [{   required: true, message: '请选择日期', trigger: 'blur' }],
                tradeName: [{ required: true, message: '请选择商品，若无你希望的商品，请去商品配置菜单出配置', trigger: 'blur' }],
                location: [{ required: true, message: '请填写商品存放位置', trigger: 'blur' }],
                 status: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
                price: [{ required: true, message: '请填写商品单价', trigger: 'blur'},
                  { type: 'number', message: '单价必须为数字值'}
                ],
                quantity: [{ required: true, message: '请填写商品数量', trigger: 'blur' },
                 { type: 'number', message: '数量也必须为数字值'}],
                 wholesalerId: [{ required: true, message: '批发商不能为空', trigger: 'blur' }],
                     customerId: [{ required: true, message: '客户不能为空', trigger: 'blur' }],

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
        /*保存商品出入库记录*/
        saveGoodsComeAndOut(comeAndOutForm) {
            this.$refs[comeAndOutForm].validate((valid) => {
                if (valid) {
                    this
                        .$axios
                        .post('/goods/saveGoods', {
                            userId: this.userId,
                            form: this.comeAndOutForm
                        })
                        .then((response) => {
                            console.log(response.data);
                            if (response.data.code === 200) {
                                this.$message.success(response.data.message);
                                this.comeAndOutVisible = false;
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
        /*保存商品信息*/
        saveGoodsInfo(form) {
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
        /*编辑商品处理*/
        handleEdit(index, row) {
            this.idx = index;
            const item = this.tableData[index];
            this.form = {
                createTime: item.createTime,
                tradeName: item.tradeName,
                warmingNumber: item.warmingNumber,
                location: item.location,
                type: item.type,
                profit: item.profit,
                goodsInfoId: item.goodsInfoId,
                userId: item.userId,

            }
            this.editVisible = true;
        },
        /*删除处理*/
        handleDelete(goodsInfoId) {
            this.goodsInfoId = goodsInfoId;
            this.delVisible = true;
        },

        handleEditComeAndOut(val) {
            this.comeAndOutForm.tradeName = val;
            this.comeAndOutVisible = true;
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
