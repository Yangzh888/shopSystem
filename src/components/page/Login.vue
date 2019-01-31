<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">商铺管理系统</div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码不能为空。</p>
            </el-form>
             <el-button type="primary" @click="dialogFormVisible = true" plain>去注册</el-button>
           
            <el-dialog title="注册店铺账号" :visible.sync="dialogFormVisible" center>
              
                    <el-form ref="form" :model="form" :rules="rulesRegister" label-width="120px" status-icon>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="商铺名称：" prop="shopName" >
                                <el-input v-model="form.shopName" maxlength='50px' size="medium"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="你的姓名：" prop="username">
                                <el-input v-model="form.username" size="medium"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="登录账号：" prop="userId">
                                <el-input v-model="form.userId" size="medium"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密码：" prop="password">
                                <el-input v-model="form.password" size="medium"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="联系电话：" prop="userPhone">
                                <el-input v-model="form.userPhone" size="medium"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="忘记密码提示：" size="medium" prop="forgetQue">
                                <el-select v-model="form.forgetQue" placeholder="请选择问题">
                                    <el-option label="你的生日" value="你的生日"></el-option>
                                    <el-option label="你父亲的名字" value="你父亲的名字"></el-option>
                                    <el-option label="你母亲的名字" value="你母亲的名字"></el-option>
                                    <el-option label="你小学学校的名字" value="你小学学校的名字"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="答案：" prop="forgetAns">
                                <el-input v-model="form.forgetAns" size="medium"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="danger" @click="register('form')">注册</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
                <span style="font-weight:center">{{messageTip}}</span>
                <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
                          </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            dialogFormVisible: false,
            messageTip: '',
            centerDialogVisible: false,
            ruleForm: {
                username: '',
                password: ''
            },
            form: {
                shopName: '',
                username: '',
                userId: '',
                password: '',
                type: [],
                forgetQue: '',
                forgetAns: '',
                userPhone: ''

            },
            formLabelWidth: '120px',
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            rulesRegister:{
               shopName: [
                    { required: true, message: '请输入商铺名', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入你的名字', trigger: 'blur' }
                ],
                 userId: [
                    { required: true, message: '请输入登录账户', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                 forgetQue: [
                    { required: true, message: '设置你的忘记密码提示', trigger: 'blur' }
                ],
                forgetAns: [
                    { required: true, message: '请输入答案', trigger: 'blur' }
                ],
                 userPhone: [
                    { required: true, message: '请输入你的电话', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post('/userInfo/login', {
                            userId: this.ruleForm.username,
                            password: this.ruleForm.password
                        })
                        .then(function(response) {
                            console.log(response);
                            if (response.data.code === 200) {
                                localStorage.setItem('ms_username', response.data.data.username);
                                localStorage.setItem('shopName', response.data.data.shopName);
                                localStorage.setItem('userId', response.data.data.userId);

                                this.$router.push('/');
                            } else if (response.data.code === 400) {
                                this.messageTip = '账号或密码错误，请重新登录！';
                                console.log("登陆错误")
                                this.centerDialogVisible = true;
                            } else {
                                this.messageTip = '账号异常';
                                console.log("登陆错误")
                                this.centerDialogVisible = true;
                            }
                        }.bind(this))
                        .catch(function(error) {
                            this.messageTip = '账号或密码错误，请重新登录！';
                            console.log("登陆错误")
                            this.centerDialogVisible = true;
                        }.bind(this));
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })




        },
        register(form) {
  this.$refs[form].validate((valid) => {
           if (valid) {
            this
                .$axios
                .post('/userInfo/register', {
                    shopName: this.form.shopName,
                    username: this.form.username,
                    userId: this.form.userId,
                    password: this.form.password,
                    forgetQue: this.form.forgetQue,
                    forgetAns: this.form.forgetAns,
                    userPhone: this.form.userPhone,

                })
                .then(function(response) {
                    console.log(response);
                    if (response.data.code === 200) {
                        this.messageTip = response.data.message;
                        this.$router.push('login');
                        this.centerDialogVisible = true;
                        this.dialogFormVisible = false;
                    } else if (response.data.code === 400) {

                        this.messageTip = response.data.message;
                        this.centerDialogVisible = true;
                    }
                }.bind(this))
                .catch(function(error) {

                }.bind(this));
        }})}
    }
}

</script>
<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/login-bg.jpg);
    background-size: 100%;
}

.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #155;
    border-bottom: 1px solid #ddd;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.5);
    overflow: hidden;
}

.ms-content {
    padding: 30px 30px;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #305;
}

.resiget {
    position: absolute;
    left: 70%;
    color: yellow;
}

</style>
