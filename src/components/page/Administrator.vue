<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-warn"></i> 权限管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="selectWord" placeholder="通过子用户名称或者登陆账号搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search">搜索</el-button>
                <el-button type="primary" icon="insert" class="handle-del mr10" @click="editVisible = true" v-if="level<2">新增子用户</el-button>
            </div>
            <el-table :data="tableData" border class="table" style="width: 100%" height="570" size=mini>
                <el-table-column prop="createTime" label="创建日期">
                </el-table-column>
                <el-table-column prop="relationUserInfoId" label="子用户账号">
                </el-table-column>
                  <el-table-column  label="子用户姓名">
                           <template slot-scope="scope">
                        <div>{{scope.row.relationUserInfoName}}<span v-if="scope.row.level>0" style="color: red">（普通管理员）</span></div>
                    </template>
                </el-table-column>

                  <el-table-column label="商品管理功能">
                    <template slot-scope="scope">
                  <i class="el-icon-success" v-if="scope.row.goodslevel==='true'"></i>                     
                  <i class="el-icon-error" v-if="scope.row.goodslevel==='false'"></i>
                    </template>
                </el-table-column>
                <el-table-column label="待办管理功能">
                    <template slot-scope="scope">
                  <i class="el-icon-success" v-if="scope.row.readyDolevel==='true'"></i>                     
                  <i class="el-icon-error" v-if="scope.row.readyDolevel==='false'"></i>
                    </template>
                </el-table-column>
                <el-table-column  label="客户功能">
                        <template slot-scope="scope">
                  <i class="el-icon-success" v-if="scope.row.customerlevel==='true'"></i>                     
                  <i class="el-icon-error" v-if="scope.row.customerlevel==='false'"></i>
                    </template>
                </el-table-column>
                <el-table-column  label="收支管理功能">
                      <template slot-scope="scope">
                  <i class="el-icon-success" v-if="scope.row.comeAndOutlevel==='true'"></i>                     
                  <i class="el-icon-error" v-if="scope.row.comeAndOutlevel==='false'"></i>
                    </template>
                </el-table-column>
                <el-table-column label="数据分析功能">
                      <template slot-scope="scope">
                  <i class="el-icon-success" v-if="scope.row.anaylyslevel==='true'"></i>                     
                  <i class="el-icon-error" v-if="scope.row.anaylyslevel==='false'"></i>
                    </template>
                </el-table-column>
                </el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEditPassword(scope.row.relationUserInfoId)"  v-if="userId!==scope.row.relationUserInfoId">修改密码</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.relationUserInfoId)"  v-if="userId!==scope.row.relationUserInfoId">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
           
                <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer" >
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteUserSonId()">确 定</el-button>
            </span>
        </el-dialog>
         <el-dialog title="修改密码" :visible.sync="editPasswordVisible" width="30%" center>
            <el-form ref="form1" :model="form1" :rules="rules1" label-width="150px" status-icon>
                <el-row>
                    <el-col :span="16   ">
                        <el-form-item label="新密码" prop="password">
                            <el-input size="mini" v-model="form1.password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                </el-form> <span slot="footer" class="dialog-footer" >
                <el-button type="primary" @click="updateUserSonPassword('form1')">确 定</el-button>
                <el-button @click="editPasswordVisible = false">取 消</el-button></span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import md5 from 'js-md5';
export default {
    inject: ['reload'],
    mounted: function() {
      
        this.getAllUserInfo();

    },
    data() {
        return {
            password:'',//用于直接修改密码
            editPasswordVisible:false,
            delVisible:false,
            editVisible: false,
            selectWord: '',
            tableData: [],
            relationUserInfoId:'',
            idx:0,
            userId: localStorage.getItem('userId'),
            level: localStorage.getItem('level'),
            relationUserInfoId: localStorage.getItem('relationUserInfoId'),
            form: {
                relationUserInfoId:'',
                createTime:'',
                relationUserInfoId:'',
                password:'',
                relationUserInfoName:'',
                goodslevel: false,
                readyDolevel: false,
                customerlevel: false,
                comeAndOutlevel: false,
                anaylyslevel: false,
                level: 0,
                permissionlevel:'',
            },
            form1:{
                password:''
            },
            rules: {
                createTime: [{ required: true, message: '请选择日期', trigger: 'blur' }],
                relationUserInfoId: [{ required: true, message: '请配置子用户的登录账户', trigger: 'blur' }],
                password: [{ required: true, message: '请配置子用户的登录密码', trigger: 'blur' }],
                relationUserInfoName: [{ required: true, message: '请配置子用户姓名', trigger: 'blur' }],
            },
               rules1: {
               
                password: [{ required: true, message: '请配置子用户的登录密码', trigger: 'blur' }],
                
            }

        }
    },
    methods: {
        getAllUserInfo(){
        //超级管理员专用
         //超级管理员获取所有账户信息
         if(this.level==2){
            this
                .$axios
                .post('/relationuserinfo/getAllUserInfo', {
                    userId: this.userId,
                    selectWord: this.selectWord,

                })
                .then((response) => {
                  this.tableData=response.data

                })
                .catch(function(error) {}.bind(this));
         }
        },
       
            
        //修改密码用
        handleEditPassword(relationUserInfoId) {
          
            this.relationUserInfoId = relationUserInfoId;
            this.editPasswordVisible = true;
        },
          /*删除处理*/
        handleDelete(relationUserInfoId) {
            console.log(relationUserInfoId)
            this.relationUserInfoId = relationUserInfoId;
            this.delVisible = true;
        },
        deleteUserSonId(){
   this
                .$axios
                .post('/relationuserinfo/deleteUserSonInfo', {
                    relationUserInfoId: this.relationUserInfoId,
                    userId:this.userId
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
           
        updateUserSonPassword(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this
                        .$axios
                        .post('/relationuserinfo/updatePasswordByAdministrator', {
                            relationUserInfoId: this.relationUserInfoId,
                            password:md5(this.form1.password)
            
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
    }
}

</script>
<style scoped>
h1 {
    text-align: center;
    margin: 30px 0;
}

p {
    line-height: 30px;
    margin-bottom: 10px;
    text-indent: 2em;
}

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

.logout {
    color: #409EFF;
}

</style>
