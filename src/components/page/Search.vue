<template>
  <div class="sidebar">
<el-input
  placeholder="请输入内容"
  v-model="input" @keyup.enter.native="search"
  clearable>
</el-input>
 <el-button @click="search()">查询</el-button>
 <el-table
    :data="todoList"
    border
    style="width: 100%">
    <el-table-column
      prop="title"
      label="题目"
      width="500">
    </el-table-column>
    <el-table-column
      prop="creator"
      label="关键字"
      width="180">
    </el-table-column>
    <el-table-column
      prop="memo"
      label="答案">
    </el-table-column>
  </el-table>
</div>

 
</template>
<script>
  export default {
    data() {
      return {
        input: '',
        todoList:[]
      }
    },
    methods:{
       search() {
            this
                .$axios
                .post('/income/search', {
                    title: this.input
                })
                .then((response) => {
                    console.log(response.data) 
                    this.todoList=response.data;
                })
                .catch(function(error) {}.bind(this));
        },
    }
  }
</script>
