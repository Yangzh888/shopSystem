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
                <el-input  placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" s>搜索</el-button>
            </div>
             <el-table :data="tableData" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                        <el-table-column width="40" >
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope" >
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.createTime}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.inSum}}</div>
                            </template>
                        </el-table-column> 
                        <el-table-column width="60">
                            <template slot-scope="scope">
                              <a href="#">  <i class="el-icon-edit"></i></a>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增" :visible.sync="saveBudgetDailog" width="30%">
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

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="saveBudgetDailog = false">取 消</el-button>
                <el-button type="primary" @click="saveBudget">确 定</el-button>
            </span>
        </el-dialog>

 
        
        <el-dialog
                          title="提示"
                          :visible.sync="responseTips"
                          width="30%"
                          center>
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
        },
        data() {
            return {

            responseTips:false,
            messageTip:'',      
            userId:localStorage.getItem('userId'),       
            tableData: [],
            saveBudgetDailog: false,
            form:{
                    inSum: '',
                    outSum: '',
                    createTime: ''
                },
            
            }
        },
     
    
        methods: {
            // 保存新增收支支出数据
            saveBudget() {
               this
                            .$axios
                            .post('/budget/saveBudget', {
                                userId:this.userId,
                                form:this.form                             
                            })
                            .then((response)=> {  
                            this.messageTip=response.data.data;
                            this.responseTips=true;                                                        
                                    this.saveBudgetDailog=false;                       
                                  })
                            .catch(function (error) {
                              }.bind(this)
                              );
            }, 
            getBubgetData(){
              
                 this
                            .$axios
                            .post('/budget/getBubgetData', {
                                userId:this.userId               
                            })
                            .then((response)=> {  
                            console.log(response.data) 
                           this.tableData=response.data;
                           console.log(this.tableData);
                            })
                            .catch(function (error) {
                                console.log(error.data)
                              }.bind(this)
                              );
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
