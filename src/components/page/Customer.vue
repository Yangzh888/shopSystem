<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 客户管理</el-breadcrumb-item>
                <el-breadcrumb-item>客户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
         <div class="container">
            <div class="handle-box">
                <el-input v-model="selectWord" placeholder="通过客户名称进行搜索" class="handle-input mr10" @keyup.enter.native="getGoodsInfo"></el-input>
                <el-button type="primary" icon="search" @click="getGoodsInfo()">搜索</el-button>
                <el-button type="primary" icon="insert" class="handle-del mr10" @click="editVisible = true">新增客户</el-button>
            </div>
            <el-table :data="tableData" border class="table" style="width: 100%" height="500" size=mini>
                  
                <el-table-column prop="linkMan" label="客户名称">
                </el-table-column>
                <el-table-column prop="phone" label="电话">
                </el-table-column>
                <el-table-column prop="address" label="地址">
                </el-table-column>
                
                  <el-table-column prop="memo" label="备注信息">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"v-if="scope.row.creator==relationUserInfoId||level>0" >编辑</el-button>
                         <el-button type="text" icon="el-icon-info" class="info" @click="handleSelect(scope.row.wholesalerId)">相关订单</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.goodsId)" v-if="scope.row.creator==relationUserInfoId||level>0" >删除</el-button>
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
        <el-dialog title="新增/编辑" :visible.sync="editVisible" width="35%" center>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" status-icon>
                 <el-row>
                    <el-col :span="24">
                        <!-- <el-form-item label="商品名称" prop="tradeName">
                            <el-input v-model="form.tradeName"></el-input>
                        </el-form-item> -->
                          <el-form-item label="客户名称" prop="linkMan">
                        <el-input v-model="form.linkMan"></el-input>
                         </el-form-item>
                    </el-col>
                </el-row>
                    <el-row>
                    <el-col :span="24">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model.number="form.phone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                  <el-row>
                    <el-col :span="24">
                        <el-form-item label="联系地址" prop="address">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>
                    </el-col>
             </el-row>
                     <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注信息" prop="memo">
                            <el-input v-model="form.memo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer" >
                <el-button type="primary" @click="saveWholesaler('form')">确 定</el-button>
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

        <el-dialog border title='订单关联查询' :visible.sync="OrderTableVisible" width="70%">
            <el-input v-model="selectWordByDailog" placeholder="通过商品名称进行搜索" class="handle-input mr10" @keyup.enter.native="getAboutCustomerList()" size="medium"></el-input>
            <el-button type="primary" icon="search" @click="getAboutCustomerList()" size="medium">搜索</el-button>
            <el-table :data="aboutCustmerList" height="580" size=mini>
                <el-table-column label="客户名称">
                    <template slot-scope="scope">
                        <div>{{scope.row.wholesalerName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="tradeName" label="商品名称">
                </el-table-column>
                <el-table-column prop="identifier" label="出入库记录编号">
                </el-table-column>
                <el-table-column prop="status" label="出库/入库">
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
                 <el-table-column prop="updater" label="创建人">
                </el-table-column>
                <el-table-column label=出库时间>
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime|moment1}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="存放位置">
                </el-table-column>
            </el-table>
            <div class="block">
                <!-- 分页插件 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChangeDialog" :current-page="handleCurrentChangeDialog" :page-sizes="[dialogPagesize]" layout="total,prev,pager,next,jumper" :total="dialogTotal">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {isvalidPhone} from '../page/validate'
      var validPhone=(rule, value,callback)=>{
      if (!value){
          callback(new Error('请输入电话号码'))
      }else  if (!isvalidPhone(value)){
        callback(new Error('请输入正确的11位手机号码'))
      }else {
          callback()
      }
  }
export default {
    inject: ['reload'],
    userId: '',
    mounted: function() {
        this.getWholesaler();
        this.getGoodsInfoList();
    },
    data() {
        return {
            userId: localStorage.getItem('userId'),
                level: localStorage.getItem('level'),
                  relationUserInfoId: localStorage.getItem('relationUserInfoId'),
            tableData: [],
        customerId:'',
        current:1,
            selectWord: '',
            selectWordByDailog:'',
            editVisible: false,
            delVisible: false,
            OrderTableVisible:false,
            goodsId: "",
            comeAndOut:"",//出入库判断
            goodsNameList: [],
            aboutCustmerList:[],
            form: {
                   updater: localStorage.getItem('relationUserInfoName'),         //默认该字段为创建人姓名
                creator: localStorage.getItem('relationUserInfoId'),//默认该字段为创建人Id
                wholesalerName: '',
                linkMan: '',
                phone: '',
                address: '',
                businessScope:"" ,
                memo: "",
                wholesalerId: "",
                userId: "",
                status:'customer'
            },
            idx: -1,
            currentPage:1,
            pagesize: 5,
            total: 0,
            dialogCurrentPage: 1,
            dialogPagesize: 10,
            dialogTotal:0,
            rules: {
                linkMan: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
                 phone: [
            { required: true, trigger: 'blur', validator: validPhone }//这里需要用到全局变量
          ]     ,
                address: [{ required: true, message: '请填写批发商地址', trigger: 'blur' }],
           
            }
        }
    },

    methods: {

        /*获取商品信息*/
        getWholesaler() {
            this
                .$axios
                .post('/wholesaler/getWholesaler', {
                    userId: this.userId,
                    selectWord: this.selectWord,
                    status:'customer'
                })
                .then((response) => {
                    this.total = response.data.total
                    this.currentPage = response.data.current
                    this.tableData = response.data.records
                })
                .catch(function(error) {}.bind(this));
        },
        /*保存商品*/
        saveWholesaler(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this
                        .$axios
                        .post('/wholesaler/saveWholesaler', {
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
         /*分页处理Dialog*/
        handleSizeChangeDialog(val) {
            this.pagesize = val;
            console.log(`每页 ${val} 条`);

        },
        /*分页处理*/
        handleCurrentChange(val) {
            this.currentPage = val;

            console.log(`当前页: ${val}`);
        },
          /*分页处理Dialog*/
        handleCurrentChangeDialog(val) {
            this.current = val;
            console.log(`当前页: ${val}`);
            this.getAboutCustomerList();
        },
           //查看订单处理
        handleSelect(customerId) {
            this.customerId = customerId;
            this.OrderTableVisible = true;
            console.log(this.customerId);
            this.getAboutCustomerList();
        },
        /*编辑商品处理*/
        handleEdit(index, row) {
            this.idx = index;
            const item = this.tableData[index];
            this.form = {
                wholesalerName: item.wholesalerName,
                linkMan: item.linkMan,
                phone: item.phone,
                address: item.address,
                businessScope: item.businessScope,
                memo: item.memo,
                wholesalerId: item.wholesalerId,
                userId: item.userId,
                status: item.status
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
         getAboutCustomerList() {      //获取相关订单弹出层信息弹
            this
                .$axios
                .post('/wholesaler/getAboutWholesalerList', {
                    userId: this.userId,
                    customerId: this.customerId,
                    status: 'out',
                    current:this.current,
                    selectWordByDailog: this.selectWordByDailog
                })
                .then((response) => {
                    console.log(response.data)
                    this.aboutCustmerList = response.data.records
                    this.dialogTotal = response.data.total
                    this.dialogCurrentPage = response.data.current
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
