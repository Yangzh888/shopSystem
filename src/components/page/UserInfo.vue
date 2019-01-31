<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 个人信息</el-breadcrumb-item>
                <el-breadcrumb-item>编辑个人信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="40%">
                    <el-form-item label="商铺名称">
                        <el-input v-model="form.shopName"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="form.userPhone"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">更新信息</el-button>
                        <el-button type="danger" @click="changePassWordVisible = true">修改密码</el-button>
                        
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <el-dialog title="修改密码" :visible.sync="changePassWordVisible" center width="30%">
            <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="问题" prop="forgetQue">
                    <el-input v-model.number="changeForm.forgetQue" :disabled="true"    ></el-input>
                </el-form-item>
                <el-form-item label="答案" prop="forgetAnsCheck">
                    <el-input v-model.number="changeForm.forgetAnsCheck"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassWord">
                    <el-input v-model.number="changeForm.newPassWord"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="changePassWord('changeForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


    </div>
</template>
<script>
export default {

    mounted: function() {
        this.getUserInfo();
    },
    data: function() {
        return {
            userId: localStorage.getItem('userId'),
            form: {
                shopName: "",
                username: "",
                userPhone: "",
                userId: "",
                forgetQue: "",
                forgetAns: "",
                rank: "",
                createTime: "",
                creator: "",
                password: ""
            },
            changePassWordVisible: false,
            changeForm: {
                forgetQue: "",
                forgetAnsCheck: "",
                newPassWord:""
            },
            rules: {
               
                forgetAnsCheck: [{ required: true, message: '请填写答案', trigger: 'blur' }],
                newPassWord: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
            }
        }
    },
    methods: {
        onSubmit() {
            this.$message.success('提交成功！');
        },
        getUserInfo() {
            this
                .$axios
                .post('/userInfo/getUserInfo', {
                    userId: this.userId
                })
                .then((response) => {

                    this.form = response.data.data
                    this.changeForm = response.data.data

                })
                .catch(function(error) {}.bind(this));
        },
        updateUserInfo() {

            this
                .$axios
                .post('/userInfo/updateUserInfo', {
                    form: this.form
                })
                .then((response) => {
                   
                })
                .catch(function(error) {}.bind(this));
        },


        changePassWord(changeForm) {
            this.$refs[changeForm].validate((valid) => {
                if (valid) {
                    this
                        .$axios
                        .post('/userInfo/checkAnsToChangePassWord', {
                            userId: this.userId,
                            changeForm: this.changeForm
                        })
                        .then((response) => {
                            if(response.data.code===200){
                                   this.$message.success(`修改密码成功！！`);
                            }else{
                                 this.$message.error(`执行失败，答案错误请重试`);
                            }
                        })
                        .catch(function(error) {
                            this.$message.error(`执行失败，答案错误请重试`);
                        }.bind(this)
                            );
                } else {
                   
                    return false;
                }
            });
        }

    }
}

</script>
