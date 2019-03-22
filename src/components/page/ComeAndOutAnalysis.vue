<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 收支分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-date-picker v-model="selectMonth" type="month" placeholder="选择月" value-format="yyyy-MM">
                </el-date-picker>
                <el-button type="primary" icon="search" @click="getOneMonthComeAndOut()">搜索</el-button>
            </div>
            <div >
                <el-row v-if="showEcharts">
                    <ve-line :data="chartData"></ve-line>
                </el-row>
            </div>
            <div style="height: 600px" v-if="showNull">
                <el-row style="height: 150px"></el-row>
                <el-row>
                    <el-col :span="10">
                        &nbsp;
                    </el-col>
                    <el-col :span="6">
                        <p style="color:#909399">该月份暂无数据喔，赶快去录入数据吧！</p>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
export default {
    mounted: function() {
        this.getOneMonthComeAndOut();
    },
    inject: ['reload'],
    data() {
        return {
            showEcharts: true,
            showNull:false,
            userId: localStorage.getItem('userId'),
            selectMonth: '',
            chartData: {
                columns: ['日期', '当天收入', '当天支出'],
                rows: []
            },
        }
    },

    methods: {
        getOneMonthComeAndOut() {
            this
                .$axios
                .post('/budget/getOneMonthComeAndOut', {
                    userId: this.userId,
                    selectMonth: this.selectMonth,
                })
                .then((response) => {
                    if(response.data.code==200){
                       this.showEcharts=true
                    }
                    if (response.data.code == 400) {
                        this.showEcharts = false
                       this.showNull=true
                    } 
this.chartData.rows = response.data.data

                })
                .catch(function(error) {}.bind(this));
        },
    }
}

</script>
<style scoped>
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

</style>
