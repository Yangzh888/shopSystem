<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 待办信息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-button type="primary">新建待办信息</el-button>
            <el-tabs v-model="message">
                <el-tab-pane :label="`未读消息(${unReadList.length})`" name="first">
                    <div class="handle-box">
                        <el-input v-model="selectWord" placeholder="通过标题进行搜索" @keyup.enter.native="getUnReadInfo" class="handle-input mr10"></el-input>
                    </div>
                    <el-table :data="unReadList"  :show-header="false" style="width: 100%">
                        <!--  <el-table-column label="标题">
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.title}}</span>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="标题">
                            <template slot-scope="scope">
                                <div class="message-title">{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                         <el-table-column label="标题">
                            <template slot-scope="scope">
                                <div class="message-title">{{scope.row.memo}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column  width="180">
                            <template slot-scope="scope">
                                <div class="todo-item">{{scope.row.createTime|moment}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.row.othersId)">标为已完成</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click="handleReadAll()">全部标为已完成</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="`已读消息(${readList.length})`" name="second">
                    <template v-if="message === 'second'">
                        <div class="handle-box">
                            <el-input v-model="selectWord" placeholder="通过标题进行搜索"  @keyup.enter.native="getReadInfo" class="handle-input mr10"></el-input>
                        </div>
                        <el-table :data="readList" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                              <el-table-column  width="180">
                            <template slot-scope="scope">
                                <div class="todo-item">{{scope.row.createTime|moment}}</div>
                            </template>
                        </el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.row.othersId)" >删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger" @click="handleDelAll()">删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`回收站(${recycleList.length})`" name="third">
                    <template v-if="message === 'third'">
                        <div class="handle-box">
                            <el-input v-model="selectWord" placeholder="通过标题进行搜索" @keyup.enter.native="getRecycleInfo"  class="handle-input mr10"></el-input>
                        </div>
                        <el-table :data="recycleList" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                             <el-table-column  width="180">
                            <template slot-scope="scope">
                                <div class="todo-item">{{scope.row.createTime|moment}}</div>
                            </template>
                        </el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleRestore(scope.row.othersId)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger" @click="handleRestoreAll()">清空回收站</el-button>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
export default {
    inject: ['reload'],
    mounted: function() {
        this.getUnReadInfo();
        this.getRecycleInfo();
        this.getReadInfo();
    },
    data() {
        return {
            othersIdList:[],
            userId: localStorage.getItem('userId'),
            selectWord: '',
            unReadList: [],
            readList:[],
            recycleList:[],
            othersId:'',
            message: 'first',
            showHeader: false,
          
        }
    },
    methods: {
        /*获取代办信息*/
        getUnReadInfo() {
            this 
                .$axios
                .post('/others/selectPage', {
                    userId: this.userId,
                    selectWord: this.selectWord,
                    status:'unRead'
                })
                .then((response) => {
                    this.total = response.data.total
                    this.currentPage = response.data.current
                    this.unReadList = response.data.records

                })
                .catch(function(error) {}.bind(this));

        },
         getReadInfo() {               //获取已读数据
            this
                .$axios
                .post('/others/selectPage', {
                    userId: this.userId,
                    selectWord: this.selectWord,
                    status:'read'
                })
                .then((response) => {
                    this.total = response.data.total
                    this.currentPage = response.data.current
                    this.readList = response.data.records

                })
                .catch(function(error) {}.bind(this));

        }, 
         getRecycleInfo() {            //获取回收站数据
            this
                .$axios
                .post('/others/selectPage', {
                    userId: this.userId,
                    selectWord: this.selectWord,
                    status:'recycle'
                })
                .then((response) => {
                    this.total = response.data.total
                    this.currentPage = response.data.current
                    this.recycleList = response.data.records

                })
                .catch(function(error) {}.bind(this));

        },
        handleRead(othersId) {               //将状态修改为已读
       
             this.othersId=othersId;
                this
                .$axios
                .post('/others/changeStatus', {
                    othersId: this.othersId,
                    status:'read'
                })
                .then((response) => {
                
                    if(response.data.code=='200'){
                        this.$message.success(response.data.data);
                    }else{
                         this.$message.success(response.data.data);
                    }
                    this.reload();
                    
                })
                .catch(function(error) {}.bind(this));
        },
        handleReadAll(){
                this
                .$axios
                .post('/others/changeBatchStatus', {
                    othersFromList:this.unReadList,
                    status:'read'
                })
                .then((response) => {
                if(response.data.code=='200'){
                        this.$message.success(response.data.data);
                    }else{
                         this.$message.error(response.data.data);
                    }
                    this.reload();
                })
                .catch(function(error) {}.bind(this));

        },
        handleDel(othersId) {
          
             this.othersId=othersId;
                this
                .$axios
                .post('/others/changeStatus', {
                    othersId: this.othersId,
                    status:'recycle'
                })
                .then((response) => {
                    if(response.data.code=='200'){
                        this.$message.success(response.data.data);
                    }else{
                         this.$message.success(response.data.data);
                    }
                    this.reload();
                    
                })
                .catch(function(error) {}.bind(this));
        },
         handleDelAll(){
                this
                .$axios
                .post('/others/changeBatchStatus', {
                    othersFromList:this.readList,
                    status:'recycle'
                })
                .then((response) => {
                if(response.data.code=='200'){
                        this.$message.success(response.data.data);
                    }else{
                         this.$message.error(response.data.data);
                    }
                    this.reload();
                })
                .catch(function(error) {}.bind(this));

        },
        handleRestore(othersId) {
           this.othersId=othersId;
                this
                .$axios
                .post('/others/changeStatus', {
                    othersId: this.othersId,
                    status:'unRead'
                })
                .then((response) => {
                  
                    if(response.data.code=='200'){
                        this.$message.success(response.data.data);
                    }else{
                         this.$message.success(response.data.data);
                    }
                    this.reload();
                    
                })
                .catch(function(error) {}.bind(this));
        },
         handleRestoreAll(){
                this
                .$axios
                .post('/others/changeBatchStatus', {
                    othersFromList:this.recycleList,
                    status:'delete'
                })
                .then((response) => {
                if(response.data.code=='200'){
                        this.$message.success(response.data.data);
                    }else{
                         this.$message.error(response.data.data);
                    }
                    this.reload();
                })
                .catch(function(error) {}.bind(this));

        },
    }
  
}

</script>
<style>
.message-title {
    cursor: pointer;
}

.handle-row {
    margin-top: 30px;
}

</style>
