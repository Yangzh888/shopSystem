<template>
  <div class="sidebar">
<el-input
  placeholder="请输入内容"
  v-model="input" @keyup.enter.native="search"
  clearable>
</el-input>
 <el-button @click="search()">查询</el-button>
 <el-button type="primary" @click="insertDialog=true">新增题目</el-button>
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
  <el-dialog title="新增" :visible.sync="insertDialog">>
  <el-form :model="form">
    <el-form-item label="题目名字" :label-width="formLabelWidth">
      <el-input v-model="form.input2" autocomplete="off"></el-input>
    </el-form-item>
   <el-form-item label="答案" :label-width="formLabelWidth">
      <el-input v-model="form.input3" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="insertDialog = false">取 消</el-button>
    <el-button type="primary" @click="saveTitleAndAnswer()">确 定</el-button>
  </div>
</el-dialog>
</div>



 
</template>
<script>
  export default {
    data() {
      return {
        dialogFormVisible:false,
        insertDialog:false,
        input: '',
        todoList:[],
        form:{
          input2:'',
          input3:''},
          formLabelWidth: '120px'
        
      }
    },
    methods:{
      
       search() {
        var param=JSON.stringify(this.input);
            this
                .$axios
                .post('/income/search', {
                    title: this.input,
                    param:this.param
                })
                .then((response) => {
                    console.log(response.data) 
                    this.todoList=response.data;
                })
                .catch(function(error) {}.bind(this));
        },
        saveTitleAndAnswer(){
           this
                .$axios
                .post('/income/saveTitleAndAnswer', {
                    question: this.form.input2,
                    answer: this.form.input3
                })
                .then((response) => {
                    console.log(response.data) 
                    this.insertDialog=false;
                })
                .catch(function(error) {}.bind(this));
        }

    }
  }
</script>
