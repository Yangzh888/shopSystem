<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 订单分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="订单分析" name="first">
                <el-row>
                    <el-col :span="1"> &nbsp;</el-col>
                    <el-col :span="22">
                        <el-card :body-style="{ padding: '0px' }" style="background:#E4E7ED">
                            <div slot="header" class="clearfix" style="text-align: center;font-size: 18px;color: red;font-weight: bold;">
                                <span >关于订单</span>
                            </div>
                            <div style="padding: 5px;">
                                <p style="text-align: center;color: #303133;font-size: 24px; padding: 4px">
                                   出库订单总金额： <span style=" font-weight: bold; color: red"> {{orderInfo.goodsOutTotal}}元</span>
                                </p>
                                <p style="text-align: center; color: #606266;font-size: 18px; padding: 8px">
                                    所有出库订单总数：<span style=" font-weight: bold; color: black">{{orderInfo.goodsOutNumber}}个</span>
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
        this.getOrderInfo();

    },
    data() {
        return {
            orderInfo: {},
            activeName: 'first',
            userId: localStorage.getItem('userId'),
              aboutOrderchartData: {
          columns: ['月份', '金额'],
          rows: []
        },
        }
    },
    methods: {

        /*获取商品信息*/
        getOrderInfo() {
            this
                .$axios
                .post('/budget/getOrderInfo', {
                    userId: this.userId,
                })
                .then((response) => {
                    console.log(response.data)
                    this.aboutOrderchartData.rows=response.data.orderInfoList
                    this.orderInfo=response.data.orderInfo

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
