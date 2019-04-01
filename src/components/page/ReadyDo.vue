<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 待办信息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-button type="primary" @click='showAddReadyDo=true'>新建待办信息</el-button>
            <el-tabs v-model="message">
                <el-tab-pane :label="`未读消息(${unReadList.length})`" name="first">
                    <div class="handle-box">
                        <el-input v-model="selectWord" placeholder="通过标题进行搜索" @keyup.enter.native="getUnReadInfo" class="handle-input mr10"></el-input>
                    </div>
                    <el-table :data="unReadList" :show-header="true" style="width: 100%">
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
                        <el-table-column label="内容">
                            <template slot-scope="scope">
                                <div class="message-title">{{scope.row.memo}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建人">
                            <template slot-scope="scope">
                                <div style="color: red;font-weight: bold;">{{scope.row.updater}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" width="180">
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
                            <el-input v-model="selectWord" placeholder="通过标题进行搜索" @keyup.enter.native="getReadInfo" class="handle-input mr10"></el-input>
                        </div>
                        <el-table :data="readList" style="width: 100%">
                            <el-table-column label="标题">
                                <template slot-scope="scope">
                                    <div class="message-title">{{scope.row.title}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="内容">
                                <template slot-scope="scope">
                                    <div class="message-title">{{scope.row.memo}}</div>
                                </template>
                            </el-table-column>
                             <el-table-column label="更新人">
                            <template slot-scope="scope">
                                <div style="color: red;font-weight: bold;">{{scope.row.updater}}</div>
                            </template>
                        </el-table-column>
                            <el-table-column label="创建时间" width="180">
                                <template slot-scope="scope">
                                    <div class="todo-item">{{scope.row.createTime|moment}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.row.othersId)">删除</el-button>
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
                            <el-input v-model="selectWord" placeholder="通过标题进行搜索" @keyup.enter.native="getRecycleInfo" class="handle-input mr10"></el-input>
                        </div>
                        <el-table :data="recycleList"  style="width: 100%">
                            <el-table-column label="标题">
                                <template slot-scope="scope">
                                    <div class="message-title">{{scope.row.title}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="内容">
                                <template slot-scope="scope">
                                    <div class="message-title">{{scope.row.memo}}</div>
                                </template>
                            </el-table-column>
                             <el-table-column label="更新人">
                            <template slot-scope="scope">
                                <div style="color: red;font-weight: bold;">{{scope.row.updater}}</div>
                            </template>
                        </el-table-column>
                            <el-table-column label="创建时间" width="180">
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
            <el-dialog title="新建待办" :visible.sync="showAddReadyDo" width="30%" center>
                <el-form label-width="80px" :model="readyDoform" ref="readyDoform" :rules="rules">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="readyDoform.title"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="memo">
                        <el-input v-model="readyDoform.memo"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="date">
                        <el-date-picker v-model="readyDoform.date" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                        <el-button @click="showAddReadyDo = false">取 消</el-button>
                        <el-button type="primary"  @click="saveReadyDo('readyDoform')" >确 定</el-button>
                      </span>
            </el-dialog>
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
            showAddReadyDo: false,
            othersIdList: [],
            userId: localStorage.getItem('userId'),
            relationUserInfoId: localStorage.getItem('relationUserInfoId'),
            relationUserInfoName: localStorage.getItem('relationUserInfoName'),
            selectWord: '',
            unReadList: [],
            readList: [],
            recycleList: [],
            othersId: '',
            message: 'first',
            showHeader: false,
            rules: {
                date: [{ type: 'date', required: true, message: '请选择日期', trigger: 'blur' }],
                memo: [{ required: true, message: '请选择商品', trigger: 'blur' }],
                title: [{ required: true, message: '请填写商品存放位置', trigger: 'blur' }],

            },
            readyDoform: {
                updater: localStorage.getItem('relationUserInfoName'), //默认该字段为创建人姓名
                creator: localStorage.getItem('relationUserInfoId'), //默认该字段为创建人Id
                title: '',
                date: '',
                status: 'unRead',
                memo: ''
            },
        }
    },
    methods: {
        saveReadyDo(readyDoform) { //保存待办信息
            this.$refs[readyDoform].validate((valid) => {
                if (valid) {
                    this
                        .$axios
                        .post('/others/saveReadyDo', {
                            userId: this.userId,
                            readyDoform: this.readyDoform
                        })
                        .then((response) => {
                            this.reload()

                        })
                        .catch(function(error) {}.bind(this));
                } else {

                    return false;
                }
            });

        },






        /*获取代办信息*/
        getUnReadInfo() {
            this
                .$axios
                .post('/others/selectPage', {
                    userId: this.userId,
                    selectWord: this.selectWord,
                    status: 'unRead'
                })
                .then((response) => {
                    this.total = response.data.total
                    this.currentPage = response.data.current
                    this.unReadList = response.data.records

                })
                .catch(function(error) {}.bind(this));

        },
        getReadInfo() { //获取已读数据
            this
                .$axios
                .post('/others/selectPage', {
                    userId: this.userId,
                    selectWord: this.selectWord,
                    status: 'read'
                })
                .then((response) => {
                    this.total = response.data.total
                    this.currentPage = response.data.current
                    this.readList = response.data.records

                })
                .catch(function(error) {}.bind(this));

        },
        getRecycleInfo() { //获取回收站数据
            this
                .$axios
                .post('/others/selectPage', {
                    userId: this.userId,
                    selectWord: this.selectWord,
                    status: 'recycle'
                })
                .then((response) => {
                    this.total = response.data.total
                    this.currentPage = response.data.current
                    this.recycleList = response.data.records

                })
                .catch(function(error) {}.bind(this));

        },
        handleRead(othersId) { //将状态修改为已读

            this.othersId = othersId;
            this
                .$axios
                .post('/others/changeStatus', {
                    othersId: this.othersId,
                    status: 'read',
                    relationUserInfoId: this.relationUserInfoId,
                    relationUserInfoName:this.relationUserInfoName
                })
                .then((response) => {

                    if (response.data.code == '200') {
                        this.$message.success(response.data.data);
                    } else {
                        this.$message.success(response.data.data);
                    }
                    this.reload();

                })
                .catch(function(error) {}.bind(this));
        },
        handleReadAll() { //将状态修改为已读
            this
                .$axios
                .post('/others/changeBatchStatus', {
                    othersFromList: this.unReadList,
                    status: 'read',
                    relationUserInfoId: this.relationUserInfoId,
                     relationUserInfoName:this.relationUserInfoName
                })
                .then((response) => {
                    if (response.data.code == '200') {
                        this.$message.success(response.data.data);
                    } else {
                        this.$message.error(response.data.data);
                    }
                    this.reload();
                })
                .catch(function(error) {}.bind(this));

        },
        handleDel(othersId) {

            this.othersId = othersId;
            this
                .$axios
                .post('/others/changeStatus', {
                    othersId: this.othersId,
                    status: 'recycle',
                    relationUserInfoId: this.relationUserInfoId,
                     relationUserInfoName:this.relationUserInfoName
                })
                .then((response) => {
                    if (response.data.code == '200') {
                        this.$message.success(response.data.data);
                    } else {
                        this.$message.success(response.data.data);
                    }
                    this.reload();

                })
                .catch(function(error) {}.bind(this));
        },
        handleDelAll() {
            this
                .$axios
                .post('/others/changeBatchStatus', {
                    othersFromList: this.readList,
                    status: 'recycle',
                    relationUserInfoId: this.relationUserInfoId,
                     relationUserInfoName:this.relationUserInfoName
                })
                .then((response) => {
                    if (response.data.code == '200') {
                        this.$message.success(response.data.data);
                    } else {
                        this.$message.error(response.data.data);
                    }
                    this.reload();
                })
                .catch(function(error) {}.bind(this));

        },
        handleRestore(othersId) {
            this.othersId = othersId;
            this
                .$axios
                .post('/others/changeStatus', {
                    othersId: this.othersId,
                    status: 'unRead',
                    relationUserInfoId: this.relationUserInfoId,
                     relationUserInfoName:this.relationUserInfoName
                })
                .then((response) => {

                    if (response.data.code == '200') {
                        this.$message.success(response.data.data);
                    } else {
                        this.$message.success(response.data.data);
                    }
                    this.reload();

                })
                .catch(function(error) {}.bind(this));
        },
        handleRestoreAll() {
            this
                .$axios
                .post('/others/changeBatchStatus', {
                    othersFromList: this.recycleList,
                    status: 'delete',
                    relationUserInfoId: this.relationUserInfoId,
                     relationUserInfoName:this.relationUserInfoName
                })
                .then((response) => {
                    if (response.data.code == '200') {
                        this.$message.success(response.data.data);
                    } else {
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
