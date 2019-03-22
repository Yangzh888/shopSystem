<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 订单分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="客户分析" name="first">
                <el-row>
                    <el-col :span="1"> &nbsp;</el-col>
                    <el-col :span="22">
                        <el-card :body-style="{ padding: '0px' }" style="background:#E4E7ED">
                            <div slot="header" class="clearfix" style="text-align: center;font-size: 18px;color: red;font-weight: bold;">
                                <span >关于客户</span>
                            </div>
                            <div style="padding: 5px;">
                                <p style="text-align: center;color: #303133;font-size: 24px; padding: 4px">
                                   客户总的数量： <span style=" font-weight: bold; color: red"> {{wholesalerInfo.allWholesalerNumber}}个</span>
                                </p>
                                <p style="text-align: center; color: #606266;font-size: 18px; padding: 8px">
                                    下级客户的数量：<span style=" font-weight: bold; color: black">{{wholesalerInfo.custmerNumber}}个</span>
                                </p>
                                <p style="text-align: center; color: #606266;font-size: 18px; padding: 8px">
                                    批发商的数量：<span style=" font-weight: bold; color: black">{{wholesalerInfo.wholesalerNumber}}个</span>
                                </p>
                                <div class=" bottom clearfix">
                                </div>
                            </div>
                        </el-card>
                        <p>&nbsp;</p>
                        <ve-line :data="aboutOrderchartData"></ve-line>
                    </el-col>
                    <el-col :span="1"></el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    mounted: function() {
        this.getWholesalerInfo();

    },
    data() {
        return {
            wholesalerInfo: {},
            activeName: 'first',
            userId: localStorage.getItem('userId'),
              aboutOrderchartData: {
          columns: ['月份', '总数量'],
          rows: []
        },
        }
    },
    methods: {

        /*获取商品信息*/
        getWholesalerInfo() {
            this
                .$axios
                .post('/budget/getWholesalerInfo', {
                    userId: this.userId,
                })
                .then((response) => {
                    console.log(response.data)
                    this.aboutOrderchartData.rows=response.data.wholesalerInfoList
                    this.wholesalerInfo=response.data.wholesalerInfo

                })
                .catch(function(error) {}.bind(this));

        },
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
}

</script>
<style>
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 480px;
}

</style>
