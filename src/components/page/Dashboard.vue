<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="static/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">商铺:    <span>{{    shopName}}</span></div>
                   
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>热销物品存货情况</span>
                    </div>
                    江苏大米
                    <el-progress :percentage="71.3" color="#42b983"></el-progress>
                    金龙鱼5l花生油
                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>
                    黄豆100KG
                    <el-progress :percentage="3.7"></el-progress>
                    海天生抽1.8L
                    <el-progress :percentage="0.9" color="#f56c6c"></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234</div>
                                    <div>用户访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321</div>
                                    <div>系统消息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="showAddReadyDo = true">添加</el-button>
                    </div>
                    <el-table :data="todoList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                        <el-table-column width="40" >
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope" >
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.createTime|moment}}</div>
                            </template>
                        </el-table-column> 
                        <el-table-column width="60">
                            <template slot-scope="scope">
                              <a href="#">  <i class="el-icon-edit"></i></a>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :data="data" type="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :data="data" type="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog
				  title="提示"
				  :visible.sync="showAddReadyDo"
				  width="30%"
				  center>
						 <el-form :label-position="left" label-width="80px" :model="formLabelAlign">
						  <el-form-item label="标题">
						    <el-input v-model="formLabelAlign.title"></el-input>
						  </el-form-item>
						     <el-form-item label="创建时间">
						    <span class="demonstration"></span>
							    <el-date-picker
							      v-model="formLabelAlign.date"
							      type="datetime"
							      placeholder="选择日期时间">
							    </el-date-picker>
						  </el-form-item>
						</el-form>
				  <span slot="footer" class="dialog-footer">
				    <el-button @click="showAddReadyDo = false">取 消</el-button>
				    <el-button type="primary"  @click="saveReadyDo()" >确 定</el-button>
				  </span>
		</el-dialog>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    export default {
        inject:['reload'],
        name: 'dashboard',
        shopName:'dashboard',
        userId:'',
        mounted: function() {
        this.getOthersDate();
        },
        data() {
            return {
            	left:'left',  //代办弹出层的对齐方式
                name: localStorage.getItem('ms_username'),       //获取存在localStorage的值
                shopName:localStorage.getItem('shopName'),
                userId:localStorage.getItem('userId'),
                showAddReadyDo:false,            //设置代办弹框为false，点击为true显示
                todoList: [            
                ],
                formLabelAlign: {
						          title: '',
						          date:''
						        },
                data: [{
                        name: '2018/09/04',
                        value: 1083
                    },{
                        name: '2018/09/05',
                        value: 1888
                    }
                ],
      

                options: {
                    title: '最近七天每天入账金额（元）',
                    showValue: false,
                    fillColor: 'rgb(45, 140, 240)',
                    bottomPadding: 30,
                    topPadding: 30
                },
                options2: {
                    title: '最近七天每天出账金额（元）',
                    showValue: false,
                    fillColor: '#FC6FA1',
                    axisColor: '#008ACD',
                    contentColor: '#EEEEEE',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    topPadding: 30
                }
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        created(){
            this.handleListener();
            this.changeDate();
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {
            changeDate(){
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
                })
            },
            handleListener(){
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
            },
            getOthersDate(){
            	
               				this
                            .$axios
                            .post('/others/getOthersDate', {
                            	userId:this.userId                          	
                            })
                            .then((response)=> {                                                          
                                 console.log(response.data)
                                this.todoList=response.data

                                  })
                            .catch(function (error) {
                              }.bind(this)
                              );
                            
            },
            saveReadyDo(){
            	this
                            .$axios
                            .post('/others/saveReadyDo', {
                            	userId:this.userId ,
                            	formLabelAlign:this.formLabelAlign                       	
                            })
                            .then((response)=> {                                                          
                                 console.log(response.data)
                                this.reload()

                                  })
                            .catch(function (error) {
                              }.bind(this)
                              );
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 22px;
        color: #222;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
