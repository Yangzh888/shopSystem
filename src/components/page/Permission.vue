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
                <el-button type="primary" icon="insert" class="handle-del mr10" @click="editVisible = true">新增子用户</el-button>
            </div>
            <el-table :data="tableData" border class="table" style="width: 100%" height="570" size=mini>
                <el-table-column prop="createTime" label="创建日期">
                </el-table-column>
                <el-table-column prop="relationUserInfoId" label="子用户账号">
                </el-table-column>
                  <el-table-column prop="relationUserInfoName" label="子用户姓名">
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
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"  v-if="userId!==scope.row.relationUserInfoId">编辑</el-button>

                            <el-button type="text" icon="el-icon-edit" @click="handleEditPassword(scope.row.relationUserInfoId)"  v-if="userId!==scope.row.relationUserInfoId">修改密码</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.relationUserInfoId)"  v-if="userId!==scope.row.relationUserInfoId">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="编辑/新增子用户信息" :visible.sync="editVisible" width="30%" center>
                <el-form ref="form" :model="form" :rules="rules" label-width="110px" status-icon>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="创建日期" prop="createTime">
                                <el-date-picker size=mini type="date" placeholder="选择日期" v-model="form.createTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="子用户账号" prop="relationUserInfoId">
                                <el-input size="mini" v-model="form.relationUserInfoId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="子用户密码" prop="password">
                                <el-input size="mini" v-model="form.password"></el-input>
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="子用户名称" prop="relationUserInfoName">
                                <el-input size="mini" v-model="form.relationUserInfoName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="商品管理功能" prop="goodslevel">
                                <el-switch v-model="form.goodslevel">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="待办管理功能" prop="readyDolevel">
                                <el-switch v-model="form.readyDolevel">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户功能" prop="customerlevel">
                                <el-switch v-model="form.customerlevel">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="收支管理功能" prop="comeAndOutlevel">
                                <el-switch v-model="form.comeAndOutlevel">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="数据分析功能" prop="anaylyslevel">
                                <el-switch v-model="form.anaylyslevel">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer" >
                <el-button type="primary" @click="saveUserSonInfo('form')">确 定</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
                
            </span>
            </el-dialog>
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
        this.getPermissionInfo();

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

        /*获取子用户信息*/
        getPermissionInfo() {
            this
                .$axios
                .post('/relationuserinfo/getUserSonInfo', {
                    userId: this.userId,
                    selectWord: this.selectWord,

                })
                .then((response) => {
                    console.log(response.data)
                    this.total = response.data.length
                    this.tableData = response.data

                })
                .catch(function(error) {}.bind(this));

        },
        /*保存子用户信息*/
        saveUserSonInfo(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this
                        .$axios
                        .post('/relationuserinfo/saveUserSonInfo', {
                            userId: this.userId,
                            createTime: this.form.createTime,
                            relationUserInfoId: this.form.relationUserInfoId,
                            password: md5(this.form.password),
                            relationUserInfoName: this.form.relationUserInfoName,
                            goodslevel: this.form.goodslevel,
                            comeAndOutlevel: this.form.comeAndOutlevel,
                            anaylyslevel: this.form.anaylyslevel,
                            readyDolevel: this.form.readyDolevel,
                            customerlevel: this.form.customerlevel,
                            permissionlevel:this.form.permissionlevel,
                            level: this.form.level,
                        })
                        .then((response) => {
                            console.log(response.data);
                            if (response.data.code === 200) {
                                this.$message.success(response.data.message);
                                this.editVisible = false;
                                this.reload();
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
            handleEdit(index, row) {
            this.idx = index;
            const item = this.tableData[index];
            this.form = {
                userId: item.userId,
                userSonId: item.userSonId,
                createTime: item.createTime,
                password:'******',
                relationUserInfoId: item.relationUserInfoId,
                relationUserInfoName: item.relationUserInfoName,
                goodslevel: item.goodslevel,
                readyDolevel: item.readyDolevel,
                customerlevel: item.customerlevel,
                comeAndOutlevel: item.comeAndOutlevel,
                anaylyslevel: item.anaylyslevel,
                permissionlevel:item.permissionlevel, 
            }
            this.editVisible = true;
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
                        .post('/relationuserinfo/updateUserSonPassword', {
                            userId: this.userId,
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
