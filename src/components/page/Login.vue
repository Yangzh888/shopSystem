<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">商铺管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
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
            <el-button type="text" @click="dialogFormVisible = true">去注册</el-button>

                    <el-dialog title="注册店铺账号" :visible.sync="dialogFormVisible" center>
                     <el-form ref="form" :model="form" label-width="110px">
                      <el-form-item label="商铺名称：">
                        <el-input v-model="form.shopName"  maxlength='50px'></el-input>
                      </el-form-item>
                       <el-form-item label="昵称：">
                        <el-input v-model="form.username" ></el-input>
                      </el-form-item>
                        <el-form-item label="登录账号：">
                        <el-input v-model="form.userId" ></el-input>
                      </el-form-item>
                     <el-form-item label="密码：">
                        <el-input v-model="form.password"></el-input>
                      </el-form-item>
                     
                      <el-form-item label="商铺性质：">
                        <el-checkbox-group v-model="form.type">
                          <el-checkbox label="食品/厨房用品" name="type"></el-checkbox>
                          <el-checkbox label="生活用品" name="type"></el-checkbox>
                          <el-checkbox label="穿着用品" name="type"></el-checkbox>
                          <el-checkbox label="家具类" name="type"></el-checkbox>
                          <el-checkbox label="其他性质" name="type"></el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                      <el-form-item label="联系电话：">
                        <el-input v-model="form.userPhone"></el-input>
                      </el-form-item>
                      <el-form-item label="忘记密码提示">
                            <el-select v-model="form.forgetQue" placeholder="请选择问题">
                              <el-option label="你的生日" value="birthday"></el-option>
                              <el-option label="你父亲的名字" value="fatherName"></el-option>
                              <el-option label="你母亲的名字" value="motherName"></el-option>
                              <el-option label="你小学学校的名字" value="schoolName"></el-option>
                            </el-select>
                          </el-form-item>
                       <el-form-item label="答案：">
                        <el-input v-model="form.forgetAns"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary"  @click="register()">立即创建</el-button>                    
                      </el-form-item>
                    </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                      </div>
                    </el-dialog>
                    <el-dialog
  title="提示"
  :visible.sync="centerDialogVisible"
  width="30%"
  center>
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
        data: function(){
            return {
                dialogFormVisible: false,
                messageTip:'',
                centerDialogVisible:false,
                ruleForm: {
                    username: '',
                    password: ''
                },
                form: {
                      shopName:'',
                      username: '',
                      userId: '',
                      password: '',
                      type: [],
                      forgetQue:'',
                      forgetAns:'',
                      userPhone:''
                     
                     
        },
                formLabelWidth: '120px',
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm() {
               /* this.$refs[formName].validate((valid) => {
                    if (valid) {
                        localStorage.setItem('ms_username',this.ruleForm.username);
                        this.$router.push('/');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                }*/
                    this.$axios
                            .post('/userInfo/login', {
                              userId: this.ruleForm.username,
                              password: this.ruleForm.password
                            })
                            /*.then(successResponse => {
                              this.responseResult = JSON.stringify(successResponse.data);
                              alert(responseResult);
                              if (successResponse.data.code === 200) {
                                this.$router.replace({path: '/dashboard'})
                                /* this.$router.push('/');
                              }
                            })


                            .catch(failResponse => {}*/
                            .then(function (response) {
                                    console.log(response);
                                    if (response.data.code===200) {
                                        localStorage.setItem('ms_username',response.data.data.username);
                                        localStorage.setItem('shopName',response.data.data.shopName);
                                        localStorage.setItem('userId',response.data.data.userId);

                                        this.$router.push('/');
                                    }
                                    else if(response.data.code===400){
                                        this.messageTip='账号或密码错误，请重新登录！';
                                        console.log("登陆错误")
                                        this.centerDialogVisible=true;
                                    }
                                  }.bind(this))
                            .catch(function (error) {
                                 this.messageTip='账号或密码错误，请重新登录！';
                                        console.log("登陆错误")
                                        this.centerDialogVisible=true;
                              }.bind(this)
                              );
          },
            register() {
                            this
                            .$axios
                            .post('/userInfo/register', {
                                shopName:this.form .shopName,
                                username:this.form .username,
                                userId:this.form .userId,
                                password:this.form .password,
                                forgetQue:this.form .forgetQue,
                                forgetAns:this.form .forgetAns,
                                userPhone:this.form .userPhone,

                            })
                            .then(function (response) {
                                    console.log(response);
                                    if (response.data.code===200) {
                                        console.log("Oj")
                                        this.messageTip=response.data.message;
                                        this.$router.push('login');
                                        this.centerDialogVisible=true;
                                        this.dialogFormVisible=false;
                                    }
                                    else if(response.data.code===400){
                                        console.log("登陆错误")
                                        this.messageTip=response.data.message;
                                        this.centerDialogVisible=true;
                                    }
                                  }.bind(this))
                            .catch(function (error) {
                                
                              }.bind(this)
                              );
          }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #155;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.5);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#305;
    }
    .resiget{
        position: absolute;
        left: 70%;
        color: yellow;
    }
</style>